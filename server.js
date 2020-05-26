//Importation des modules que l'on va utiliser.
const jwt = require('jsonwebtoken');
const request = require('request');
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

//Importation du fichier passport-config.
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

//Method Request pour une requete sur notre api avec des parametres passé pour recuperer nos donnés puis
//les enrigistrer dans un tableau appele users declarer ci-dessus.
request('https://crtoea7d0a.execute-api.us-east-1.amazonaws.com/users/login?u=john&hp=5f4dcc3b5aa765d61d8327deb882cf99',
 { json: true }, (err, res, body) => {
   if(err){
      return console.log(err);
    }
    else {
      var utilisateur='john';
      var fullname=body.fullname;
      var settruslabel=body.seetrusLabel;
      const motdepasse = 'password'
     users.push({
       id: Date.now().toString(),
       name:fullname,
       email:utilisateur,
       setrus:settruslabel,
       password: motdepasse
     })

    }

 });
 // fonction utiliser pour des fichiers de modèle statiques dans notre application
app.set('view-engine', 'ejs')
//fonctions qui peuvent accéder à l’objet Request (req), l’objet response (res) et à la fonction middleware.
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'coll',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Method get verifiant d'abord si l'utilisateur s'est bien authentifié puis se redirige a la page index.ejs.
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.setrus })
})
//Method get execute(par defaut) verifant que l'utilisateur n'est pas encore authentifié
//puis la redirige vers la page login pour se looger.
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})
//Method post executer apres click du button next et redirige vers la page strus.ejs.
app.post('/strus',checkAuthenticated,(req, res) => {
  res.render('strus.ejs',{ noum: "ok" })
})

// Methode post execute apres avoir cliké sur le button connect.
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

//Methode delete executé apres avoir cliquer sur le button se deconnecter.
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
//Fonction pour verifier si l'utisateur  est deja authenfié ou sinon directement redirigé a la page login.
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

//Fonction pour verifier si l'utisateur  n'est pas encore authenfié ou sinon redirigé a la page souhaité d'acceder
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)
