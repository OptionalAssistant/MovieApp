import mongoose, {Schema,model} from 'mongoose'
import { IFullMovie,ICategory } from '../types/typesRest'


const MovieSchema = new Schema<IFullMovie>(
    {
        name: {type: String,required: true},
        date: {type: String,required: true},
        country: {type: String,required : true},
        imageUrl : {type : String},
        trailerUrl: {type: String},
        description:{type:String,required : true},
        categories: [{type : mongoose.Schema.Types.ObjectId,ref: 'Category'}]
    }
)



export default model<IFullMovie>("Movie",MovieSchema);