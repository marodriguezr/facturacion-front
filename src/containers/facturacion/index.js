import {Card} from "primereact/card" 

export const Facturacion = ({setStatus}) => {

    setStatus("Módulo de facuracion listo");

    return (<Card className="p-mt-2" title="Módulo de facturacion" subTitle="Bienvenido/a">
        <p>Instrucciones:</p>
        <br></br>
        <p>Por favor para interactuar con las funciones del módulo presione el botón que dese en la barra de navegación.</p>
    </Card>);
};