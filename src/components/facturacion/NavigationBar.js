import { Menubar } from 'primereact/menubar';
import {useHistory, useRouteMatch} from 'react-router-dom';

export const NavigationBar = () => {
    const history = useHistory();
    const match = useRouteMatch();

    console.log(match);
    const items = [
        {
            label: 'Configuración',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'Clientes',
                    icon: 'pi pi-fw pi-plus',
                    command: () => {history.push(`${match.path}/configuracion`); }
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-trash'
                },
                {
                    separator: true
                },
                {
                    label: 'Export',
                    icon: 'pi pi-fw pi-external-link'
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