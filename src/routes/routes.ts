import { Router, Request, Response, json, response } from "express";
import GameControl from "../controller/game.controller";
import UserController from "../controller/user.controller";
import Autenticate from "../middlewares/autenticate";
import routeGame from "./game.route";
import routeUser from "./user.route";

const routes = Router();
const autenticate = new Autenticate;


routes.use("/api/game", routeGame);
routes.use("/api/auth", routeUser);


export default routes;