import React from "react";
import { useState } from "react";
import { NewQuestions } from "../helpers/newquestions";

function CreateQuiz() {
  const [ahelp, asetHelp] = useState(false);
  const [ahelpguide, asetHelpGuide] = useState(false);

  return (
    <div className="App">
      <button
        onMouseEnter={() => asetHelp(true)}
        onMouseLeave={() => asetHelp(false)}
      >
        Advanced Option: This button will open a new tab to insert items in CSV format
      </button>
      {ahelp && <div>CSV format Tab</div>}

      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default CreateQuiz;
