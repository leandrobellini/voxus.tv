var express         = require("express"),
app                 = express(),
bodyParser          = require("body-parser"),
methodOverride      = require("method-override"),
googleStrategy      = require('passport-google-oauth').OAuth2Strategy,
passport            = require('passport');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new googleStrategy({
    clientID      : '184699945326-5pl6a4tlsd99h73pi3roov07igpmvc7v.apps.googleusercontent.com',
    clientSecret  : 'K2BxzV4t2z-bWtdAQs7yK8m8',
    callbackURL   : 'http://localhost:8080/auth/google/callback',
    passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
));

//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use( passport.initialize());

var logado = 0;

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

app.get('/auth/google', 
    passport.authenticate('google',{scope: ['profile', 'email']})
);

app.get('/auth/google/callback', function(req, res) {
    logado = 1;

    res.redirect("/");
});


app.get('/logout', function (req, res) {
        logado = 0;
        res.redirect('/');
});

app.get('/login', function (req, res) {
    res.render("login");
});

function isLoggedIn(req, res, next) {
    
    if (logado == 1)
        return next();

    res.redirect('/login');
}

app.use(isLoggedIn);

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
