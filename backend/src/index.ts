import express from 'express';

import mongoose from 'mongoose';
import cors from 'cors';
import {registerValidation,loginValidation} from './validations';
import handleValidationErrors from './handleValidationErrors'
import { UserController } from './controllers';

mongoose.connect('mongodb://127.0.0.1:27017/userdb').then(()=>
    {
        console.log("DB ok");
    }).catch(()=>{
        console.log("DB error");
    })
const app = express();

app.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h1>Home</h1>");
});


app.use(express.json());


app.post('/auth/login',loginValidation,handleValidationErrors,UserController.login);
app.post('/auth/register',registerValidation,handleValidationErrors,UserController.register);
app.get('/auth/me',UserController.getMe);

app.listen(4444);