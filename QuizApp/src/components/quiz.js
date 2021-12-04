import { useContext, useEffect, useRef, useState } from "react";
import { QuizContext } from "../helpers/context";
import { Questions } from "../helpers/questions";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import Axios from "axios";
import "../App.css";

function Quiz() {
  // Here we initialize variables that we can render later on using the useState hook of React:
  const [questionNumber, setquestionNumber] = useState(0);
  const [userAnswerChoice, setUserAnswerChoice] = useState("");
  const [displayresults, setDisplayResults] = useState("hide");
  const [showQuiz, setShowQuiz] = useState("show");
  const [showWiki, setShowWiki] = useState("hide");
  const [wikiAnswer, setWikiAnswer] = useState("");
  const [showWikiAnswer, setShowWikiAnswer] = useState([]);
  const [axiosAnswer, setaxiosAnswer] = useState("");
  const [checkAnswer, setCheckAnswer] = useState("");
  const [imageFile, setImageFile] = useState("");

  // object deconstruction to take out the necessary variables from our useContext hook:
  const { points, setPoints, userName } = useContext(QuizContext);

  // We set the component mounted to true on default. We toggle it false when we check if it is mounted. Returns to true on default:
  const componentMounted = useRef(true);

  // Wikipedia scraper service will be called each time we load the page in /quiz. useEffect is called once for every page load due to the second parameter: [].
  useEffect(() => {
    // First we parse/slice out the "state" word for the last part of our wikipedia search to create the correct query structure: "city,_state"
    let state = Questions[questionNumber].prompt.slice(
      Questions[questionNumber].prompt.lastIndexOf(" ") + 1,
      -1
    );
    // console.log(
    //   Questions[questionNumber][Questions[questionNumber].answer] + ",_" + state
    // );

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

  // Here we talk to our backend to collect the microservice returned image URL: No parameters needed. Called once per page load:
  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then((data) => {
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
    setShowQuiz("hide"); // Open wiki function thus put showWiki to "show" and showQuiz to "hide"
    setShowWiki("show");
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

    // We use the same logic here to send an axios call for the Questions 2-9. Earlier
    // it only works for Question 1:
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

  // We flip the switch to close the wiki
  const closeWiki = () => {
    setShowQuiz("show"); // close wiki function thus put showWiki to "hide" and showQuiz to "show"
    setShowWiki("hide");

    // we set question number plus one so that when the quiz returns, it renders the next question in our JSON object file:
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
      {/* We use the && operator to show elements: if the first part is true and the second part is true, then the second part is rendered.
      Same logic is used throughout the program. The logic is to control the first element to true or false which can turn "on" and "off" the
      second part of the && operator. */}
      {showQuiz === "show" && (
        <div className="Quiz">
          <h1>{Questions[questionNumber].prompt}</h1>
          <div className="questions">
            {/* Here we use BootStrap React to make the buttons look more standardized and organized */}
            <Row className="mx-0">
              <Button
                as={Col}
                className="abcdButtons"
                variant="primary"
                onClick={() => {
                  setUserAnswerChoice("choiceA");
                }}
              >
                {Questions[questionNumber].choiceA}
              </Button>
              <Button
                as={Col}
                className="abcdButtons"
                variant="primary"
                onClick={() => {
                  setUserAnswerChoice("choiceB");
                }}
              >
                {Questions[questionNumber].choiceB}
              </Button>
            </Row>
            <Row className="mx-0">
              <Button
                as={Col}
                className="abcdButtons"
                variant="primary"
                onClick={() => {
                  setUserAnswerChoice("choiceC");
                }}
              >
                {Questions[questionNumber].choiceC}
              </Button>
              <Button
                as={Col}
                className="abcdButtons"
                variant="primary"
                onClick={() => {
                  setUserAnswerChoice("choiceD");
                }}
              >
                {Questions[questionNumber].choiceD}
              </Button>
            </Row>
            <h4>
              Your Answer Choice: {Questions[questionNumber][userAnswerChoice]}
            </h4>

            {/* when user submits answer, we open the wiki page for that answer */}
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
            {/* Image file source is from an open image resource where anyone can use the image without sourcing */}
            <img src={imageFile} />
          </div>
          {/* after showing the information, the user can close the wiki to get to the next question: */}
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
          <h1>Quiz Results</h1>
          <h3>
            {userName}'s score: {points} / {Questions.length}
          </h3>
          {/* after quiz is done, we can link them back to home and also reset the user points back to 0:  */}
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
