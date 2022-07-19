const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //For database
const _ = require("lodash");

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



//Connect with mongodb database.
mongoose.connect("mongodb://localhost:27017/toDolistDB");


const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "This is your ToDoList"
})

const item2 = new Item({
    name: "Hit + for add new items"
})

const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];



//For any other routes
const listSchema = {
    name: String,
    items: [itemSchema] //Embedde with an array of itemSchema //i.e defaultItems is array of listSchema
}

const List = mongoose.model("List", listSchema);




app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully updated default items");
                }
            });

            res.redirect("/");

        } else {
            res.render("list", { listTitle: "MyToDoList", newItems: foundItems });
        }

    })
});




//Add new item :
app.post("/", function (req, res) {


    const itemName = req.body.newWork;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "MyToDoList") {
        item.save();
        res.redirect("/");
    } else {
        //Find the list and the new item to it.
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);  //Here we are using push method of Java Script.
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});





//Access to other routes
//Creating custom list
app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    //Here foundList is a list not an array so we check if it's exist(!foundList)
    //instead of checking it's length.

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName);
            } else {
                //List is already exis so render the list.
                res.render("list", { listTitle: foundList.name, newItems: foundList.items });
            }
        }
    });


})






app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="MyToDoList"){
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Successfully deleted item");
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name:listName},{$pull :{items :{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }


    
});



app.listen(3000, function (req, res) {
    console.log("Server starting at port 3000");
});