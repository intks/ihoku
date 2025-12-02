import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';

import { parseJWTToken } from '@sphere/web-ui';

import Configs from 'configs';

import { getToken } from 'contexts/auth';

import { refreshAccessToken } from 'utils/refreshAccessToken';

import wrapWithBasename from './wrapWithBasename';

const publicApiRoutes = ['/bv/account/v1/accounts/login'];
const thirdPartyApiRoutes = ['/bv/account/v1/oauth2/tokens'];

const TIME_OUT = 10 * 1000;
const ACCESS_TOKEN_EXPIRATION_TIME = 60 * 60;

let isRetry = false;

let previousRefreshTokenClientTime = 0;
let isRefreshingToken = false;

let queue: ((token: string) => void)[] = [];
const invokeQueue = (token: string) => {
  queue.forEach((callbackFn) => {
    callbackFn(token);
  });
};
const addRequestToQueue = (callbackFn: (token: string) => void) => {
  queue.push(callbackFn);
};

const AxiosInstance = axios.create({
  baseURL: Configs.API_URL,
  timeout: TIME_OUT,
});

AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    isRetry = false;
    return response.data;
  },
  async (error: any) => {
    const config = error?.config || null;
    const requestData = config?.data || null;
    const requestUrl = `${config?.baseURL}${config?.url}`;
    const requestMethod = config?.method;

    const response = error?.response;
    const responseData = response?.data || null;
    const responseStatus = response?.status || null;
    const responseHeaders = response?.headers || null;

    try {
      if (
        responseStatus === 401 &&
        ![...publicApiRoutes, ...thirdPartyApiRoutes].some((url) => config?.url?.includes(url))
      ) {
        const accessToken = await refreshAccessToken();

        if (accessToken) previousRefreshTokenClientTime = dayjs().unix();

        if (!isRetry) {
          isRetry = true;
          return AxiosInstance({
            ...error.config,
            headers: { ...error.config.headers, Authorization: `Bearer ${accessToken}` },
          });
        }
      }
    } catch (error) {}

    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        code: 'ECONNABORTED',
        reason: 'Something went wrong, please try again later.',
      });
    }

    console.log({
      severity: 'ERROR',
      requestUrl,
      requestMethod,
      requestData,
      responseData,
      responseStatus,
      responseHeaders,
    });

    if (responseData && Array.isArray(responseData.details)) {
      const length = responseData.details.length - 1;
      const detail = responseData.details[length];
      const reason = detail?.reason || '';
      const domain = detail?.domain || '';

      if (reason === 'ERROR_REASON_IP_BLOCK') {
        window.location.href = wrapWithBasename('ip-restriction');
        return;
      }

      return Promise.reject({ code: responseStatus, reason, domain });
    }

    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isRefreshingToken) {
      await new Promise<void>((resolve) => {
        addRequestToQueue((token: string) => {
          if (config && config.headers) {
            config.headers.Authorization = token ? `Bearer ${token}` : '';
          }
          resolve();
        });
      });
    }

    const token = getToken();
    const clientTime = dayjs().unix();
    const { exp: expirationTime } = parseJWTToken(token || '');
    const isOverExpirationTime = clientTime >= expirationTime;
    const canRefreshToken =
      // Calculate last time refresh if it is over access token expiration time, and current client time is over expiration time
      clientTime - previousRefreshTokenClientTime >= ACCESS_TOKEN_EXPIRATION_TIME && isOverExpirationTime;

    if (canRefreshToken) {
      if (!isRefreshingToken) {
        isRefreshingToken = true;

        const accessToken = await refreshAccessToken();

        if (accessToken) previousRefreshTokenClientTime = dayjs().unix();

        invokeQueue(accessToken ?? '');

        isRefreshingToken = false;
        queue = [];
      }
    }

    if (config && config.headers) {
      if (!config.headers.Authorization) {
        const token = getToken();
        config.headers.Authorization = token ? `Bearer ${token}` : '';
      }
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

export { AxiosInstance };
