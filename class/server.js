const express = require("express");
const app = express();
// const users = require("./routes/user.js");
// const posts = require("./routes/post.js");
const session =require("express-session");

app.use(session({secret:"mysecretstring",saveUninitialized:true,resave:false}));

app.get("/session",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`requests are ${req.session.count}times`)
})

app.get("/test",(req,res)=>{
    res.send("test done");
});


app.listen(3000, () => {
console.log("server is listening to 3000")
});