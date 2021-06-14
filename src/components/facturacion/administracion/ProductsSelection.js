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
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card } from 'primereact/card';

export const ProductSelection = ({ productsState, selectedProductsState, selectedClientState }) => {
    const history = useHistory();
    const match = useRouteMatch();
    const toast = useRef(null);
    const [products, setProducts] = productsState;
    const [selectedProducts, setSelectedProducts] = selectedProductsState;
    const [selectedClient, setSelectedClient] = selectedClientState;
    const [confirmBill, setconfirmBill] = useState(false);
    const [selectedInternalProducts, setSelectedInternalProducts] = useState(null);
    const [selectedStock, setSelectedStock] = useState(1);

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
        if (selectedInternalProducts === null) {
            showWarn("Por favor, seleccione uno o varios productos antes de continuar.");
            return;
        }
        if (selectedInternalProducts.length === 0) {
            showWarn("Por favor, seleccione uno o varios productos antes de continuar.");
            return;
        }
        let currentProducts = products.slice();
        let currentSelectedProducts = selectedProducts.slice();
        selectedInternalProducts.forEach(element => {
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
        setSelectedInternalProducts([]);
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
        history.push(`/facturacion/viewBills`)
        setconfirmBill(false)
    };

    useEffect(() => {
        getAllProducts();
        setSelectedProducts([]);
        selectedClient === null && history.push("/facturacion/createBill");
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
                    {/* Totales, subtotal e iva de la factura. */}
                </Card>
            </div>
            <div className="p-col-5">
                {products === null ? <ProgressSpinner /> : <DataTable value={products} paginator={true} rows={5} selection={selectedInternalProducts} onSelectionChange={(e) => setSelectedInternalProducts(e.value)}
                    dataKey="pro_id"
                >
                    <Column sortable={true} filter field="pro_nombre" header="Nombre"></Column>
                    <Column sortable={true} header="IVA" body={ivaBodyTemplate}></Column>
                    <Column sortable={true} header="Precio" field="pro_pvp"></Column>
                    <Column sortable={true} header="Stock" field="pro_stock"></Column>
                    <Column sortable={true} selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                </DataTable>}
            </div>
            <div className="p-col-2">
                <InputNumber min={1} id="horizontal" value={selectedStock} onValueChange={(e) => setSelectedStock(e.value)} showButtons buttonLayout="horizontal" step={1}
                    decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                <Button className="p-mt-2" label="Agregar" icon="pi pi-plus" onClick={handleAddProducts} />
                <Button className="p-mt-2" label="Facturar" icon="pi pi-plus" onClick={upConfirmDialog} />
            </div>
            <div className="p-col-5">
                {selectedProducts.length === 0 ? <h1>Agregue algunos productos para continuar</h1> : <DataTable value={selectedProducts} paginator={true} rows={5}
                    dataKey="pro_id">
                    <Column field="pro_nombre" header="Nombre"></Column>
                    <Column header="IVA" body={ivaBodyTemplate}></Column>
                    <Column header="Precio" field="pro_pvp"></Column>
                    <Column header="Stock" field="pro_stock"></Column>
                    <Dialog visible={confirmBill} style={{ width: '450px' }} header="Confirm" modal footer={confirmBillDialogFooter} onHide={hideConfirmBilDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {<span>¿Esta seguro de realizar la compra?</span>}
                        </div>
                    </Dialog>
                </DataTable>}
            </div>
        </div>
    </>);
};