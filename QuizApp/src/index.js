import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  // Here we just render our app project inside a router
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
