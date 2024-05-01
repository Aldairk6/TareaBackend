import UserController from "../controller/user.controller";
import { Router, Request, Response } from "express";

const routeUser = Router();
const userController = new UserController;

routeUser.post('/create', async(req: Request, res: Response)=>{
    try {
       const user = req.body;
       const response = await userController.createUser(user)
       return res.status(response.code).json(response)
    } catch (error: any) {
       return res.status(error.code ? error.code: 500).json(error)
    }
 })
 
 routeUser.post('/login', async(req: Request, res: Response)=>{
    try {
       const user = req.body;
       const response = await userController.login(user);
       return res.status(response.code).json(response)
    } catch (error: any) {
       return res.status(error.code ? error.code: 500).json(error)
    }
 })

 export default routeUser;
 