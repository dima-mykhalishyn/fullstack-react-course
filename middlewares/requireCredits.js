const requireCredits = (req, res, next) => {
  if(req.user.credits <= 0) {
    return res.status(403).send({ error: 'Not enough credits'})
  }
  next()
}

module.exports = requireCredits