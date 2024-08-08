import {Schema,model} from 'mongoose'
import { IMovie } from '../types/typesRest'


const MovieSchema = new Schema<IMovie>(
    {
        name: {type: String,required: true},
        date: {type: String,required: true},
        country: {type: String,required : true}
    }
)

export default model<IMovie>("Movie",MovieSchema);