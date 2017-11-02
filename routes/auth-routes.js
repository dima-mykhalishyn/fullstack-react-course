const health = require('../services/health')
const passport = require('passport')

module.exports = app => {
  app.get('/health', health)

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  )

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/surveys')
    }
  )

  app.get('/api/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/api/user/current', (req, res) => {
    res.send(req.user)
  })
}
