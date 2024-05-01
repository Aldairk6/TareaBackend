import path from "path"
import fs from "fs"

export default class ImageUtil{
  async validFormat(logo:any){
    const valid = ['jpg','jpeg','png']
    const nameFile = logo.name.split('.').pop()
    return valid.includes(nameFile);
  }

  async uploadImage(logo: any, newName:string){
    const dir = path.join(__dirname, `../uploads/game/${newName}`);  
    const logoForm = logo;
    logoForm.mv(dir, (err:any) =>{
        if(err){
            return false;
        }
    })
    return true;
  }

  async newName(logo:any){
    const extension = logo.name.split('.').pop();
    const newName = `${Date.now()}.${extension}`;
    return newName;
  }

  async deleteImage(image:string){
    const dir = path.join(__dirname, `../uploads/game/${image}`); 
    await fs.promises.unlink(dir)
  }
}