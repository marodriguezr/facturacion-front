import { Switch, Route } from "react-router-dom";
import { FacturacionRouter } from "./routes/FacturacionRouter.js";
import { useHistory } from "react-router-dom";

const RedirectFacturacion = () => {
  const history = useHistory();
  history.push("facturacion");
  return (<></>);
};

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <RedirectFacturacion></RedirectFacturacion>
      </Route>
      <Route path="/facturacion">
        <FacturacionRouter></FacturacionRouter>
      </Route>
    </Switch>
  );
}

export default App;
