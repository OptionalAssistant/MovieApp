import { IFullMovie,ICategory } from '../types/typesRest'
import mongoose, {Schema,model} from 'mongoose'

const CategorySchema = new Schema<ICategory>({
    name : {type: String,required: true},
    movies:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
})


export default model<ICategory>('Category',CategorySchema);