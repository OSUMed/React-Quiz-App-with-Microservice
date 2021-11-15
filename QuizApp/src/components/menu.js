import "../App.css";
import { useContext, useState } from "react";
import { QuizContext } from "../helpers/context";
import { Link } from "react-router-dom";

function Menu() {
  // object deconstruction to take out the necessary variables from our useContext hook:
  const { setUserName } = useContext(QuizContext);
  // Intialize variables and our useContext variable:
  const [homeImageFile, setHomeImageFile] = useState("");

  // Here the user enters their name so we can display it later. Also we render our image file here too:
  return (
    <div>
      <label>Enter your Name:</label>
      <input
        type="text"
        placeholder="Bob Smith"
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <Link to="/quiz">
        <button>Start Quiz</button>
      </Link>
      <br></br>

      <br></br>
      <div>
        <img src={homeImageFile} />
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default Menu;
