import { Router, Request, Response } from "express";
import GameControl from "../controller/game.controller";
import Autenticate from "../middlewares/autenticate";

const routeGame = Router()
const gameController = new GameControl;
const checkToken = new Autenticate

routeGame.post('/createGameStock',checkToken.autenticate, async(req: Request, res: Response) => {
    try{
      const game = req.body
      const image = req.files
      const {id} = req.body.user_client
      const response = await gameController.createGameStock(game,id ,image)
      return res.status(response.code).json(response)
   }catch (error: any){
      return res.status(error.code ? error.code: 500).json(error)
   }
      
})


routeGame.get('/getGames/:id',checkToken.autenticate, async(req: Request, res: Response) => {
    try{
       const id = req.params.id as string
       const response = await gameController.getGameStock(id)
       return res.status(response.code).json(response)
    }catch(error: any){
       return res.status(error.code ? error.code : 500).json(error)
    }
 })

 routeGame.get('/getAllGames',checkToken.autenticate, async(req: Request, res: Response) => {
    try{
       const response = await gameController.getAllGames()
       return res.status(response.code).json(response)
    }catch(error: any){
       return res.status(error.code ? error.code : 500).json(error)
    }
 })

 routeGame.put('/putGameStock/:id',checkToken.autenticate, async(req: Request, res: Response) => {
    try{
       const game = req.body
       const idGame = req.params.id as string
       const idUser = req.body.user_client.id
       const image = req.files
       const response = await gameController.putGameStock(game, idGame, idUser, image)
       return res.status(response.code).json(response)
    }catch (error: any){
     return res.status(error.code ? error.code: 500).json(error)
    }
 })

 routeGame.delete('/deleteGameStock/:id', checkToken.autenticate, async(req: Request, res: Response) => {
    try{
       const idUser = req.body.user_client.id
       const idGame = req.params.id as string
       const response = await gameController.deleteGameStock(idUser, idGame)
       return res.status(response.code).json(response)      
     }catch(error: any){
         return res.status(error.code ? error.code: 500).json(error)
     }
 })

 routeGame.get('/image/:img', checkToken.autenticate, async(req: Request, res: Response)=>{
    try {
        const { img } = req.params;
        const response = await gameController.getImageVideoGame(img)
        return res.sendFile(response)
    } catch (error: any) {
        return res.status(error.code ? error.code: 500).json(error)
    }
 })

export default routeGame;