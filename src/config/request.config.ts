import * as https from 'https';
import type { AxiosRequestConfig, ResponseType } from 'axios';

export default function configAxios(responseType: ResponseType, url: string): AxiosRequestConfig {
    return {
        method: 'GET',
        url,
        responseType,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
    };
};