import React, { Component } from 'react'
import _ from 'lodash'
import { reduxForm, Field } from 'redux-form'
import { Link } from 'react-router-dom'
import SurveyField from './SurveyField'
import { validateEmails } from '../../utils/validation'

import FIELDS from './formFields'

class SurveyForm extends Component {
  constructor(props) {
    super(props)

    this.renderFields = this.renderFields.bind(this)
  }

  renderFields() {
    return _.map(FIELDS, ({ name, label }) => {
      return <Field
        key={name}
        type="text"
        name={name}
        label={label}
        component={SurveyField}
      />
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">Cancel</Link>
          <button className="teal btn-flat right white-text"
            type="submit">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    )
  }
}

const validate = (values) => {
  const errors = {}

  errors.recipients = validateEmails(values.recipients || '')

  _.each(FIELDS, f => {
    if(!values[f.name]) {
      errors[f.name] = `You must provide ${f.title}`
    }
  })


  return errors
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm)
