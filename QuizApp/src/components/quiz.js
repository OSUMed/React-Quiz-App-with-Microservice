import "../App.css";
import { useContext, useEffect, useRef } from "react";
import { QuizContext } from "../helpers/context";
import { Questions } from "../helpers/questions";
import { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

function Quiz() {
  // Here we initialize variables that we can render later on using the useState hook of React:
  const [questionNumber, setquestionNumber] = useState(0);
  const [userAnswerChoice, setUserAnswerChoice] = useState("");
  const [displayresults, setDisplayResults] = useState("hide");
  const [showQuiz, setShowQuiz] = useState("show");
  const [showWiki, setShowWiki] = useState("hide");
  const [wikiAnswer, setWikiAnswer] = useState("");
  const [showWikiAnswer, setShowWikiAnswer] = useState([]);
  const [userPicked, setUserPicked] = useState("");
  const [checkAnswer, setCheckAnswer] = useState("");
  const [imageFile, setImageFile] = useState("");
  const { points, setPoints, userName } = useContext(QuizContext);
  const [loading, setLoading] = useState(false);

  // We set the component mounted to true on default. We toggle it false if the
  const componentMounted = useRef(true);

  // Wikipedia scraper service will be called each time we load the page in /quiz:
  useEffect(() => {
    // First we parse/slice out the correct word for the last part of our wikipedia search(the state)
    let state = Questions[questionNumber].prompt.slice(
      Questions[questionNumber].prompt.lastIndexOf(" ") + 1,
      -1
    );

    // Here we use a HTTPS Request to get wikipedia data for each call:
    fetch(
      // We create our parameter here by using the specific type of way wikipedia search URL's are structured: word one + ",_" + word2..
      "http://flip1.engr.oregonstate.edu:4753/" +
        Questions[questionNumber][Questions[questionNumber].answer] +
        ",_" +
        state
    )
      .then((res) => res.json())
      .then((data) => {
        // ComponentMounted logic is used because of an error: since some states are being rendered without being shown:
        // Answer formed by research here: https://stackoverflow.com/questions/54954385/react-useeffect-causing-cant-perform-a-react-state-update-on-an-unmounted-comp
        if (componentMounted.current) {
          setShowWikiAnswer((showWikiAnswer) => [...showWikiAnswer, data.Main]); // We collect our wikipedia article here
        }
        return () => {
          // Toggle componentMounted to false since the default is true and then when a new page loads, again, set it back to default True:
          componentMounted.current = false;
        };
      });
  }, []);

  // Here we talk to our backend to collect the microservice returned image URL: No parameters needed
  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then((data) => {
        // console.log("lets print this: ", data.holdURL);
        setImageFile(data.holdURL);
      });
  }, []);

  // We always have one state open: the quiz or the wikipedia/answer explanation. They work in a switch fashion where one is
  // hiding while the other is showing:
  const openWiki = () => {
    if (Questions[questionNumber].answer === userAnswerChoice) {
      setPoints(points + 1);
    }
    setUserAnswerChoice("");
    setShowQuiz("hide");
    setShowWiki("show");
    setUserPicked(Questions[questionNumber][userAnswerChoice]);
    setWikiAnswer(Questions[questionNumber].answer);
    if (userAnswerChoice === Questions[questionNumber].answer) {
      setCheckAnswer("Correct");
    } else {
      setCheckAnswer("Incorrect");
    }
  };

  // We flip the switch to close the wiki, we set question number plus one so that when the quiz returns, it renders the next question instead:
  const closeWiki = () => {
    setShowQuiz("show");
    setShowWiki("hide");

    if (questionNumber + 1 < Questions.length) {
      setquestionNumber(questionNumber + 1);
    } else {
      setDisplayResults("show");
      setShowQuiz("hide");
    }
  };

  // Here we parse through our JSON object to first map out the questions, update the setUserAnswerChoice,
  // and then toggle the showQuiz and showWiki variables to show the respective states:
  return (
    <div>
      {showQuiz === "show" && (
        <div className="Quiz">
          <h1>{Questions[questionNumber].prompt}</h1>
          <div className="questions">
            <button
              className="button1"
              onClick={() => {
                setUserAnswerChoice("choiceA");
              }}
            >
              {Questions[questionNumber].choiceA}
            </button>
            <button
              className="button1"
              onClick={() => {
                setUserAnswerChoice("choiceB");
              }}
            >
              {Questions[questionNumber].choiceB}
            </button>
            <button
              className="button1"
              onClick={() => {
                setUserAnswerChoice("choiceC");
              }}
            >
              {Questions[questionNumber].choiceC}
            </button>
            <button
              onClick={() => {
                setUserAnswerChoice("choiceD");
              }}
            >
              {Questions[questionNumber].choiceD}
            </button>

            <h4>
              Your Answer Choice: {Questions[questionNumber][userAnswerChoice]}
            </h4>

            <button className="button2" onClick={openWiki}>
              Submit Answer
            </button>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      )}

      {/* When we show the wiki, we then state if the user got the answer right, what the answer is and
      more information about the correct answer from the Wikipedia clip we parsed:  */}
      {showWiki === "show" && (
        <div>
          <h2> Your answer is {checkAnswer}</h2>
          <h4>
            The correct answer is: {Questions[questionNumber][wikiAnswer]}
          </h4>
          <h4>More information:</h4>
          <p>{showWikiAnswer}</p>
          <div>
            <img src={imageFile} />
          </div>
          <button
            onClick={() => {
              closeWiki();
            }}
          >
            Next Question
          </button>
        </div>
      )}

      {displayresults === "show" && (
        <div className="Quiz">
          <h1>Quiz is Finished</h1>
          <h3>
            {userName}, you got {points} out of {Questions.length} right!
          </h3>
          {/* after quiz is done, we can link them back to home and also set the user points back to 0:  */}
          <Link to="/home">
            <button
              className="button1"
              onClick={() => {
                setPoints(0);
              }}
            >
              Play Again?
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Quiz;
