import React from "react";
import { NavLink } from "react-router-dom";

function NavBarTop() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="nav-item nav-link" to="/">
        Home
      </NavLink>
      {"                        "}

      <NavLink className="nav-item nav-link" to="/createquiz">
        Make Your Own Quiz!
      </NavLink>
      <br />
      <br />
      <br />
    </nav>
  );
}

export default NavBarTop;
