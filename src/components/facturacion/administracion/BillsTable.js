import { useEffect, useState } from "react";
import { billingAPI } from "../../../services/billingAPI.js";
import { inventoryAPI } from "../../../services/inventoryAPI.js";
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from 'primereact/inputswitch';
import { Card } from 'primereact/card';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const BillsTable = () => {
    const [billsHeaders, setBillsHeaders] = useState(null);
    const [bills, setBills] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    const [clients, setClients] = useState(null);
    const [paymentTypes, setPaymentTypes] = useState(null);
    const [isBillDetailsDialogVisible, setIsBillDetailsDialogVisible] = useState(false);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        getAllBillsHeaders();
        getAllClients();
        getAllPaymentTypes();
        getProducts();
        getAllBills();
    }, []);

    const getAllBillsHeaders = async () => {
        const response = await (billingAPI.get("billsHeaders"));
        setBillsHeaders(response.data.billheaderAll);
    };

    const getAllBills = async () => {
        const response = await (billingAPI.get("bills/all"))
        setBills(response.data.billPayments);
    };

    const getAllClients = async () => {
        const response = await (billingAPI.get("clients/getAll"));
        setClients(response.data.clientsAll);
    };

    const getAllPaymentTypes = async () => {
        const response = await billingAPI.get("paymentsTypes/");
        setPaymentTypes(response.data.paymentsTypesAll);
    };

    const getSelectedBill = async (bh_id) => {
        const response = await billingAPI.get(`bills/byId?bh_id=${bh_id}`);
        setSelectedBill(response.data.bill);
    };

    const getProducts = async () => {
        const response = await inventoryAPI.get("productos");
        setProducts(response.data);
    };

    const updateBill = async (bh_id, payment_type_id, client_id, bh_status, bh_total, bh_subtotal, bh_iva) => {
        const response = await billingAPI.put(`billsHeaders?bh_id=${bh_id}&payment_type_id=${payment_type_id}&client_id=${client_id}&bh_status=${bh_status}&bh_total=${bh_total}&bh_subtotal=${bh_subtotal}&bh_iva=${bh_iva}`);
    };

    const handleBillStatusChange = (rowData) => {
        let currentBillHeaders = billsHeaders.slice();
        let found = currentBillHeaders.find((element) =>
            element.bh_id === rowData.bh_id
        );
        found.bh_status = !found.bh_status;
        setBillsHeaders(currentBillHeaders);
        updateBill(rowData.bh_id, rowData.payment_type_id, rowData.client_id, rowData.bh_status, rowData.bh_total, rowData.bh_subtotal, rowData.bh_iva);
    };

    // const generateFacturasReport = (billHeader, selectedProducts, total, selectedClient) => {
    //     bills.forEach(element => {
    //         var doc = new jsPDF('p', 'pt');
    //         doc.setFontSize(20)
    //         doc.setFont('helvetica', 'bold');
    //         doc.text(200, 50, 'Factura')

    //         doc.setFontSize(10)
    //         doc.text(20, 80, 'Nro. Factura:')
    //         doc.text(90, 80, element.bh_bill_code)

    //         const tiempoTranscurrido = Date.now();
    //         const hoy = new Date(tiempoTranscurrido);
    //         doc.setFontSize(10)
    //         doc.text(20, 100, 'Fecha: ')
    //         doc.setFont('helvetica', 'normal')
    //         doc.text(70, 100, hoy.toLocaleDateString())

    //         doc.text(20, 120, 'Nombre del cliente:')
    //         doc.text(110, 120, selectedClient.cli_name + "")

    //         doc.text(20, 140, 'Cédula:')
    //         doc.text(70, 140, selectedClient.cli_id_card + "")

    //         doc.text(20, 160, 'Celular:')
    //         doc.text(70, 160, selectedClient.cli_phone + "")

    //         doc.text(20, 180, 'Correo electrónico:')
    //         doc.text(110, 180, selectedClient.cli_email + "")

    //         doc.text(20, 200, 'Dirección:')
    //         doc.text(70, 200, selectedClient.cli_address + "")

    //         doc.text(400, 660, 'Subtotal:')
    //         doc.text(455, 660, total - (total * 0.12) + "")
    //         doc.text(400, 670, 'IVA:')
    //         doc.text(455, 670, (total * 0.12) + "")
    //         doc.text(400, 680, 'Total:')
    //         doc.text(455, 680, total + "")


    //         var columns = ["Cantidad", "Descripción", "Valor Unitario", "Valor Total"];
    //         let data = []
    //         for (let i = 0; i < selectedProducts.length; i++) {
    //             data[i] = [selectedProducts[i].pro_stock, selectedProducts[i].pro_nombre, selectedProducts[i].pro_pvp, selectedProducts[i].pro_stock * selectedProducts[i].pro_pvp]
    //         }
    //         doc.autoTable(columns, data,
    //             {
    //                 margin: { top: 220 },
    //                 styles: { fontSize: 8 }
    //             }
    //         );
    //     });
    //     doc.save('Reporte_Clientes_' + hoy.toLocaleDateString() + '.pdf')
    // }

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

    const billOptionsBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-fw pi-plus" title="Revisar los detalles de la factura" onClick={() => { getSelectedBill(rowData.bh_id); setIsBillDetailsDialogVisible(true); }}></Button>
            </>
        );
    };

    const totalPriceBodyTemplate = (rowData) => {
        return (<>
            <p>{rowData.bd_amount * rowData.bd_price}</p>
        </>);
    };

    const billStatusBodyTemplate = (rowData) => {
        return (<>
            <InputSwitch checked={rowData.bh_status} onClick={() => { handleBillStatusChange(rowData) }}></InputSwitch>
        </>);
    };

    const productNameBodyTemplate = (rowData) => {
        const product = products.find((element) => element.pro_id === rowData.bd_product_id);
        return (<>
            <p>{product.pro_nombre}</p>
        </>);
    };

    return (
        <>
            {billsHeaders === null ? <ProgressSpinner></ProgressSpinner> :
                <>
                    <Card title="Revisión de facturas" >
                        <p>Bienvenido, en esta vista podra cambiar el estado de las facturas, revisarlas y extraer reportes de ellas.</p>
                        <Button icon="pi pi-fw pi-print" title="Obtener reporte de todas las facturas" label="Obtener reporte de todas las facturas"></Button>
                    </Card>
                    <DataTable className="p-mt-2" value={billsHeaders} paginator={true} rows={5}
                        dataKey="bh_id"
                    >
                        <Column field="bh_bill_code" header="Código" filter></Column>
                        <Column field="bh_date" header="Fecha"></Column>
                        <Column field="bh_total" header="Total"></Column>
                        <Column field="bh_subtotal" header="Subtotal"></Column>
                        <Column field="bh_iva" header="Iva"></Column>
                        {paymentTypes === null ? <></> : <Column body={paymentTypeBodyTemplate} header="Pago"></Column>}
                        {clients === null ? <></> : <Column body={clientBodyTemplate} header="Cliente"></Column>}
                        <Column header="Estado" body={billStatusBodyTemplate}></Column>
                        <Column body={billOptionsBodyTemplate}></Column>
                    </DataTable>
                </>
            }


            <Dialog visible={isBillDetailsDialogVisible} onHide={() => { setIsBillDetailsDialogVisible(false) }}>
                {selectedBill === null ? <ProgressSpinner></ProgressSpinner> : <DataTable className="p-mt-2" value={selectedBill.bills_details} paginator={true} rows={5}
                    dataKey="bh_id"
                >
                    <Column field="bd_id" header="Código"></Column>
                    <Column field="bd_amount" header="Cantidad"></Column>
                    {products === null ? <></> : <Column header="Nombre" body={productNameBodyTemplate}></Column>}
                    <Column field="bd_price" header="Precio unitario"></Column>
                    <Column header="Precio total" body={totalPriceBodyTemplate}></Column>
                </DataTable>}
            </Dialog>

        </>
    );
};