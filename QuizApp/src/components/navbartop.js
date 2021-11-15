import React from "react";
import { NavLink } from "react-router-dom";

function NavBarTop() {
  // Here we render our top navigation bar with the link back to home:
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="nav-item nav-link" to="/">
        Home
      </NavLink>

      <br />
      <br />
      <br />
    </nav>
  );
}

export default NavBarTop;
