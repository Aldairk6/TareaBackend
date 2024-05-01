import config from "config"
import jwt from 'jsonwebtoken';

export default class JWTUtil{
  private secret = `${config.get('jwt.secret')}`

  async generateToken(payload: any){
    const token = jwt.sign(payload, this.secret,{expiresIn: config.get("jwt.accessTokenLife"), algorithm:'HS512'});
    return token;
  }


  async decodedToken(token: string) {
    try {
        const decoded =  jwt.verify(token, this.secret, { algorithms: ['HS512'] })
        return decoded;
    } catch (error) {
        return false;
    }
}

  async tokenExp(token:string){
    const payload64 = token.split('.')[1]
    const payload = JSON.parse(atob(payload64));
    const currenDate = Math.floor(Date.now() / 1000);
    const { exp } = payload;
    return exp > currenDate;
  }
}