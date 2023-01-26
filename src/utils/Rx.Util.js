import { Rx, Theme } from '@constants/index';
import { getConfigByEnv } from '@helpers/CommonHelpers';
import ToastHelpers from '@helpers/ToastHelpers';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import slackUtil from './slackUtil';

const { API_URL } = getConfigByEnv();

const { COLORS } = Theme;

const generateLogData = (endpoint, body, headers, res) => {
    const objectStr = JSON.stringify({
        endpoint,
        body,
        res: res.data,
    });

    return `${objectStr}`;
};

const logMessage = (res, endpoint, headers, body, method, apiTokenLocal) => {
    const textColor = res.status === 200 || res.status === 201 ? `color: ${COLORS.SUCCESS}` : `color: ${COLORS.ERROR}`;
    console.log(`%c${method.toUpperCase()} ${res.status} ${endpoint}`, textColor, {
        headers,
        body,
        response: res
    });
    console.log(`%c${apiTokenLocal}`, textColor);
};

export default async (
    endpoint,
    method,
    body = null,
    domain,
    headers = {}
) => {
    const apiTokenLocal = await SecureStore.getItemAsync('api_token');

    const url = `${domain || API_URL}${endpoint}`;

    if (endpoint !== Rx.AUTHENTICATION.LOGIN
        && endpoint !== Rx.USER.GET_OTP_REGISTER
        && endpoint !== Rx.USER.GET_OTP_FORGOT_PASSWORD) {
        // eslint-disable-next-line no-param-reassign
        headers = {
            Authorization: `Bearer ${apiTokenLocal}`
        };
    }

    if (!apiTokenLocal
        && endpoint !== Rx.AUTHENTICATION.LOGIN
        && endpoint !== Rx.USER.GET_OTP_REGISTER
        && endpoint !== Rx.USER.GET_OTP_FORGOT_PASSWORD
        && endpoint !== Rx.AUTHENTICATION.SIGN_UP_V2
        && endpoint !== Rx.USER.SUBMIT_FORGOT_PASSWORD_CONFIRM
        && endpoint !== `${Rx.PARTNER.GET_LIST_PARTNER}?pageIndex=1&pageSize=50`
    ) {
        console.log("%cEndpoint doesn't have permission :>> ", `color: ${COLORS.ERROR}`, endpoint);
        return {
            data: {
                data: null
            }
        };
    }

    try {
        const res = await axios({
            url,
            data: body,
            method,
            headers
        });

        const response = {
            config: res.config,
            data: res.data,
            headers: res.headers,
            request: res.request,
            status: res.data.status
        };

        // check domain
        // if (domain === PICKME_INFO_URL) {
        //     response.status = res.status;
        // }

        // logMessage(response, url, headers, body, method, apiTokenLocal);

        if (response.status !== 200 && response.status !== 201) {
            // check token expired
            if (!response.headers?.tokenexpired) {
            // if does not have tokenexpired => do not toast
                ToastHelpers.renderToast(response.data.message || null);
            }
        } else if (response.status === 503) {
            return response;
        }
        const logInfo = generateLogData(endpoint, body, headers, response);
        console.log(logInfo);
        return response;
    } catch (err) {
        const {
            response, response: { data }
        } = err;

        logMessage(response, url, headers, body, method, apiTokenLocal);
        const logInfo = generateLogData(endpoint, data, headers, response);
        slackUtil('catch', logInfo);

        // check token expired
        if (!response.headers?.tokenexpired) {
            if (response.status !== 503) {
                ToastHelpers.renderToast(data.message || null);
            }
        }

        return response;
    }
};
