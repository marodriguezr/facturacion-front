import {
    Switch,
    Route,
    useRouteMatch,
    useParams
} from "react-router-dom";

export const Module1Router = () => {
    const match = useRouteMatch();

    return (
    <Switch>
        <Route exact path={`${match.path}/nonDef`}>
            <h1>Non Def</h1>
        </Route>
        <Route exact path={`${match.path}`}>
            <h1>Def</h1>
        </Route>
    </Switch>
    );
};