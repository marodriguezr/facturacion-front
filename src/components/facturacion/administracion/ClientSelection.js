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
    const [currentWritableBillCode, setCurrentWritableBillCode] = useState("");
    const [selectedClient, setSelectedClient] = selectedClientState;
    const [paymentTypes, setPaymentTypes] = useState([]);

    useEffect(() => {
        getAllClients();
        getAllPaymentTypes();
        setSelectedClient(null);
        getCurrentWritableBillCode();
    }, []);

    const showWarn = (message = "") => {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
    }

    const showSuccess = (message = "") => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: message, life: 3000 });
    }

    const getAllClients = async () => {
        const response = await billingAPI.get("clients/getByActivos");
        setClients(response.data.clientsAll);
    };
    
    const getCurrentWritableBillCode = async () => {
        const response = await billingAPI.get("bills/currentWritableBillCode");
        setCurrentWritableBillCode(response.data.last);
    };

    const getAllPaymentTypes = async () => {
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

    const handlePaymentType = () => {
        if (selectedClient.payments_type.pt_value.trim().toLowerCase() === ("credito" || "crédito")) {
            return (
                <>
                    <Dropdown className="p-d-flex" value={selectedClient.payments_type} options={paymentTypes} onChange={(e) => { setSelectedClient({ ...selectedClient, payments_type: e.value }); let currentClients = clients.slice(); currentClients.find((element) => element.cli_id === selectedClient.cli_id).payments_type = e.value; setClients(currentClients); }} optionLabel="pt_value" placeholder="Seleccione un tipo de pago" />
                </>
            );
        } else {

            return (<p>Contado</p>);
        }
    };

    const hanldeClientPaymentType = (paymentTypeId) => {
        const paymentTypeValue = paymentTypes.find((e) => e.pt_id === paymentTypeId);
        return (<p>{paymentTypeValue.pt_value}</p>);
    };

    return (
        <>
            <Toast ref={toast} />
            {clients === null ? <ProgressSpinner /> : <>
                <Card title="Selección de cliente" className="p-mt-2">
                    <p>Por favor, para continuar seleccione un cliente de la lista desplegable.</p>
                </Card>
                <Card className="p-mt-2">
                    <div className="p-grid p-d-flex p-ai-center">
                        <div className="p-col-6">
                            <Card title="Datos de la factura" subTitle={currentWritableBillCode}>
                                <div className="p-field">
                                    <label className="p-d-block">Nombre del cliente</label>
                                    <Dropdown filter showClear filterBy="cli_name" className="p-d-flex" value={selectedClient} options={clients} onChange={(e) => { setSelectedClient(e.value) }} optionLabel="cli_name" placeholder="Seleccione un cliente" />
                                </div>
                                <div className="p-field">
                                    <label className="p-d-block">Tipo de pago</label>
                                    {selectedClient === null || paymentTypes.length === 0 ? <p></p> : handlePaymentType()}
                                </div>
                                <div className="p-field">
                                    <label className="p-d-block">Fecha</label>
                                    <p>{new Date().toLocaleString()}</p>
                                </div>
                            </Card>
                            <Button className="p-mt-2" label="Continuar" icon="pi pi-forward" onClick={handleForward} />
                        </div>
                        <div className="p-col-6">
                            {selectedClient == null ? <p>Seleccione un cliente para continuar</p> : <Card title="Datos del cliente">
                                <div className="p-field">
                                    <label className="p-d-block">Cédula</label>
                                    <p>{selectedClient.cli_id_card}</p>
                                </div>
                                <div className="p-field">
                                    <label className="p-d-block">Dirección</label>
                                    <p>{selectedClient.cli_address}</p>
                                </div>
                                <div className="p-field">
                                    <label className="p-d-block">Email</label>
                                    <p>{selectedClient.cli_email}</p>
                                </div>
                                <div className="p-field">
                                    <label className="p-d-block">Teléfono</label>
                                    <p>{selectedClient.cli_phone}</p>
                                </div>
                                <div className="p-field">
                                    <label className="p-d-block">Tipo de pago</label>
                                    {hanldeClientPaymentType(selectedClient.cli_payment_type_id)}
                                </div>
                            </Card>}
                        </div>
                    </div>
                </Card>
            </>}
        </>);
};