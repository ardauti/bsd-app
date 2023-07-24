import axios from "axios";

// @ts-ignore
const baseUrl = import.meta.env.VITE_BASE_URL

export default axios.create({
    baseURL: `${baseUrl}`,
})


