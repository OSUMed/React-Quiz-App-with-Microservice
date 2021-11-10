import "../App.css";
import { useContext, useEffect, useRef } from "react";
import { QuizContext } from "../helpers/context";
import { Questions } from "../helpers/questions";
import { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

function Quiz() {
  const [questionNumber, setquestionNumber] = useState(0);
  const [userAnswerChoice, setUserAnswerChoice] = useState("");
  const [displayresults, setDisplayResults] = useState("hide");
  const [showQuiz, setShowQuiz] = useState("show");
  const [showWiki, setShowWiki] = useState("hide");
  const [wikiAnswer, setWikiAnswer] = useState("");
  const [showWikiAnswer, setShowWikiAnswer] = useState([]);
  const [userPicked, setUserPicked] = useState("");
  const [checkAnswer, setCheckAnswer] = useState("");
  const [axiosAnswer, setaxiosAnswer] = useState("");
  const [imageFile, setImageFile] = useState("");
  const { points, setPoints, userName } = useContext(QuizContext);
  const [loading, setLoading] = useState(false);
  const componentMounted = useRef(true); // (3) component is mounted

  // Wikipedia scrapper service will be called each time we load the page in /quiz: 
  useEffect(() => {
    // First we parse/slice out the correct word for the last part of our wikipedia search(the state)
    let state = Questions[questionNumber].prompt.slice(
      Questions[questionNumber].prompt.lastIndexOf(" ") + 1,
      -1
      );
      console.log("This is the input: ", state);
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
        if (componentMounted.current) {
          // (5) is component still mounted?
          console.log("the data is: ", data.Main);
          setShowWikiAnswer((showWikiAnswer) => [...showWikiAnswer, data.Main]); // We collect our wikipedia article here
          setLoading(false); 
        }
        return () => {
          // This code runs when component is unmounted
          componentMounted.current = false; // (4) set it to false when we leave the page
        };
      });
  }, []);

  // Here we talk to our backend to collect the microservice returned image URL: No parameters needed
  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then((data) => {
        console.log("lets print this: ", data.holdURL);
        setImageFile(data.holdURL);
      });
  }, []);

    // We always have one thing open: the quiz or the wikipedia/answer explanation. They work in a switch fashion where one is 
    // hiding while the other is showing:
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

    console.log("Check axios answer first: ", axiosAnswer);
    Axios.get(
      "http://flip1.engr.oregonstate.edu:4753/" +
        Questions[questionNumber][Questions[questionNumber].answer] +
        ",_" +
        state
    ).then((response) => {
      console.log("Check answer: ", response.data);
      setShowWikiAnswer(response.data.Main);
    });

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
            <br></br>
            <br></br>
            <br></br>
            <div>
              <img src={imageFile} />
            </div>
          </div>
        </div>
      )}
      {showWiki === "show" && (
        <div>
          <h2> You got it {checkAnswer}</h2>
          <h4>
            The correct answer is: {Questions[questionNumber][wikiAnswer]}
          </h4>
          <h4>More information:</h4>
          <p>{showWikiAnswer}</p>
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
            {userName}, you got {points} out of {Questions.length} right!
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
