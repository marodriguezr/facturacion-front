import {
    Switch,
    Route,
    useRouteMatch,
    useParams
} from "react-router-dom";

import { Facturacion } from "../containers/facturacion/index.js";
import { Configuracion } from "../containers/facturacion/Configuracion.js";
import { NavigationBar } from "../components/facturacion/NavigationBar.js";
import { Footer } from "../components/facturacion/Footer.js";
import { useState } from "react";

export const FacturacionRouter = () => {
    const match = useRouteMatch();

    const [status, setStatus] = useState("A la espera de interacción");  

    return (
        <>
            <NavigationBar></NavigationBar>
            <Switch>
                <Route exact path={`${match.path}/`}>
                    <Facturacion setStatus={setStatus}></Facturacion>
                </Route>
                <Route exact path={`${match.path}/configuracion`}>
                    <Configuracion></Configuracion>
                </Route>
                <Route exact path={`${match.path}/administracion`}>
                    <h1>Administracion</h1>
                </Route>
            </Switch>
            <Footer content={status}></Footer>
        </>
    );
};