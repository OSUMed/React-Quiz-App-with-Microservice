import "./App.css";
import Menu from "./components/menu";
import Quiz from "./components/quiz";
import NavBar from "./components/navbar";
import CreateQuiz from "./components/createquiz";
import NavBarTop from "./components/navbartop";
import { QuizContext } from "./helpers/context";
import { Route, Redirect, Switch } from "react-router-dom";
import React, { useState } from "react";
import "./App.css";

function App() {
  
  // Intialize variables and send them into our Provider so our consumer component can use these variables later on:
  const [userName, setUserName] = useState("");
  const [points, setPoints] = useState(0);

  return (
    <QuizContext.Provider
      value={{
        userName,
        setUserName,
        points,
        setPoints,
      }}
    >
      <div>
      {/* Here we set up the logic for our link navigation: */}
      <NavBarTop />
        <Switch>
          <Route path="/menu" component={Menu}></Route>
          <Route path="/quiz" component={Quiz}></Route>
          <Route path="/createquiz" component={CreateQuiz}></Route>
          <Route path="/home" component={Menu}></Route>
          <Redirect from="/" exact to="/home" />
          <Redirect to="/home" />
        </Switch>
        <NavBar />
      </div>
    </QuizContext.Provider>
  );
}

export default App;
