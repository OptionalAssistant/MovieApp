import {Schema,model} from 'mongoose'
import { IMovie } from '../types/typesClient'


const MovieSchema = new Schema<IMovie>(
    {
        name: {type: String,required: true},
    }
)

export default model<IMovie>("Movie",MovieSchema);