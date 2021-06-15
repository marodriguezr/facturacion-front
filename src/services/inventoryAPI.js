import axios from "axios";

export const inventoryAPI = axios.create({baseURL: process.env.REACT_APP_INVENTORY_API_URL});