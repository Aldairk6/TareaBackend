import http from 'http'
import config from 'config'
import express from 'express'
import logger from '../../lib/logger';

export default class HttpServer{
  private port: number;
  private httpServer: http.Server;
  private static _instance: HttpServer;
  public app: express.Application;

  constructor(){
    this.port = config.get("api.port")
    this.app = express();
    this.httpServer = new http.Server(this.app)
  }
  public static get instance(){
   return this._instance || (this._instance = new this())
  }
  async start(){
    try{
        this.httpServer.listen(this.port)
        logger.info(`Server Run on Port ${this.port}`)
    } catch (error) {
        logger.error(`ERROR ${error}`)
    }
  }
}