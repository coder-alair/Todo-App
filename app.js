const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.listen(process.env.PORT|3000);

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/views/public"));

mongoose
  .connect(
    "<Your MongoDb Connection String>"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const todoSchema = new mongoose.Schema({
  todo: {type:String,required:true},
  status: { type: String, enum: ["Completed", "Pending"], default: "Pending" },
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/pages/index.ejs", (req, res) => {
  res.redirect("/");
});

app.get("/todos", async (req, res) => {
  const todos = await Todo.find().select("todo status");
  res.render("pages/todos", {
    a: todos,
  });
});

app.get("/pages/todos.ejs", (req, res) => {
  res.redirect("/todos");
});


app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/pages/about.ejs", (req, res) => {
  res.redirect("/about");
});

app.get("/contact", (req, res) => {
  res.redirect("https://github.com/coder-alair");
});

app.get("/delete/:_id", async (req, res) => {
  Todo.findOneAndRemove(
    {
      _id: req.params._id,
    },
    function (err, _id) {
      if (err) throw err;

      console.log("Success");
    }
  );
  res.redirect("/todos");
});

app.get("/add/:todo", async (req, res) => {
  const todoadd=new Todo({
    todo:req.params.todo,
    Status:'Pending'
  });
  await todoadd.save();
  res.redirect("/todos");

});

