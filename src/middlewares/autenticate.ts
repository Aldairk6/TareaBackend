import { NextFunction, Request, Response } from "express";
import JWTUtil from "../utils/jwt.util";
import IResponse from "../interfaces/response.interface";


export default class Autenticate{
    async autenticate(req: Request, res:Response, next:NextFunction){
        try {
            if(!req.headers.authorization){
                const response: IResponse ={
                    ok: false,
                    message: "la Peticion no tiene la cabecera de Autenticacion",
                    response: null,
                    code: 403
                }
                return res.status(response.code).json(response)
            }
            const jwtUtil = new JWTUtil();
            const token = req.headers.authorization?.replace("Bearer ","") as string;
            const decoded = await jwtUtil.decodedToken(token)
            if(!decoded){
                const response: IResponse ={
                    ok: false,
                    message: "Token Invalido",
                    response: null,
                    code: 403
                }
                return res.status(response.code).json(response)
            }
            req.body.user_client = decoded;
            next()
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }
}