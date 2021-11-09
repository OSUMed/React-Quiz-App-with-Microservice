import React, { Component } from "react";
import { useState } from "react";

function NavBar() {
  const [help, setHelp] = useState(false);
  const [helpguide, setHelpGuide] = useState(false);
  return (
    <div className="App">
      <button
        onMouseEnter={() => setHelpGuide(true)}
        onMouseLeave={() => setHelpGuide(false)}
      >
        Need Help? Hover over here for Guide!
      </button>

      {helpguide && <div className="box2">GUIDE HERE</div>}

      <br></br>
      <button
        onMouseEnter={() => setHelp(true)}
        onMouseLeave={() => setHelp(false)}
      >
        Need Help? Hover over here for email!
      </button>
      {help && <div>quizapp@OSU271.com</div>}
    </div>
  );
}

export default NavBar;


