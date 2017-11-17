var express         = require("express"),
app                 = express(),
bodyParser          = require("body-parser"),
methodOverride      = require("method-override");
GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;

//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//auth
var configAuth = require('./auth');

var tasks = [
        {
            nome: "Estudar sobre AWS", 
            descricao: "Dar uma lida sobre o RDS da Amazon", 
            prioridade: 3, 
            usuario: "Leandro"
        },
        {
            nome: "Lavar o carro", 
            descricao: "Lavar com sabao neutro", 
            prioridade: 3, 
            usuario: "Leandro"
        },
        {
            nome: "Levar cachorro no veterinário", 
            descricao: "Ligar antes na clínica e levar o dog", 
            prioridade: 1, 
            usuario: "Leandro"
        }
    ];

app.get("/", function(req, res) {
    res.render("index", {tasks: tasks});
});

app.get("/tasks/new", function(req, res) {
    res.render("new");
});

app.get("/tasks/:id", function(req, res) {
    id = parseInt(req.params.id);

    if(id < 0 || id >= tasks.length || isNaN(id)){
        return res.render("task", {task: -1});
    }

    res.render("task", {task: tasks[id]});
});

app.post("/tasks", function(req, res) {
    tasks.push(req.body);

    res.redirect("/");
});

app.put("/tasks/:id", function(req, res) { 
    id = req.params.id;

    tasks[id] = req.body;

    res.redirect("/");
});

app.get("/tasks/delete/:id", function(req, res) { 
    id = parseInt(req.params.id);
    
    if(id < 0 || id >= tasks.length || isNaN(id)){
        return res.redirect("/");
    }

    tasks.splice(id, 1);

    res.redirect("/");
    
});


app.get("/tasks/edit/:id", function(req, res) { 
    id = parseInt(req.params.id);
    
    if(id < 0 || id >= tasks.length || isNaN(id)){
        return res.redirect("/");
    }

    res.render("edit", {task: tasks[id],id: id});
    
});

//Web Server Listen
app.listen(8080, function(){
    console.log("\n***********************************");
    console.log("Servidor rodando...");
}); 
