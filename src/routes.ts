import { Router, Request, Response, json, response } from "express";
import GameControl from "./controller/game.controller";

const routes = Router()
const GameController = new GameControl

routes.post('/createGameStock', async(req: Request, res: Response) => {
    try{
      const game = req.body
      const response = await GameController.createGameStock(game)
      return res.status(response.code).json(response)
   }catch (error: any){
      return res.status(error.code ? error.code: 500).json(error)
   }
      
})

routes.get('/getGames', async(req: Request, res: Response) => {
   try{
      const game = req.body
      const response = await GameController.getGameStock(game)
      return res.status(response.code).json(response)
   }catch(error: any){
      return res.status(error.code ? error.code : 500).json(error)
   }
})

routes.put('/putGameStock', async(req: Request, res: Response) => {
   try{
      const game = req.body
      const response = await GameController.putGameStock(game)
      return res.status(response.code).json(response)
   }catch (error: any){
    return res.status(error.code ? error.code: 500).json(error)
   }
})

routes.delete('/deleteGameStock', async(req: Request, res: Response) => {
   try{
      const game = req.body
      const response = await GameController.deleteGameStock(game)
      return res.status(response.code).json(response)      
    }catch(error: any){
        return res.status(error.code ? error.code: 500).json(error)
    }
})

export default routes