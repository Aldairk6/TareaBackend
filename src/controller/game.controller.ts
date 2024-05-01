import logger from "../../lib/logger";
import MongoConn from "../../lib/mongodb";
import IResponse from "../interfaces/response.interface";
import IUser from "../interfaces/user.interface";
import IVideogame from "../interfaces/videogame.interface";
import User from "../models/user.model";
import Stock from "../models/videogame.model";
import ImageUtil from "../utils/image.util";
import path from "path";

export default class GameControl{

    private mongoConn: MongoConn;
    private imageUtil: ImageUtil;

    constructor(){
        this.mongoConn = new MongoConn();
        this.imageUtil = new ImageUtil();
    }

    async createGameStock(game:IVideogame , id:string, file:any):Promise<IResponse>{
       try{
        await this.mongoConn.connectDB()
        if(!file){
            return({ok: true, message: "No files upload", response: null, code: 201})
        }
        const userFind = await User.findById(id) as any

        if(userFind.rol === "ROLE_ADMIN"){
            const { image } = file
            const validationImage = await this.imageUtil.validFormat(image)
            if(validationImage){
                if(game){
                    const inStock = await Stock.findOne({gameName: game.gameName})
                    if(!inStock){
                        game.image = await this.imageUtil.newName(image)
                        await this.imageUtil.uploadImage(image, game.image)
                        const gameCreateinStock = await Stock.create(game)
                        return({ok: true, message: "Videojuego Creado Existosamente", response: gameCreateinStock, code: 201})
                    }else{
                        return({ok: true, message: "Videojuego ya existe", response: inStock, code: 409})
                    }
                }
                return({ok: false, message: "Parametros Incorrectos", response: null, code: 400})
            }else{
                return({ok: false, message: "Sube una imagen correctamente", response: null, code: 400})
            }
        }else{
            return({ok: false, message: "Forbidden", response: null, code: 403})
        }
       }catch(error: any){
        logger.error('[GameControl/createGameStock]')
        return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
       }finally{
        await this.mongoConn.disconnectDB()
       } 
    }
    async getGameStock(id:string):Promise<IResponse>{
        try{
            await this.mongoConn.connectDB()
            const gameStock = await Stock.findById(id)                                                                                                           
            if(!gameStock){
                return({ok: true, message: "No hay Videojuegos", response: null, code: 404})
            }
            return({ok: true, message: "Videojuegos Encontrados", response: gameStock, code: 200})
        }catch(error: any){
             logger.error('[GameControl/getGameStock]')
             return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
        }finally{
            await this.mongoConn.disconnectDB()
        }
    }

    async putGameStock(game:IVideogame,idGame:string, idUser:string, file:any):Promise<IResponse>{
        try{
            await this.mongoConn.connectDB()
            const userFind = await User.findById(idUser) as any
            if(userFind.rol === "ROLE_ADMIN"){
                const existId = await Stock.findById(idGame) as any            
                if(!existId){
                    return({ok: false, message: "No existe el Videojuego", response: null, code: 404})
                }
                if(file){
                  const { image } = file
                  if(await this.imageUtil.validFormat(image)){
                    game.image = await this.imageUtil.newName(image)
                    await this.imageUtil.uploadImage(image, game.image)
                    await this.imageUtil.deleteImage(existId.image)
                  }
                }
                const gameUpdate = await Stock.findByIdAndUpdate(idGame, game) 
                return({ok: true, message: "Juego actualizado", response: gameUpdate, code: 403})
            }else{
                return({ok: true, message: "Forbidden", response: null, code: 403})
            }
            
        }catch(error: any){
            logger.error('[GameControl/putGameStock]')
            return({ok: false, message: "Ocurrio un Error", response: error, code: 500})
        }finally{
            await this.mongoConn.disconnectDB()
        }
    }

    async deleteGameStock(idUser:string, idGame:string):Promise<IResponse>{
        try{
            await this.mongoConn.connectDB()
            const findUser:IUser = await User.findById(idUser) as any
            if(findUser.rol === "ROLE_ADMIN"){
                const findStokGame  = await Stock.findById(idGame) as any
                if(!findStokGame){
                    return({ok: false, message: "No existe el Videojuego", response: null, code: 404})
                }else{
                    await this.imageUtil.deleteImage(findStokGame.image)
                    const stockDelete = await Stock.findByIdAndDelete(findStokGame._id)
                    return({ok: false, message: "Stock eliminado", response: stockDelete, code: 200})
                }
            }else{
                return({ok: false, message: "Forbidden", response: null, code: 200})
            }
        }catch(error: any){
            logger.error('[GameControl/deleteGameStock]')
            return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
        }finally{
            await this.mongoConn.disconnectDB()
        }
    }

    async getAllGames():Promise<IResponse>{
       try {
        await this.mongoConn.connectDB()
         const gameResponse = await Stock.find()
         if(!gameResponse){
            return({ok: false, message: "No hay registro", response: null, code: 404})
         }
         return({ok: true, message: "Game finds", response: gameResponse, code: 200})
       } catch (error) {
        logger.error('[GameControl/getAllGames]')
        return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
       }finally{
        await this.mongoConn.disconnectDB()
       }
       
    }

    async getImageVideoGame(image:string):Promise<any>{
        try {
            const dirImage = path.join(__dirname, `../uploads/game/${image}`);  
            return dirImage;          
        } catch (error) {
            logger.error('[GameControl/uploadFile]')
        return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
        }
    }
}