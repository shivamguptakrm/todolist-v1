

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");
const app = express();
// const items =["Buy Food","Cook Food","Eat Food"];
// const workItems = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shivam:admin-123@cluster0.bpceyzw.mongodb.net/todolistDB");

const itemsSchema = {
  name:String,
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name:"Welcome to todolist!",
})

const item2 = new Item({
  name: "HIt the + button to add a new item! "
})

const item3 = new Item({
  name:"<--Hit this to delete an item!"
})

const defaultItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items:[itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

// const day = date.getDate();
  Item.find({},function(err,foundItems){
    // console.log(foundItems);
    if (foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("successfully saved default items to DB");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today",newListItems:foundItems,})
    }
  })
});

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName},function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: customListName,
          items:defaultItems,
        })
        list.save();
        res.redirect("/" + customListName)
      } else{
        res.render("list", {listTitle: foundList.name, newListItems:foundList.items})
      }
    }
  })
});


// app.get("/work", function(req,res){
//   res.render("list",{listTitle:"Work List",newListItems:workItems,route:"/work"});
// });



app.post("/", function(req,res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name:itemName,
  });

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" +listName);
    })
  }
})

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName =req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("successfully deleted checked item");
        res.redirect("/");
      }
    })
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+ listName);
      }
    })

  }

})

app.post("/work", function(req,res){
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen( port, function() {
  console.log("server has started successfully");
})
