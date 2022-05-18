/* eslint-disable import/no-unresolved */
/* eslint-disable no-plusplus */
import App from '@constants/App';
import BookingStatus from '@constants/BookingStatus';
import { LOCATION } from '@constants/Common';
import { dev, prd, stg } from '@constants/Config';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import ToastHelpers from './ToastHelpers';

const generateMoneyStr = (moneyText) => `${formatNumberWithSeparator(moneyText.toString().trim())}`;

const formatNumberWithSeparator = (x, separator = '.') => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

const formatCurrencyUnit = (x) => {
    let strReverts = x.toString().split('').reverse().join('');
    strReverts = strReverts.replace('000000', 'm');
    strReverts = strReverts.replace('000', 'k');
    const result = strReverts.split('').reverse().join('');
    return result;
};

const formatCurrency = (number = 0, separator = '.', hasCurrencyText = false) => {
    if (hasCurrencyText) {
        return formatCurrencyUnit(number);
    }

    return formatNumberWithSeparator(number?.toString().trim(), separator);
};

const handleResByStatus = (response) => {
    const {
        status,
        data
    } = response;

    if (status === 200 || status === 201) {
        return {
            data,
            status
        };
    }

    return {
        data: null,
        status
    };
};

export const mappingStatusText = (status) => {
    switch (status) {
        case BookingStatus.SCHEDULED:
            return 'Chờ xác nhận';
        case BookingStatus.PAID: return 'Đã được thanh toán';
        case BookingStatus.CONFIRMED: return 'Đã được xác nhận';
        case BookingStatus.COMPLETED: return 'Buổi hẹn hoàn tất';
        default:
            return 'Đã huỷ';
    }
};

// 2021-12-08T21:26:26.61144
export const formatTime = (timeString, format = 'HH:mm:ss DD/MM/YYYY') => {
    const timestamp = new Date(timeString);
    return moment(timestamp).format(format);
};

export const getConfigByEnv = () => {
    switch (App.ENV) {
        case 'dev':
            return dev;
        case 'prd': {
            return prd;
        }
        default:
            return stg;
    }
};

export const correctFullNameDisplay = (fullName) => {
    const nameArr = fullName?.trim().split(' ');
    if (nameArr && nameArr.length === 4) {
        return `${nameArr[0]} ${nameArr[1]}\n${nameArr[2]} ${nameArr[3]}`;
    }
    return fullName?.trim().toUpperCase();
};

export const getLocationIndexByName = (locationName) => {
    const locationIndex = LOCATION.findIndex((item) => item.value.toLowerCase() === locationName.toLowerCase());
    return locationIndex;
};

export const arrayUnique = (array, prop) => {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (prop) {
                if (JSON.stringify(a[i][prop]) === JSON.stringify(a[j][prop])) { a.splice(j--, 1); }
            } else if (JSON.stringify(a[i]) === JSON.stringify(a[j])) { a.splice(j--, 1); }
        }
    }

    return a;
};

export const checkVersion = async () => {
    const localVersion = await SecureStore.getItemAsync('LOCAL_VERSION');
    SecureStore.setItemAsync('LOCAL_VERSION', App.STORE_VERSION);

    if (!localVersion) {
        return false;
    }
    return localVersion !== App.STORE_VERSION;
};

export const clearAllLocalStorage = () => {
    SecureStore.deleteItemAsync('api_token')
        .then(console.log('api_token was cleaned!'));

    SecureStore.deleteItemAsync('username')
        .then(console.log('phoneNumber was cleaned!'));

    SecureStore.deleteItemAsync('password')
        .then(console.log('password was cleaned!'));

    SecureStore.deleteItemAsync('deviceId')
        .then(console.log('deviceId was cleaned!'));

    SecureStore.deleteItemAsync('LOCAL_VERSION').then(console.log('LOCAL_VERSION was cleaned!'));

    ToastHelpers.renderToast('All caches cleaned!', 'success');
};

export default {
    generateMoneyStr,
    formatNumberWithSeparator,
    handleResByStatus,
    formatCurrencyUnit,
    formatCurrency,
    formatTime
};
