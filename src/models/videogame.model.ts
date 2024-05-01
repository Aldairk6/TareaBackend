import mongoose, { Schema} from "mongoose";
import IVideogame from "../interfaces/videogame.interface";

const gameSchema: Schema = new Schema<IVideogame>({
    gameName:{type: String, require: true},
    console:{type: String, require:true, enum:['XboxOne','Playstation5','PC','PSVita']},
    format:{type: String, require: true, enum:['CD', 'Digital', 'Memoria']},
    classification: {type: String, enum:['A','B','B15','C','D']},
    quantity:{type: Number},
    image: {type: String, required: true}

},{collection: 'games'})

const Stock = mongoose.model('games', gameSchema)
export default Stock