import jwt  from "jsonwebtoken";
import { IAuthMe } from "../types/typesClient";
import { Request } from "express";

export default (req : Request<{},{},IAuthMe>,res,next)=>{
    
    const token = ( req.headers.authorization  || '').replace(/Bearer\s?/,'');
    console.log("Token checked",token);

    if(token){
            try{
    
                const decoded = jwt.verify(token,process.env.ACCESS_SECRET_KEY);

                req.body.userId = decoded.id;
                
                
                next();

            }
            catch(error)
            {
                console.log(error);
                if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Access token expired', code: 'AccessTokenExpired' })
                } else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Access token invalid', code: 'AccessTokenInvalid' })
                } else {
                return res.status(500).json({ message: error.message })
                }
            }
    }
    else{
        return res.status(401).json({
            message:"Вы не авторизованы"
        });
    }

}

