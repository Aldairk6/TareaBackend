import config from 'config'
import mongoose from 'mongoose'
import logger from './logger'

export default class MongoConn {
  public async connectDB(){
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', true)

    try{
      await mongoose.connect(`${config.get('mongodb.url')}/${config.get('mongodb.database')}`)
      logger.info("Connected database: " + config.get('mongodb.database'))

    }catch (error){
      logger.error("Error connecting to database" + error)
  }
  }
 

  public async disconnectDB(){
    try{
        await mongoose.connection.close()
        logger.info('disconnectDB database:' + config.get('mongodb.database'))
    }catch (error) {
       logger.error("Error connecting to database" + error)
    }
  }
}