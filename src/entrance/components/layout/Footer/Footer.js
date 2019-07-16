import React, { Component } from 'react';

import logo from '../../../img/baandalogo-2.png';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="footer-bar">
        <nav className="navbar fixed-bottom navbar-expand-sm bg-dark navbar-dark justify-content-center text-light">
          Copyright &copy; {new Date().getFullYear()} Baanda Inc.&nbsp;{' '}
          <img className="logo" src={logo} alt="logo" width="35" height="25"/>
        </nav>
      </footer>
    );
  }
  z;
}

export default Footer;
