import { Menubar } from 'primereact/menubar';
import {useHistory, useRouteMatch} from 'react-router-dom';

export const NavigationBar = () => {
    const history = useHistory();
    const match = useRouteMatch();

    const items = [
        {
            label: 'Configuración',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'Clientes',
                    icon: 'pi pi-fw pi-plus',
                    command: () => {history.push(`${match.path}/configuracion`); }
                }
            ]
        },
        {
            label: "Administración",
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: "Registrar nueva factura",
                    icon: "pi pi-fw pi-shopping-cart",
                    command: () => {history.push(`${match.path}/createBill`)}
                },
                {
                    label: "Revisar facturas",
                    icon: "pi pi-fw pi-eye",
                    command: () => {history.push(`${match.path}/viewBills`)}
                }
            ]
        }
    ];

    return (<Menubar model={items}></Menubar>);

};