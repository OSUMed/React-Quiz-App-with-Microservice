import "../App.css";
import { useContext } from "react";
import { QuizContext } from "../helpers/context";
import { Link } from "react-router-dom";

function Menu() {
    const { setUserName } = useContext(QuizContext);

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
    </div>
  );
}

export default Menu;
