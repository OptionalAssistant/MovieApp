import { validationResult } from 'express-validator';

export default (req,res,next)=>
{
    console.log(req.body.email);
    console.log(req.body.name);
    console.log(req.body.password);
    console.log("Hello");
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }   

    next();
};

