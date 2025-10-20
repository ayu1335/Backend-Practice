function auth(req, res, next) {
    try{
        const token=req.headers.token;
        if(!token){
             return res.status(401).send("Unauthorized")
        }
        const user=jwt.verify(token,JWT_SECRET_KEY);
        if(!user){
              return res.status(401).send("Unauthorized")
        }
        req.user=user;
    }
    catch(err){
         return res.status(401).send("Unauthorized")
    }
    next();
}

export default{auth};