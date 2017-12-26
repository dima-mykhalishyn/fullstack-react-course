const health = (req, res) =>
  res.json({
    name: process.env.HEROKU_APP_NAME || '',
    version: process.env.HEROKU_RELEASE_VERSION || '',
    createdAt: process.env.HEROKU_RELEASE_CREATED_AT || '',
    commit: process.env.HEROKU_SLUG_COMMIT || ''
  })

module.exports = health
