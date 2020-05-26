const LocalStrategy = require('passport-local').Strategy
// Function pour prendre en parametre les données saisi par l'utilisateur
//puis les compares au données attendus enrigistrer dans le tableau user.
function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null){
      return done(null, false, { message: 'Nom utilisateur incorrecte' })
    }

    try {
      if (password==user.password) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Mot de passe incorrecte' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  // fonction détermine quelles données de l'objet utilisateur doivent être stockées dans la session
  passport.serializeUser((user, done) => done(null, user.id))
  // fonction enregistrant l'ID de l'utilisateur dans la session et est ensuite utilisé pour récupérer l'objet
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize
