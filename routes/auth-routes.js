const health = require('../services/health')
const passport = require('passport')

module.exports = (app) => {
  app.get('/health', health)

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  app.get('/auth/google/callback', passport.authenticate('google'))

  // GET is bad method for logout, because it's action
  app.post('/auth/logout', (req, res) => {
    if(req.user) {
      console.log("Logout")
      req.logout()
    }
    res.sendStatus(202) // accepted
  })

  app.get("/api/user/current", (req, res) => {
    res.send(req.user)
  })
}

