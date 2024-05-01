import config from "config"
import crypto from "crypto"
import IUser from "../interfaces/user.interface";

export default class Encrytion {
    private algorithm: string;
    private key: string;
    constructor(){
        this.algorithm = config.get("key.algorithm");
        this.key = config.get("key.secret")
    }
    async encryptPassword(password:string){
        const generatorIV = crypto.randomBytes(16);
        const keyBuffer = Buffer.from(this.key, 'hex');

        const cipher = crypto.createCipheriv(this.algorithm,keyBuffer,generatorIV); //contraseña añeatorea
        let encrypted = cipher.update(password)

        encrypted = Buffer.concat([encrypted,cipher.final()])

        return {
            salt: generatorIV.toString('hex'),
            passwordEncrypted: encrypted.toString('hex')
        }
    }

    async descryptPassword(userDb:IUser, passwordUser: string){
        const saltBuffer = Buffer.from(userDb.salt as string, 'hex');
        const encryptedText = Buffer.from(userDb.password, 'hex');
        const keyBuffer = Buffer.from(this.key, 'hex');

        let descryted = crypto.createDecipheriv(this.algorithm, keyBuffer, saltBuffer);

        let passwordDB = descryted.update(encryptedText);
        passwordDB = Buffer.concat([passwordDB, descryted.final()])
        return passwordDB.toString() === passwordUser;
    }
}