import logo from './logo.svg';
import './App.css';

import { Switch, Route } from "react-router-dom";
import {FacturacionRouter} from "./routes/FacturacionRouter.js";

import {ModuleOne} from "./containers/moduleOne/index.js";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        {/* Pagina de presentacion  */}
        <ModuleOne></ModuleOne>
      </Route>
      <Route path="/facturacion">
        <FacturacionRouter></FacturacionRouter>
      </Route>
    </Switch>
  );
}

export default App;
