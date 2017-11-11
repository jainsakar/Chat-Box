var express=require("express");
var socket=require("socket.io");

var app=express();
var server = app.listen(4000,function(){
  console.log("listening to port 4000");
});
var io=socket(server);
users=[];
app.use(express.static("public"));
//rendering index.html
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
io.on("connection",function(socket){ //checking for connection
  console.log("made socket connection");
  socket.on("chat",function(data){
    io.sockets.emit("chat",data);
  });
  socket.on("typing",function(data){
    socket.broadcast.emit("typing",data);
  });

  //1st step checking valid user
  socket.on("check user",function(data,callback){
    if(users.indexOf(data)!=-1){

      callback(false);
    }else {
      callback(true);
      socket.nickname=data;
      users.push(data);
      io.sockets.emit("check user",users);
      // io.sockets.emit("check user",data);
    }
  });
  socket.on("disconnect",function(){
    if(!socket.nickname)return;
    users.splice(users.indexOf(socket.nickname),1);
    io.sockets.emit("check user",users);

  })

});
