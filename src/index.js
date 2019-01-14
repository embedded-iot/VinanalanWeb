import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import App from "./App";
import "./index.css";
import './public/fonts/font.scss';
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import { store } from './helper';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);