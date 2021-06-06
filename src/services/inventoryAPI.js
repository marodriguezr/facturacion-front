import axios from "axios";

export const inventoryAPI = axios.create({baseURL: "https://modulo-inventario-app.herokuapp.com/"});