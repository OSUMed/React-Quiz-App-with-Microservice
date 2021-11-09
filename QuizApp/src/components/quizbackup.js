import "../App.css";
import { useContext, useEffect } from "react";
import { QuizContext } from "../helpers/context";
import { Questions } from "../helpers/questions";
import { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

function Quiz() {
  const [questionNumber, setquestionNumber] = useState(0);
  const [userAnswerChoice, setUserAnswerChoice] = useState("");
  const [displayresults, setDisplayResults] = useState("hide");
  const [showQuiz, setShowQuiz] = useState("show");
  const [showWiki, setShowWiki] = useState("hide");
  const [wikiAnswer, setWikiAnswer] = useState("");
  const [showWikiAnswer, setShowWikiAnswer] = useState("");
  const [userPicked, setUserPicked] = useState("");
  const [checkAnswer, setCheckAnswer] = useState("");
  const [axiosAnswer, setaxiosAnswer] = useState("");
  const { points, setPoints, userName } = useContext(QuizContext);

  useEffect(() => {
    let state = Questions[questionNumber].prompt.slice(
      Questions[questionNumber].prompt.lastIndexOf(" ") + 1,
      -1
    );
    fetch(
      "http://flip1.engr.oregonstate.edu:4753/" +
        Questions[questionNumber][Questions[questionNumber].answer] +
        ",_" +
        state
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("the data is: ", data);
        setShowWikiAnswer(data.Main);
      });
  }, []);

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
    let state = Questions[questionNumber].prompt.slice(
      Questions[questionNumber].prompt.lastIndexOf(" ") + 1,
      -1
    );

    setaxiosAnswer(
      Questions[questionNumber][Questions[questionNumber].answer] + ",_" + state
    );

    // write two axios calls: wiki & image:

    // Axios call for wiki:
    // console.log(
    //   "Check answer first: " +
    //     Questions[questionNumber][Questions[questionNumber].answer] +
    //     ",_",
    //   state
    // );

    // Axios.get("http://flip3.engr.oregonstate.edu:5152/amount/4/length/5").then(
    //   (res) => {
    //     console.log(res.data);
    //   }
    // );
    // console.log("Check axios answer first: ", axiosAnswer);
    // console.log("http://flip1.engr.oregonstate.edu:4753/" + "banana");
    // Axios.get("http://flip1.engr.oregonstate.edu:4753/" + "banana").then(
    //   (response) => {
    //     console.log(response);
    //     //setRecords(response.data);
    //   }
    // );

    console.log("Check axios answer first: ", axiosAnswer);
    Axios.get(
      "http://flip1.engr.oregonstate.edu:4753/" +
        Questions[questionNumber][Questions[questionNumber].answer] +
        ",_" +
        state
    ).then((response) => {
      console.log(response.data.Main);
      setShowWikiAnswer(response.data.Main);
    });

    // Axios.post('http://34.71.171.250/upload', {
    //   image: 'azura.jpg',
    //   new_name: 'test2.jpg',
    //   width: 500,
    //   height: 500
    // })
    // .then(function (response) {
    //   console.log(response);
    // })

    // // Axios call for image:
    // Axios.get("https://jsonplaceholder.typicode.com/todos/1").then(
    //   (response) => {
    //     console.log(response.data);
    //     //setRecords(response.data);
    //   }
    // );
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
          <p>More information: {{ showWikiAnswer }}</p>
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
