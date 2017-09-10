const passport = require('passport')
const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    const request = { googleId: profile.id }
    User.findOne(request).then(existedUser => {
      const finish = (user) => done(null/* no errors */, user)
      if(existedUser) {
        // update in the future
        finish(existedUser)
      } else {
        new User(request).save().then(newUser => {
          finish(newUser)
        })
      }
    })


  })
)