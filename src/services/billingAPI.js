import axios from "axios";

export const billingAPI = axios.create({
    baseURL: process.env.REACT_APP_BILLING_API_URL
});

