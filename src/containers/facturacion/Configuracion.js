

import { useState, useRef, useEffect } from "react";
import { billingAPI } from "../../../src/services/billingAPI.js";
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import {Checkbox} from 'primereact/checkbox';
import "../../assets/css/main.css";


export const Configuracion = ({ setState }) => {
    let emptyClient = {
        cli_cli_id: null,
        cli_id_card: "",
        cli_name: "",
        cli_born_date: new Date(),
        cli_address: "",
        cli_email: "",
        cli_phone: "",
        cli_status: false,
        cli_payment_type_id: 0,
        payments_type: {
            pt_id: 0,
            pt_value: ""
        }
    };

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [client, setClient] = useState(emptyClient);
    const [clients, setClients] = useState(null);
    const [payment_types, setPayment_types] = useState(null);

    useEffect(() => {
        getAllClients();
        getAllPaymentsTypes();
    }, []);

    const getAllClients = async () => {
        const data = await (billingAPI.get("clients/getAll"));
        setClients(data.data.clientsAll);
        console.log(data.data.clientsAll)
    };
    const getAllPaymentsTypes = async () => {
        const data = await (billingAPI.get("paymentsTypes"));
        setPayment_types(data.data.paymentsTypesAll);
    };


    const createClient = async () => {
        const data = await (billingAPI.post(`clients/crearNuevoCliente/?cli_id_card=${client.cli_id_card}&cli_name=${client.cli_name}&cli_born_date=${client.cli_born_date}&cli_address=${client.cli_address}&cli_email=${client.cli_email}&cli_phone=${client.cli_phone}&cli_status=${client.cli_status}&cli_payment_type_id=${client.cli_payment_type_id}`));
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    };

    const updateClient = async (client) => {
        const data = await (billingAPI.put(`clients/actualizarCliente/${client.cli_id}/?cli_id_card=${client.cli_id_card}&cli_name=${client.cli_name}&cli_born_date=${client.cli_born_date}&cli_address=${client.cli_address}&cli_email=${client.cli_email}&cli_phone=${client.cli_phone}&cli_status=${client.cli_status}&cli_payment_type_id=${client.cli_payment_type_id}`));
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    };

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Administrar Clientes</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const saveClient = () => {
        setSubmitted(true);
        if (true) {
            client.cli_payment_type_id=client.payments_type.pt_id
            console.log(client)
            if (client.cli_id!=null) {
                console.log("actualizando")
                updateClient(client)
            }
            else {
                createClient();
            }
            setProductDialog(false);
            getAllClients();
        }
    }

    const editClient = (client) => {
        setClient({ ...client });
        setProductDialog(true);
    }
    const confirmDeleteClient = (client) => {
        setClient({ ...client });
        setDeleteProductDialog(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editClient(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteClient(rowData)} />
            </>
        );
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const openNew = () => {
        setClient(emptyClient);
        setSubmitted(false);
        setProductDialog(true);
    }
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }
    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Crear" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            </>
        )
    }
    const rightToolbarTemplate = () => {
        return (
            <>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </>
        )
    }
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }
    const deleteProduct = async () => {
        const response = await billingAPI.delete(`clients/EliminarCliente/${client.cli_id}`);
        setDeleteProductDialog(false);
        setClient(emptyClient);
        toast.current.show({ severity: 'success', summary: 'Suc cessful', detail: 'Product Deleted', life: 3000 });
    }
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }
    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveClient} />
        </>
    );

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }
    const deleteSelectedProducts = () => {
        // let _products = products.filter(val => !selectedProducts.includes(val));
        //setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...client };      
        _product[`${name}`] = val;
        setClient(_product);        
    }
    const onInputChangeDate = (e, name) => {
        const val = e.value        
        let _product = { ...client };  
        let fecha=val.getFullYear()+"-"+(val.getMonth()+1)+"-"+val.getDate()      
        _product[`${name}`] ="2021-06-28"
        setClient(_product);        
    }
    const onInputChangeBool = (e, name) => {
        const val = e.checked 
        let _product = { ...client };        
        _product[`${name}`] = val;
        setClient(_product);        
    } 


    return (
        <>
            {clients === null ? <ProgressSpinner /> :
                <div className="datatable-crud-demo">
                    <Toast ref={toast} />
                    <div className="card">
                        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable ref={dt} value={clients} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                            dataKey="cli_id" paginator rows={2} 
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
                            globalFilter={globalFilter}
                            header={header}>
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="cli_id" header="Código" sortable></Column>
                            <Column field="cli_id_card" header="Cédula" sortable></Column>
                            <Column field="cli_name" header="Nombre" sortable></Column>
                            <Column field="cli_born_date" header="Fecha de nacimiento" sortable></Column>
                            <Column field="cli_address" header="Dirección" sortable></Column>
                            <Column field="cli_email" header="E-mail" sortable></Column>
                            <Column field="cli_phone" header="Teléfono" sortable></Column>
                            <Column field="cli_status" header="Estado" sortable></Column>
                            <Column field="cli_payment_type_id" header="Tipo de pago" sortable></Column>
                            <Column body={actionBodyTemplate}></Column>
                        </DataTable>
                    </div>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalles de clientes" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="p-field">
                            <label htmlFor="cli_id_card">Cédula</label>
                            <InputText id="cli_id_card" value={client.cli_id_card} onChange={(e) => onInputChange(e, 'cli_id_card')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.cli_id_card })} />
                            {submitted && !client.cli_id_card && <small className="p-invalid">Cedula es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="cli_name">Nombre</label>
                            <InputText id="cli_name" value={client.cli_name} onChange={(e) => onInputChange(e, 'cli_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.cli_name })} />
                            {submitted && !client.cli_name && <small className="p-invalid">Cedula es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="cli_born_date">Fecha nacimiento</label>
                            <Calendar id="cli_born_date" dateFormat="yy-mm-dd"  value={new Date(client.cli_born_date)} onChange={(e) => onInputChangeDate(e,'cli_born_date')} showIcon />
                            {submitted && !client.cli_born_date && <small className="p-invalid">Fecha de Nacimiento es requerida es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="cli_address">Dirección</label>
                            <InputText id="cli_address" value={client.cli_address} onChange={(e) => onInputChange(e, 'cli_address')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.cli_address })} />
                            {submitted && !client.cli_address && <small className="p-invalid">Dirección es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="cli_email">E-mail</label>
                            <InputText id="cli_email" value={client.cli_email} onChange={(e) => onInputChange(e, 'cli_email')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.cli_email })} />
                            {submitted && !client.cli_email && <small className="p-invalid">E-mail es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="cli_phone">Teléfono</label>
                            <InputText id="cli_phone" value={client.cli_phone} onChange={(e) => onInputChange(e, 'cli_phone')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.cli_phone })} />
                            {submitted && !client.cli_phone && <small className="p-invalid">Teléfono es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="payments_type">Tipo de  Pago</label>
                            <Dropdown id="payments_type" value={client.payments_type} options={payment_types} onChange={(e) => onInputChange(e, 'payments_type')} optionLabel="pt_value" className="p-invalid" />
                            {submitted && !client.payments_type && <small className="p-invalid">Tipo de pago es requerido.</small>}
                        </div>
                        <div className="p-field-checkbox">
                            <Checkbox id="cli_status" checked={client.cli_status} onChange={e => onInputChangeBool(e,'cli_status')} />
                            <label htmlFor="cli_status">Estado</label>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {client && <span>Esta seguro de querer eliminar <b>{client.cli_id_card}</b>?</span>}
                        </div>
                    </Dialog>
                </div>}
        </>
    );
};