import HttpServer from "./class/server.class"
import express from 'express'
import cors from 'cors'
import routes from "./routes/routes" 
import fileForge  from "express-fileupload"
import path from "path"

const server = HttpServer.instance

server.app.enable('trusty proxy')
server.app.use(fileForge({
    createParentPath: true,
}))
server.app.use(express.urlencoded({extended: true, limit:'50mb'}))
server.app.use(express.json({limit:'50mb'}))

server.app.use('/game', express.static(path.join(__dirname,'uploads/game')))

server.app.use(cors({origin:true, credentials:true}))
server.app.use(routes) 
server.start();