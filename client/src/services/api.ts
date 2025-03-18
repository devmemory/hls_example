import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export default class Api {
  private instance: AxiosInstance;

  constructor(
    baseURL = "/",
    timeout = 60000
  ) {
    this.instance = axios.create({
      baseURL,
      timeout,
    });

    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        return Promise.reject(error)
      }
    );
  }

  /** - params setting : get(url, {a:1,b:2}) => url?a=1&b=2 */
  protected async get<T>(url: string, params?: any) {
    const res = await this.instance.get<T>(url, { params });

    const rm = res.data;

    return rm;
  }

  protected async post<T>(url: string, data: any, config?: AxiosRequestConfig) {
    const res = await this.instance.post<T>(url, data, config);

    const rm = res.data;

    return rm;
  }
}