import React from "react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  function logout(){
    localStorage.removeItem('currentUser');
    window.location.href='/login';
  }
  return (
     
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {" "}
          {/* Changed `class` to `className` */}
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
            <span className="navbar-toggler-icon" style={{color:'white'}}></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {user ? (
                <>
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                     <i class="fa fa-user"></i>{user.name}
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a class="dropdown-item" href="#">
                          Bookings
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#" onClick={logout}>
                          Logout 
                        </a>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    {" "}
                    {/* Removed the `active` class for simplicity */}
                    <a className="nav-link" href="/register">
                      Register
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">
                      Login
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
