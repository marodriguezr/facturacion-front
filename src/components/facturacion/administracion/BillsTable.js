import { useEffect, useState } from "react";
import { billingAPI } from "../../../services/billingAPI.js";
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const BillsTable = () => {
    const [billsHeaders, setBillsHeaders] = useState(null);
    const [clients, setClients] = useState(null);
    const [paymentTypes, setPaymentTypes] = useState(null);

    useEffect(() => {
        getAllBillsHeaders();
        getAllClients();
        getAllPaymentTypes();
    }, []);

    const getAllBillsHeaders = async () => {
        const response = await (billingAPI.get("billsHeaders"));
        setBillsHeaders(response.data.billheaderAll);
    };

    const getAllClients = async () => {
        const response = await (billingAPI.get("clients/getAll"));
        setClients(response.data.clientsAll)
    };

    const getAllPaymentTypes = async () => {
        const response = await billingAPI.get("paymentsTypes/");
        setPaymentTypes(response.data.paymentsTypesAll);
    };

    const paymentTypeBodyTemplate = (rowData) => {
        return (<>
            <p>
                {paymentTypes.find((e) => e.pt_id === rowData.payment_type_id).pt_value}
            </p>
        </>)
    };
    
    const clientBodyTemplate = (rowData) => {
        return (<>
            <p>
                {clients.find((e) => e.cli_id === rowData.client_id).cli_name}
            </p>
        </>)
    };

    return (
        <>
            {billsHeaders === null ? <ProgressSpinner></ProgressSpinner> :
                <DataTable className="p-mt-2" value={billsHeaders} paginator={true} rows={5}
                    dataKey="bh_id"
                >
                    <Column field="bh_bill_code" header="Código"></Column>
                    <Column field="bh_date" header="Fecha"></Column>
                    <Column field="bh_total" header="Total"></Column>
                    <Column field="bh_subtotal" header="Subtotal"></Column>
                    <Column field="bh_iva" header="Iva"></Column>
                    {paymentTypes === null ? <></> : <Column body={paymentTypeBodyTemplate} header="Pago"></Column>}
                    {clients === null ? <></> : <Column body={clientBodyTemplate} header="Cliente"></Column>}
                </DataTable>
            }
        </>
    );
};