import jwt  from "jsonwebtoken";
import { IAuthMe } from "../types/typesClient";
import { Request } from "express";

export default (req : Request<{},{},IAuthMe>,res,next)=>{
    
    const token = ( req.headers.authorization  || '').replace(/Bearer\s?/,'');
    console.log("TOken",token);
    if(token){
            try{
                const decoded = jwt.verify(token,process.env.SECRET_KEY);

                req.body.userId = decoded.id;
                
                
                next();

            }
            catch(error)
            {
                console.log("Error");
                return res.status(403).json({
                    message:"Вы не авторизованы!(Что то пошло не так)"
                });
            }
    }
    else{
        return res.status(403).json({
            message:"Вы не авторизованы"
        });
    }

}