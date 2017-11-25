import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Payments from './Payments'

class Header extends Component {
  constructor(props) {
    super(props)
    this.renderContent = this.renderContent.bind(this)
  }

  renderContent() {
    const { auth } = this.props
    switch (auth) {
      case null:
        return
      case false:
        return (
          <li>
            <a href="/auth/google">Loggin with Google</a>
          </li>
        )
      default:
        return [
          <li key="paymeny">
            <Payments />
          </li>,
          <li key="credits" style={{ margin: '0 10px' }}>
            Credits {this.props.auth.credits}
          </li>,
          <li key="logout">
            <a href="/api/logout">Logout</a>
          </li>
        ]
    }
  }

  render() {
    const logoRedirect = this.props.auth ? '/surveys' : '/'
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to={logoRedirect} className="left brand-logo">
            Emaily
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

export default connect(mapStateToProps)(Header)
