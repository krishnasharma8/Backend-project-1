import React from 'react';

function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid"> {/* Changed `class` to `className` */}
          <a className="navbar-brand" href="/home">
            STAY-HERE
          </a>
          <button
            className="navbar-toggler" // Changed `class` to `className`
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"> {/* Removed the `active` class for simplicity */}
                <a className="nav-link" href="/register">
                  Register
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
