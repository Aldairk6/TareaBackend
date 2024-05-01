import logger from "../../lib/logger";
import MongoConn from "../../lib/mongodb"
import Encrytion from "../class/encryptation.class";
import IResponse from "../interfaces/response.interface";
import IUser from "../interfaces/user.interface";
import User from "../models/user.model";
import JWTUtil from "../utils/jwt.util";

export default class UserController {
    private mongoConn: MongoConn;
    private encryption: Encrytion;
    private jwtUtil: JWTUtil;
    constructor(){
        this.mongoConn = new MongoConn();
        this.encryption = new Encrytion();
        this.jwtUtil = new JWTUtil();
    }
    async createUser(user:IUser):Promise<IResponse>{
        try {
            await this.mongoConn.connectDB()
            const{salt, passwordEncrypted} = await this.encryption.encryptPassword(user.password)
            user.salt = salt;
            user.password  = passwordEncrypted;
            const userCreate = await User.create(user)
            return { ok : true, message: "Usuario creado", response: userCreate, code: 201}
        } catch (error) {
            logger.error("[UserController/createUser]", error)
            return { ok : false, message: "Error Ocurred", response: error, code: 500}
        } finally{
            await this.mongoConn.disconnectDB();
        }
    }

    async login(user: IUser):Promise<IResponse>{
        try {
            await this.mongoConn.connectDB()
            const findUser: IUser = await User.findOne({email: user.email}) as any 
            if(!findUser){
                return { ok : false, message: "User not Found", response: null, code: 404}
            }
            const validation = await this.encryption.descryptPassword(findUser,user.password)
            if(validation){
                const payload = {
                    id: findUser._id,
                    name: findUser.name,
                    email: findUser.email,
                    rol: findUser.rol
                }
                const token = await this.jwtUtil.generateToken(payload)
                return { ok : true, message: "Login iniciado", response: payload, code: 201 , token: token}
            }else{
                return { ok : false, message: "Email or Password incorrect", response: null, code: 400}
            }
        } catch (error) {
            logger.error("[UserController/login]", error)
            return { ok : false, message: "Error Ocurred", response: error, code: 500}
        } finally{
            await this.mongoConn.disconnectDB();
        }
        
    }
}