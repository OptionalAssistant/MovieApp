import {Schema,model} from 'mongoose'
import { IFullMovie } from '../types/typesRest'


const MovieSchema = new Schema<IFullMovie>(
    {
        name: {type: String,required: true},
        date: {type: String,required: true},
        country: {type: String,required : true},
        imageUrl : {type : String},
        trailerUrl: {type: String},
        description:{type:String,required : true}
    }
)

export default model<IFullMovie>("Movie",MovieSchema);