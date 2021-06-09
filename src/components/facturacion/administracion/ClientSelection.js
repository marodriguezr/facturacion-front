import { useEffect, useRef, useState } from "react";
import { billingAPI } from "../../../services/billingAPI.js";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useHistory, useRouteMatch } from "react-router";

export const ClientSelection = ({ clientsState, selectedClientState }) => {
    const history = useHistory();
    const match = useRouteMatch();
    const toast = useRef(null);
    const [clients, setClients] = clientsState;
    const [selectedClient, setSelectedClient] = selectedClientState;
    const [paymentTypes, setPaymentTypes] = useState([]);

    useEffect(() => {
        getAllClients();
        getAllPaymentTypes();
    }, []);

    const showWarn = (message = "") => {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
    }

    const showSuccess = (message = "") => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: message, life: 3000 });
    }

    const getAllClients = async () => {
        const response = await billingAPI.get("clients/getAll");
        setClients(response.data.clientsAll);
    };

    const getAllPaymentTypes= async () => {
        const response = await billingAPI.get("paymentsTypes/");
        setPaymentTypes(response.data.paymentsTypesAll);
    };

    const handleForward = () => {
        if (selectedClient === null) {
            showWarn("Por favor seleccione un cliente.");
            return;
        }
        history.push(`${match.path}selectProducts`);
    };

    return (
        <>
            <Toast ref={toast} />
            {clients === null ? <ProgressSpinner /> : <>
                <Card title="Selección de cliente" className="p-mt-2">
                    <p>Por favor, para continuar seleccione un cliente de la lista desplegable.</p>
                </Card>
                <Card className="p-mt-2">
                    <div>
                        <div className="p-field">
                            <label className="p-d-block">Cliente</label>
                            <Dropdown className="p-d-flex" value={selectedClient} options={clients} onChange={(e) => { setSelectedClient(e.value) }} optionLabel="cli_name" placeholder="Seleccione un cliente" />
                        </div>
                        <div className="p-field">
                            <label className="p-d-block">Tipo de pago</label>
                            {selectedClient === null || paymentTypes.length === 0 ? <p></p> : <p>{paymentTypes.find((e) => e.pt_id === selectedClient.cli_payment_type_id).pt_value}</p>}
                        </div>
                    </div>
                    <Button className="p-mt-2" label="Continuar" icon="pi pi-forward" onClick={handleForward} />
                </Card>
            </>}
        </>);
};