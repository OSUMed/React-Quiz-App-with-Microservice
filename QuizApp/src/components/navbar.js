import React from "react";
import { useState } from "react";

function NavBar() {
  // Intiailize the variables so we can use them to render later:
  const [help, setHelp] = useState(false);
  const [helpguide, setHelpGuide] = useState(false);

  // We use a "mouse enter" & "mouse leave" toggle to help show the user guides and a contact us line:
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
