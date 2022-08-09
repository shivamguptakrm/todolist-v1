const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// console.log(date());

const app = express();

const items =["Buy Food","Cook Food","Eat Food"];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/", function(req, res) {

const day = date.getDate();
  res.render("list", {listTitle: day,newListItems:items,route:"/"})
});

app.get("/work", function(req,res){
  res.render("list",{listTitle:"Work List",newListItems:workItems,route:"/work"});
});

app.post("/", function(req,res){
  const item = req.body.newItem;
  items.push(item);
  res.redirect("/");
  // console.log(req.body.newItem);
  // console.log(req.body.list);
  // if (req.body.list === "Work" ){
  //
  //   workItems.push(item);
  //   res.redirect("/work");
  // }else{
  //   items.push(item);
  //     // console.log(item);
  //   res.redirect("/");
  // }

})



app.post("/work", function(req,res){
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.listen( process.env.PORT ||3000, function() {
  console.log("server is running on port 3000");
})
