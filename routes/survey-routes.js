const mongoose = require('mongoose')
const _ = require('lodash')
const Path = require('path-parser')
const { URL } = require('url')

const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')

module.exports = app => {
  app.get('/api/surveys/:id/:choice', (req, res) => {
    res.send('Thanks for voting!')
  })

  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({
      _user: req.user.id
    }).select({ recipients: false })
    res.send(surveys)
  })

  app.post('/api/surveys/webhooks', (req, res) => {
    const pattern = new Path('/api/surveys/:surveyId/:choice')
    _.chain(req.body)
      .map(({ url, email }) => {
        const match = pattern.test(new URL(url).pathname)
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          }
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            $set: { lastResponded: Date.now() }
          }
        ).exec()
      })
      .value()
    res.status(201).send({})
  })

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body

    const survey = new Survey({
      title,
      body,
      subject,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    })

    try {
      const sendBody = surveyTemplate(survey)
      const mailer = new Mailer(survey, sendBody)
      await mailer.send()
      await survey.save()
      req.user.credits -= 1
      const user = await req.user.save()
      res.status(200).send(user)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}
