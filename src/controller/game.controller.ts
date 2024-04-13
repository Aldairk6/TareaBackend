import logger from "../../lib/logger";
import MongoConn from "../../lib/mongodb";
import IResponse from "../interfaces/response.interface";
import IVideogame from "../interfaces/videogame.interface";
import Stock from "../models/videogame.model";

export default class GameControl{

    private mongoConn: MongoConn

    constructor(){
        this.mongoConn = new MongoConn()
    }

    async createGameStock(game:IVideogame):Promise<IResponse>{
       try{
        await this.mongoConn.connectDB()
        if(game){
            const inStock = await Stock.findOne({gameID: game.gameID})
            if(!inStock){
                const gameCreateinStock = await Stock.create(game)
                return({ok: true, message: "Videojuego Creado Existosamente", response: gameCreateinStock, code: 201})
            }else{
                return({ok: true, message: "Videojuego ya existe", response: inStock, code: 404})
            }
        }
        return({ok: false, message: "Parametros Incorrectos", response: null, code: 400})
       }catch(error: any){
        logger.error('[GameControl/createGameStock]')
        return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
       }finally{
        await this.mongoConn.disconnectDB()
       } 
    }
    async getGameStock(game:IVideogame):Promise<IResponse>{
        try{
            await this.mongoConn.connectDB()
            const gameStock = await Stock.findOne({gameID: game.gameID})
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

    async putGameStock(game:IVideogame):Promise<IResponse>{
        try{
            await this.mongoConn.connectDB()
            const existId = await Stock.findOne({gameID: game.gameID}).select('-_id, -__v')
            console.log(existId)
            console.log(game)
            if(!existId){
                return({ok: false, message: "No existe el Videojuego", response: existId, code: 404})
            }
            const output = await Stock.updateOne({gameID: game.gameID},
                {
                    $set:{
                        gameName: game.gameName,
                        console: game.console,
                        format: game.format,
                        classification: game.classification,
                        quantity: game.quantity
                    }
                })
            const existGame = await Stock.findOne({gameID: game.gameID}).select('-_id, -__v')
            const response = {
                gamebefore: existId,
                gameUpdate: existGame, 
                output: output
            } 
            return({ok: true, message: "Videojuego Actualizado", response: response, code: 200})
        }catch(error: any){
            logger.error('[GameControl/putGameStock]')
            return({ok: false, message: "Ocurrio un Error", response: error, code: 500})
        }finally{
            await this.mongoConn.disconnectDB()
        }
    }

    async deleteGameStock(game:any):Promise<IResponse>{
        try{
            await this.mongoConn.connectDB()
            if(game){
                const gameExist = await Stock.findOne({gameID: game.gameID})
                if(gameExist){
                    const gameDelete = await Stock.deleteOne({gameID: game.gameID})
                    return({ok: true, message: "Videojuego Eliminado Exitosamente", response: gameDelete, code: 200})
                }else{
                    return({ ok: false, message: "Ya a sido Eliminado o No existe", response: null, code: 301})
                }
            }
            return({ok: false, message: "Parametros Incorrectos", response: null, code: 400})
        }catch(error: any){
            logger.error('[GameControl/createGameStock]')
            return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
        }finally{
            await this.mongoConn.disconnectDB()
        }
    }
}