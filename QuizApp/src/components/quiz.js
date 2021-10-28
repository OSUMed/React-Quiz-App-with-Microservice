import "../App.css";
import { useContext } from "react";
import { QuizContext } from "../helpers/context";
import { Questions } from "../helpers/questions";
import { useState } from "react";
import { Link } from "react-router-dom";

function Quiz() {
  const [questionNumber, setquestionNumber] = useState(0);
  const [userAnswerChoice, setUserAnswerChoice] = useState("");
  const [displayresults, setDisplayResults] = useState("hide");
  const [showQuiz, setShowQuiz] = useState("show");
  const [showWiki, setShowWiki] = useState("hide");
  const [wikiAnswer, setWikiAnswer] = useState("");
  const [userPicked, setUserPicked] = useState("");
  const [checkAnswer, setCheckAnswer] = useState("");
  const { points, setPoints, userName } = useContext(QuizContext);

  const openWiki = () => {
    if (Questions[questionNumber].answer === userAnswerChoice) {
      setPoints(points + 1);
    }
    setUserAnswerChoice("");
    setShowQuiz("hide");
    setShowWiki("show");
    console.log(userAnswerChoice, Questions[questionNumber].answer);
    setUserPicked(Questions[questionNumber][userAnswerChoice]);
    setWikiAnswer(Questions[questionNumber].answer);
    if (userAnswerChoice === Questions[questionNumber].answer) {
      setCheckAnswer("Correct");
    } else {
      setCheckAnswer("Incorrect");
    }
  };

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
              variant="info"
              className="button1"
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
          </div>
        </div>
      )}
      {showWiki === "show" && (
        <div>
          <h2> You got it {checkAnswer}</h2>
          <h4>
            The correct answer is: {Questions[questionNumber][wikiAnswer]}
          </h4>
          <h4>Wikipedia Article(Introduction Section)</h4>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum."
          </p>
          <h4 className="box">Image.png here</h4>
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
            {userName}, your final score is {points} / {Questions.length} !
          </h3>
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
