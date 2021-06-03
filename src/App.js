import logo from './logo.svg';
import './App.css';

import { ModuleOne } from "./containers/moduleOne/index.js";
import { ModuleTwo } from "./containers/moduleOne/index2.js"

import { Switch, Route } from "react-router-dom";

import {Module1Router} from "./routes/Module1Router.js";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <ModuleOne></ModuleOne>
        <ModuleTwo></ModuleTwo>
      </Route>
      <Route path="/module1">
        <Module1Router></Module1Router>
      </Route>
    </Switch>
  );
}

export default App;
