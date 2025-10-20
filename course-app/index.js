import express from 'express';
const app=express();
import connectDB from './connect.js';
app.use(express.json());
import router from './routes/user.js';



app.use("/user",router);

// app.post("/user/signin",signin);  


// app.get("/courses",courses)
// app.get("/user/purchases",)
// app.post("/course/purchase",)



connectDB("mongodb+srv://ayush:ayush%401335@cluster0.xcpea.mongodb.net/course-app?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(3000, () => {
      console.log(`${3000}`);
    });
  })
  .catch(err => {
    console.error("DB connection failed:", err.message);
  });