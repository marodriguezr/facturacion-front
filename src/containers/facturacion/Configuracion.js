import { useState, useRef, useEffect } from "react";
import { billingAPI } from "../../../src/services/billingAPI.js";
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
import "../../assets/css/main.css";

export const Configuracion = ({ setState }) => {
    let emptyClient = {
        cli_cli_id: null,
        cli_id_card: "",
        cli_name: "",
        cli_born_date: null,
        cli_address: "",
        cli_email: "",
        cli_phone: "",
        cli_status: "",
        cli_payment_id: ""
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

    useEffect(() => {
        getAllClients();
    }, []);

    const getAllClients = async () => {
        const data = await (billingAPI.get("clients/getAll"));
        setClients(data.data.clientsAll);
    };


    const createClient = async () => {
        const data = await (billingAPI.post(`clients/crearNuevoCliente/?cli_id_card=${client.cli_id_card}&cli_name=${client.cli_name}&cli_born_date=${client.cli_born_date}&cli_address=${client.cli_address}&cli_email=${client.cli_email}&cli_phone=${client.cli_phone}&cli_status=${client.cli_status}&cli_client_type_id=${client.cli_payment_id}`));
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    };

    const updateClient = async (client) => {
        const data = await (billingAPI.put(`clients/actualizarCliente/${client.cli_id}/?cli_id_card=${client.cli_id_card}&cli_name=${client.cli_name}&cli_born_date=${client.cli_born_date}&cli_address=${client.cli_address}&cli_email=${client.cli_email}&cli_phone=${client.cli_phone}&cli_status=${client.cli_status}&cli_client_type_id=${client.cli_payment_id}`));
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
            if (client.cli_id) {
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
        console.log(val)
        _product[`${name}`] = val;
        setClient(_product);
    }
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
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
                            dataKey="cli_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
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
                            <Column body={actionBodyTemplate}></Column>
                        </DataTable>
                    </div>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalles de clientes" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="p-field">
                            <label htmlFor="cli_id_card">Cédula</label>
                            <InputText id="cli_id_card" value={client.cli_id_card} onChange={(e) => onInputChange(e, 'cli_id_card')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.nombre_producto && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea id="descripcion" value={product.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required rows={3} cols={20} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="Genero">Genero</label>
                            <Dropdown id="id_genero" value={product.id_genero} options={data.generos} onChange={(e) => onInputChange(e, 'id_genero')} optionLabel="nombre_genero" className="p-invalid" />
                            {submitted && !product.id_genero.id_genero && <small className="p-invalid">Guenero es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="Tipo">Tipo</label>
                            <Dropdown id="id_tipo" value={product.id_tipo} options={data.tipo_productos} onChange={(e) => onInputChange(e, 'id_tipo')} optionLabel="nombre_tipo" className="p-invalid" />
                            {submitted && !product.id_tipo.id_tipo && <small className="p-invalid">Tipo es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="Talla">Talla</label>
                            <Dropdown id="id_talla" value={product.id_talla} options={data.tallas} onChange={(e) => onInputChange(e, 'id_talla')} optionLabel="nombre_talla" className="p-invalid" />
                            {submitted && !product.id_talla.id_talla && <small className="p-invalid">Talla es requerido.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="Imagen">Imagen</label>
                            <InputTextarea id="imagen" value={product.imagen} onChange={(e) => onInputChange(e, 'imagen')} required rows={3} cols={20} />
                        </div>
                        <div className="p-formgrid p-grid">
                            <div className="p-field p-col">
                                <label htmlFor="precio">Precio</label>
                                <InputNumber id="precio" value={product.precio} onValueChange={(e) => onInputNumberChange(e, 'precio')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="p-field p-col">
                                <label htmlFor="cantidad">Cantidad</label>
                                <InputNumber id="cantidad" value={product.cantidad} min={0} onValueChange={(e) => onInputNumberChange(e, 'cantidad')} integeronly />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Esta seguro de querer eliminar <b>{product.nombre_producto}</b>?</span>}
                        </div>
                    </Dialog>
                </div>}
        </>
    );
};