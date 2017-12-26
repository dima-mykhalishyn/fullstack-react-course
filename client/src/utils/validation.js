const RE_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validateEmails = emails => {
  const invalidEmails = emails
    .split(',')
    .map(e => e.trim())
    .filter(e => !RE_EMAIL.test(e))

  return invalidEmails.length > 0
    ? `This emails are invalid: ${invalidEmails}`
    : null
}

export { validateEmails }
