import "../App.css";
import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../helpers/context";
import { Link } from "react-router-dom";

function Menu() {
  const { setUserName } = useContext(QuizContext);
  const [homeImageFile, setHomeImageFile] = useState("");
  const [space, setSpace] = useState("\n");
  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then((data) => {
        console.log("lets print this: ", data.holdURL);
        setHomeImageFile(data.holdURL);
      });
  }, []);

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
