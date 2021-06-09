import axios from "axios";

export const inventoryAPI = axios.create({baseURL: "http://localhost:8010/proxy"});