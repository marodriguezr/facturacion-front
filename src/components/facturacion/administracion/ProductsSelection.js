import { useEffect, useRef, useState } from "react";
import { inventoryAPI } from "../../../services/inventoryAPI.js";
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { billingAPI } from "../../../services/billingAPI.js";
import { useHistory } from "react-router-dom";
import { Card } from 'primereact/card';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const ProductSelection = ({ productsState, selectedProductsState, selectedClientState }) => {
    const history = useHistory();
    const toast = useRef(null);
    const [products, setProducts] = productsState;
    const [selectedProducts, setSelectedProducts] = selectedProductsState;
    const [selectedClient, setSelectedClient] = selectedClientState;
    const [confirmBill, setconfirmBill] = useState(false);
    const [toAddProducts, setToAddProducts] = useState(null);
    const [toRemoveProducts, setToRemoveProducts] = useState(null);
    const [selectedStock, setSelectedStock] = useState(1);
    const [total, setTotal] = useState(0.0);

    const getAllProducts = async () => {
        const response = await inventoryAPI.get("productos");
        setProducts(response.data);
    };

    const showWarn = (message = "") => {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
    }

    const showSuccess = (message = "") => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: message, life: 3000 });
    }

    const handleAddProducts = () => {
        if (toAddProducts === null) {
            showWarn("Por favor, seleccione uno o varios productos antes de continuar.");
            return;
        }
        if (toAddProducts.length === 0) {
            showWarn("Por favor, seleccione uno o varios productos antes de continuar.");
            return;
        }
        let currentProducts = products.slice();
        let currentSelectedProducts = selectedProducts.slice();
        toAddProducts.forEach(element => {
            if (!(selectedStock <= element.pro_stock)) {
                showWarn(`Por favor seleccione una cantidad adecuada para el producto: ${element.pro_nombre}, máximo ${element.pro_stock}.`);
                return;
            }
            let currentProduct = currentProducts.find((e) => e.pro_id === element.pro_id);
            currentProduct.pro_stock -= selectedStock;
            if (currentProduct.pro_stock === 0) {
                currentProducts = currentProducts.filter((e) => e.pro_id !== element.pro_id);
            }

            let currentSelectedProduct = currentSelectedProducts.find((e) => e.pro_id === element.pro_id);

            if (!(currentSelectedProduct === undefined)) {
                currentSelectedProduct.pro_stock += selectedStock;

            } else {
                let toAddProduct = { ...element };
                toAddProduct.pro_stock = selectedStock;
                currentSelectedProducts.push(toAddProduct);

            }
        });
        setProducts(currentProducts);
        setSelectedProducts(currentSelectedProducts);
        setToAddProducts([]);
        let total = 0.0;
        currentSelectedProducts.forEach(element => {
           total += element.pro_stock * element.pro_pvp;
        });
        setTotal(total);
    };

    const handleRemoveProducts = () => {
        if (toRemoveProducts === null) {
            showWarn("Por favor, seleccione uno o varios productos antes de continuar.");
            return;
        }
        if (toRemoveProducts.length === 0) {
            showWarn("Por favor, seleccione uno o varios productos antes de continuar.");
            return;
        }
        let currentProducts = products.slice();
        let currentSelectedProducts = selectedProducts.slice();
        toRemoveProducts.forEach(element => {
            if (!(selectedStock <= element.pro_stock)) {
                showWarn(`Por favor seleccione una cantidad adecuada para el producto: ${element.pro_nombre}, máximo ${element.pro_stock}.`);
                return;
            }
            let currentSelectedProduct = currentSelectedProducts.find((e) => e.pro_id === element.pro_id);
            currentSelectedProduct.pro_stock -= selectedStock;
            if (currentSelectedProduct.pro_stock === 0) {
                currentSelectedProducts = currentSelectedProducts.filter((e) => e.pro_id !== element.pro_id);
            }

            let currentProduct = currentProducts.find((e) => e.pro_id === element.pro_id);
            if (!(currentProduct === undefined)) {
                currentProduct.pro_stock += selectedStock;
            } else {
                let toAddProduct = { ...element };
                toAddProduct.pro_stock = selectedStock;
                currentProducts.push(toAddProduct);
            }
        });
        setProducts(currentProducts);
        setSelectedProducts(currentSelectedProducts);
        setToRemoveProducts([]);
        let total = 0.0;
        currentSelectedProducts.forEach(element => {
           total += element.pro_stock * element.pro_pvp;
        });
        setTotal(total);
    };

    const submitBillHeader = async (total, clientId, paymentTypeId) => {
        console.log("bill header reached");
        console.log(paymentTypeId);
        const response = await (billingAPI.post(`billsHeaders/?payment_type_id=${paymentTypeId}&client_id=${clientId}&bh_total=${total}&bh_subtotal=${total - (total * 0.12)}&bh_iva=${total * 0.12}`));
        return response.data.data;
    };

    const submitBillDetail = async (amount, price, has_iva, bill_header_id, product_id) => {
        const response = await (billingAPI.post(`billsDetails/?amount=${amount}&price=${price}&has_iva=${has_iva}&bill_header_id=${bill_header_id}&product_id=${product_id}`));
        return response.data.data;
    };

    const handleBilling = async () => {
        if (selectedProducts.length === 0) {
            showWarn("Por favor, seleccione uno o varios productos antes de continuar.");
            return;
        }
        let total = 0.0;
        for (let index = 0; index < selectedProducts.length; index++) {
            total += selectedProducts[index].pro_stock * selectedProducts[index].pro_pvp;
        }
        const billHeader = await submitBillHeader(
            total, selectedClient.cli_id, selectedClient.payments_type.pt_id
        );
        selectedProducts.forEach(async (element) => {
            await submitBillDetail(element.pro_stock, element.pro_pvp, element.pro_iva, billHeader.bh_id, element.pro_id);
        });
        showSuccess("Factura registrada con éxito.");
        generateFacturasReport(billHeader, selectedProducts, total)
        history.push(`/facturacion/viewBills`)
        setconfirmBill(false)
    };

    const total_pvpBodyTemplate = (rowData) => {
        return (<p>{rowData.pro_stock * rowData.pro_pvp}</p>)
    };

    const generateFacturasReport = (billHeader, selectedProducts, total) => {


        var doc = new jsPDF('p', 'pt');
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold');
        doc.text(200, 50, 'Factura')

        doc.setFontSize(10)
        doc.text(20, 80, 'Nro. Factura:')
        doc.text(90, 80, billHeader.bh_bill_code)

        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        doc.setFontSize(10)
        doc.text(20, 100, 'Fecha: ')
        doc.setFont('helvetica', 'normal')
        doc.text(70, 100, hoy.toLocaleDateString())

        doc.text(20, 120, 'Nombre del cliente:')
        doc.text(110, 120, selectedClient.cli_name + "")

        doc.text(20, 140, 'Cédula:')
        doc.text(70, 140, selectedClient.cli_id_card + "")

        doc.text(20, 160, 'Celular:')
        doc.text(70, 160, selectedClient.cli_phone + "")

        doc.text(20, 180, 'Correo electrónico:')
        doc.text(110, 180, selectedClient.cli_email + "")

        doc.text(20, 200, 'Dirección:')
        doc.text(70, 200, selectedClient.cli_address + "")

        doc.text(400, 660, 'Subtotal:')
        doc.text(455, 660, total - (total * 0.12) + "")
        doc.text(400, 670, 'IVA:')
        doc.text(455, 670, (total * 0.12) + "")
        doc.text(400, 680, 'Total:')
        doc.text(455, 680, total + "")


        var columns = ["Cantidad", "Descripción", "Valor Unitario", "Valor Total"];
        let data = []
        for (let i = 0; i < selectedProducts.length; i++) {
            data[i] = [selectedProducts[i].pro_stock, selectedProducts[i].pro_nombre, selectedProducts[i].pro_pvp, selectedProducts[i].pro_stock * selectedProducts[i].pro_pvp]
        }
        doc.autoTable(columns, data,
            {
                margin: { top: 220 },
                styles: { fontSize: 8 }
            }
        );

        doc.save('Reporte_Clientes_' + hoy.toLocaleDateString() + '.pdf')
    }

    useEffect(() => {
        getAllProducts();
        setSelectedProducts([]);
        // selectedClient === null && history.push("/facturacion/createBill");
    }, []);

    const ivaBodyTemplate = (rowData) => {
        return (
            <p>{rowData.pro_iva ? "Si" : "No"}</p>
        )
    };
    const hideConfirmBilDialog = () => {
        setconfirmBill(false);
    }

    const confirmBillDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideConfirmBilDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={handleBilling} />
        </>
    );



    const upConfirmDialog = () => {
        setconfirmBill(true);
    }

    return (<>
        <Toast ref={toast} />
        <div className="p-grid p-mt-2">
            <div className="p-col-12">
                <Card>
                    <div className="p-grid">
                        <div className="p-col">
                            <strong>Total:</strong>
                            <p>{total}</p>
                        </div>
                        <div className="p-col">
                            <strong>Subtotal:</strong>
                            <p>{total - (total * 0.12)}</p>
                        </div>
                        <div className="p-col">
                            <strong>IVA:</strong>
                            <p>{total * 0.12}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="p-col-5">
                {products === null ? <ProgressSpinner /> : <DataTable value={products} paginator={true} rows={5} selection={toAddProducts} onSelectionChange={(e) => setToAddProducts(e.value)}
                    dataKey="pro_id"
                >
                    <Column sortable={true} filter field="pro_nombre" header="Nombre"></Column>
                    <Column sortable={true} header="IVA" body={ivaBodyTemplate}></Column>
                    <Column sortable={true} header="Precio" field="pro_pvp"></Column>
                    <Column sortable={true} header="Stock" field="pro_stock"></Column>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                </DataTable>}
            </div>
            <div className="p-col-2">
                <InputNumber min={1} id="horizontal" value={selectedStock} onValueChange={(e) => setSelectedStock(e.value)} step={1}/>
                <Button className="p-mt-2" label="Agregar" icon="pi pi-plus" onClick={handleAddProducts} />
                <Button className="p-mt-2" label="Facturar" icon="pi pi-shopping-cart" onClick={upConfirmDialog} />
                <Button className="p-mt-2" label="Restar" icon="pi pi-minus" onClick={handleRemoveProducts} />
                <Dialog visible={confirmBill} style={{ width: '450px' }} header="Confirm" modal footer={confirmBillDialogFooter} onHide={hideConfirmBilDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {<span>¿Esta seguro de realizar la compra e imprimir la factura?</span>}
                    </div>
                </Dialog>
            </div>
            <div className="p-col-5">
                {selectedProducts.length === 0 ? <h1>Agregue algunos productos para continuar</h1> : <DataTable value={selectedProducts} paginator={true} rows={5}
                    dataKey="pro_id" selection={toRemoveProducts} onSelectionChange={(e) => setToRemoveProducts(e.value)}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="pro_nombre" sortable={true} filter header="Nombre"></Column>
                    <Column header="IVA" sortable={true} body={ivaBodyTemplate}></Column>
                    <Column header="Precio" field="pro_pvp"></Column>
                    <Column header="Stock" field="pro_stock"></Column>
                    <Column header="Total_PVP" body={total_pvpBodyTemplate}></Column>
                </DataTable>}
            </div>
        </div>
    </>);
};