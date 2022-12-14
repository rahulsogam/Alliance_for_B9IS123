import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Axios } from '../AxiosConfig';

const Employee = () => {
    let emptyProduct = {
        category: null,
        description: '',
        dealer: null,
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [dropdownValues, setDropdownValues] = useState([]);

    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        Axios.get("/EMP/Designation").then((res) => {
            setDropdownValues(res.data.data.Designation)
        })
        Axios.get("/EMP/All").then((res) => {
            console.log(res)
            setProducts(res.data.data.Employees)
        }).catch((err) => {
            console.log(err)
        })
        // eslint-disable-next-line
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setEditDialog(false)
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);
        let _products = [...products];
        let _product = { ...product,Salary:"20000",Designation:dropdownValue.name};
        _products = [..._products, _product]
        setProducts(_products);
        setProduct(emptyProduct);
        setProductDialog(false);
        await Axios.post("/EMP/create", { name: product.Name, address: product.Address,email:product.Email,designation:dropdownValue.name,password:product.pwd }).then((res) => {
            console.log(res);
            setProductDialog(false);
        })
    };

    const saveEdit = async() => {
        setSubmitted(true);

        let _products = [...products];
        let _product = { ...product};
        const index = findIndexById(product.ID);
        console.log(index)
        _products[index] = _product;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Updated', life: 3000 });
        setProducts(_products);
        setProduct(emptyProduct);
        setEditDialog(false);
        await Axios.patch("/EMP/update", { id: product.ID, name:product.Name, address:product.Address, email:product.Email, password:product.pwd}).then((res) => {
             console.log(res);
        })
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setEditDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        let _products = products.filter((val) => val.ID !== product.ID);
        setProducts(_products);
        setDeleteProductDialog(false);
        await Axios.delete("/EMP/delete", {
            headers: {
            },
            data: {
                id: parseInt(product.ID)
            }
        }).then((res) => {
            console.log(res)
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].ID === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {

        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.Name}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Salary</span>
                {rowData.Salary}
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.Email}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Designation</span>
                {rowData.Designation}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Address</span>
                {rowData.Address}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Employees</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const eitDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEdit} />
        </>
    )
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="Name" header="Name" sortable body={codeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="Salary" header="Salary" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="Email" header="Email" body={priceBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="Designation" header="Designation" body={categoryBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="Address" header="Address" body={ratingBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Employee Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.image && <img src={`assets/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Employee name</label>
                            <InputText id="Name" value={product.Name} onChange={(e) => onInputChange(e, 'Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Name })} />
                            {submitted && !product.Name && <small className="p-invalid">Employee is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Email">Employee email</label>
                            <InputText id="Email" value={product.Email} onChange={(e) => onInputChange(e, 'Email')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Email })} />
                            {submitted && !product.Email && <small className="p-invalid">Employee is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Password">Employee password</label>
                            <InputText id="pwd" value={product.pwd} onChange={(e) => onInputChange(e, 'pwd')} required autoFocus  className={classNames({ 'p-invalid': submitted && !product.pwd })} />
                            {submitted && !product.pwd && <small className="p-invalid">Employee is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Employee Address</label>
                            <InputTextarea id="Address" value={product.Address} onChange={(e) => onInputChange(e, 'Address')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Address })} rows={3} cols={20} />
                            {submitted && !product.Address && <small className="p-invalid">Enter Description.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="quantity">Select Designation</label>
                                <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                    </Dialog>
                    <Dialog visible={editDialog} style={{ width: '450px' }} header="Employee Details" modal className="p-fluid" footer={eitDialogFooter} onHide={hideDialog}>
                        {product.image && <img src={`assets/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Employee name</label>
                            <InputText id="Name" value={product.Name} onChange={(e) => onInputChange(e, 'Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Name })} />
                            {submitted && !product.Name && <small className="p-invalid">Employee is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Email">Employee email</label>
                            <InputText id="Email" value={product.Email} onChange={(e) => onInputChange(e, 'Email')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Email })} />
                            {submitted && !product.Email && <small className="p-invalid">Employee is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Password">Employee password</label>
                            <InputText id="pwd" value={product.pwd} onChange={(e) => onInputChange(e, 'pwd')} required autoFocus  className={classNames({ 'p-invalid': submitted && !product.pwd })} />
                            {submitted && !product.pwd && <small className="p-invalid">Employee is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Employee Address</label>
                            <InputTextarea id="Address" value={product.Address} onChange={(e) => onInputChange(e, 'Address')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Address })} rows={3} cols={20} />
                            {submitted && !product.Address && <small className="p-invalid">Enter Description.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="quantity">Select Designation</label>
                                <InputTextarea id="/." value={product.Designation} disabled required autoFocus className={classNames({ 'p-invalid': submitted && !product.Address })} rows={3} cols={20} />
                                 {submitted && !product.Address && <small className="p-invalid">Enter Description.</small>}
                            </div>
                        </div>
                    </Dialog>


                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Employee;
