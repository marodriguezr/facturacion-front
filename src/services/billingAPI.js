import axios from "axios";

export const billingAPI = axios.create({
    baseURL: "http://localhost:4000/facturacion", 
});

