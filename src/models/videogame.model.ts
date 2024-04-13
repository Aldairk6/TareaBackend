import mongoose, { Schema} from "mongoose";

const gameSchema: Schema = new Schema({

    gameID: {type: Number, require:true },
    gameName:{type: String, require: true},
    console:{type: String, require:true, enum:['XboxOne','Playstation5','PC','PSVita']},
    format:{type: String, require: true, enum:['CD', 'Digital', 'Memoria']},
    classification: {type: String, enum:['A','B','B15','C','D']},
    quantity:{type: Number}

},{collection: 'games'})

const Stock = mongoose.model('games', gameSchema)
export default Stock