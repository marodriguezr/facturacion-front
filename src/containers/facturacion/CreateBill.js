import { useState } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";


import { ClientSelection } from "../../components/facturacion/administracion/ClientSelection.js";
import { ProductSelection } from "../../components/facturacion/administracion/ProductsSelection.js";

export const CreateBill = () => {
    const match = useRouteMatch();
    const clientsState = useState(null);
    const selectedClientState = useState(null);
    const productsState = useState(null);
    const selectedProductsState = useState([]);
    // const [products, setProducts] = useState(null);

    // useEffect(async () => {
    //     const response = await (inventoryAPI.get("productos"));
    //     setProducts(response.data);
    //     console.log(products)
    // }, []);

    // useEffect(() => {
    //     const setClient = clientsState[1];
    //     setClient("Hola")
    //     console.log(clientsState)
    // }, []);

    return (<>
        <Switch>
            <Route exact path={`${match.path}/`}>
                <ClientSelection clientsState={clientsState} selectedClientState={selectedClientState}></ClientSelection>
            </Route>
            <Route exact path={`${match.path}/selectProducts`}>
                <ProductSelection productsState={productsState} selectedProductsState={selectedProductsState} selectedClientState={selectedClientState}></ProductSelection>
            </Route>
        </Switch>
    </>);
};
