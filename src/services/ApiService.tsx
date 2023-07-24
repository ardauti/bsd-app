import axios, {AxiosRequestConfig} from 'axios';

import config from "../config";
import {TRequest} from "../routes/routes.types";
import CookieService from "./CookieService";

//function which will add token to every request which need it
export const request: TRequest = async (method, url, params = {}) => {
    try {
        const options: AxiosRequestConfig = {
            method: method,
            url: config.api_url + url,
            data: params,
            headers: {
                "Accept": "application/json", "Content-Type": "application/json",
                Authorization: `Bearer ${CookieService.get('access_token') as string}`
            }
        }

        const response = await axios(options);

        if (response.hasOwnProperty('data') && response.data) {
            if (response.data.hasOwnProperty('data') && response.data.data) {
                return response.data.data;
            } else {
                return response.data;
            }
        } else {
            return response
        }
    } catch (error: any) {
        throw error;
    }
}

export const requestForList: TRequest = async (method, url, params = {}) => {
    try {
        const options: AxiosRequestConfig = {
            method: method,
            url: config.api_url + url,
            data: params,
            headers: {
                "Accept": "application/json", "Content-Type": "application/json",
                Authorization: `Bearer ${CookieService.get('access_token') as string}`
            }
        }

        const response = await axios(options);

        return response.data
    } catch (error: any) {
        throw error;
    }
}
export const requestWithoutToken: TRequest = async (method, url, params = {}) => {
    try {
        const options: AxiosRequestConfig = {
            method: method,
            url: config.api_url + url,
            data: params,
            headers: {"Accept": "application/json", "Content-Type": "application/json"}
        }
        const response = await axios(options);

        if (response.hasOwnProperty('data') && response.data) {
            if (response.data.hasOwnProperty('data') && response.data.data) {
                return response.data.data;
            } else {
                return response.data;
            }
        } else {
            return response
        }
    } catch (error: any) {
        throw error;
    }
}






