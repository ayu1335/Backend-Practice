const express=require('express');
    const app=express();
    app.use(express.json());
    const jwt=require('jsonwebtoken');
    const JWT_SECRET_KEY="ayush1335";
    let users=[];
    let todos=[];
    let userId=1;


    function  auth(req,res,next){
        const token=req.headers.token;
        if(!token){
           return res.status(401).send("Unauthorized");
        }
        try{
            const user=jwt.verify(token,JWT_SECRET_KEY);
            req.user=user;
        }
        catch(err){
           return res.status(401).send("Unauthorized");
        }
        next();
    }

    app.post("/signup", (req,res)=>{
        const {username,password}=req.body;
        const user={userId,username,password:password};
        users.push(user);
        userId++;
        console.log(users);
        res.status(201).send("User registered");
    })
    app.post("/signin",(req,res)=>{
        const {username,password}=req.body;
        const user= users.find(u=>u.username==username && u.password==password);
        if(!user){
            return res.status(403).send({message:"Invalid username or password"})
        }
        if(user){
            const token=jwt.sign({ username,userId:user.userId}, JWT_SECRET_KEY, { expiresIn: "1d" } );
           return res.send({token:token})
        }
    })
    app.get("/todos",auth,(req, res)=>{
        const user=req.user;
        if(!user){
            return res.status(401).send("Unauthorized")
        }
        try{
            const todo=todos.filter(t=>t.userId===user.userId);
            res.send(todo)
        }
        catch(err){
           return res.status(401).send("Unauthorized")
        }
    })
    app.post("/create-todo",auth,(req,res)=>{
        const {title,description,status}=req.body;
        const todoId=todos.length+1;
        const user=req.user;
         if(!user){
           return res.status(401).send("Unauthorized")
        }
        try{
        const todo={userId:user.userId,todoId:todoId,title:title,description:description,status:status};
        todos.push(todo);
         res.status(201).send({
            message: "Todo created successfully",
            todo: todo
        });
        }
        catch(err){
           return res.status(401).send("Unauthorized")
        }
    })
        app.put("/update-todo/:id",auth,(req,res)=>{
            const user=req.user;
            const{status}=req.body;
         if(!user){
           return res.status(401).send("Unauthorized")
        }
         const id = parseInt(req.params.id);
        try{
            todos=todos.map(t=>t.todoId===id && t.userId === user.userId ?
                {...t,...req.body}:t
            );
            res.send({msg:"Todo Updated",todos})
        }
        catch(err){
            return res.status(401).send("Unauthorized")
        }
        })
    app.delete("/delete-todo/:id",auth,(req,res)=>{
           const user=req.user;
         if(!user){
            return res.status(401).send("Unauthorized")
        }
         const id = parseInt(req.params.id);
        try{
            todos=todos.filter(t=>!(t.todoId===id && t.userId === user.userId));
        res.send({msg:"Todo Deleted",todos})
        }
        catch(err){
           return res.status(401).send("Unauthorized")
        }
        
    })
    
    app.listen(3000,()=>{
        console.log("Server started at port 3000");
    })