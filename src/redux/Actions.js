import {
    SET_DEVICE_TIMEZONE,
    SET_DEVICE_LOCALE,
    SET_DEVICE_ID,
    SET_TOKEN,
    SET_CURRENT_USER,
    SET_LIST_BANK,
    SET_LIST_BOOKING_LOCATION,
    SET_LIST_NOTIFICATION,
    SET_MESSAGE_LISTENED,
    SET_LIST_CONVERSATION,
    SET_NUMBER_MESSAGE_UNREAD,
    SET_CHATING_WITH,
    RESET_STORE_SIGN_OUT,
    SET_DATA_LISTENED
} from './ActionTypes';

export const setDeviceTimezone = () => ({
    type: SET_DEVICE_TIMEZONE,
});

export const setDeviceLocale = () => ({
    type: SET_DEVICE_LOCALE,
});

export const setDeviceId = (deviceId) => ({
    type: SET_DEVICE_ID,
    payload: {
        deviceId
    }
});

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: {
        token
    }
});

export const setCurrentUser = (currentUser) => ({
    type: SET_CURRENT_USER,
    payload: {
        currentUser
    }
});

export const setListBank = (listBank) => ({
    type: SET_LIST_BANK,
    payload: {
        listBank
    }
});

export const setListBookingLocation = (listBookingLocation) => ({
    type: SET_LIST_BOOKING_LOCATION,
    payload: {
        listBookingLocation
    }
});

export const setListNotification = (listNotification) => ({
    type: SET_LIST_NOTIFICATION,
    payload: {
        listNotification
    }
});

export const setMessageListened = (messageListened) => ({
    type: SET_MESSAGE_LISTENED,
    payload: {
        messageListened
    }
});

export const setListConversation = (listConversation) => ({
    type: SET_LIST_CONVERSATION,
    payload: {
        listConversation
    }
});

export const setNumberMessageUnread = (numberMessageUnread) => ({
    type: SET_NUMBER_MESSAGE_UNREAD,
    payload: {
        numberMessageUnread
    }
});

export const setChattingWith = (chattingWith) => ({
    type: SET_CHATING_WITH,
    payload: {
        chattingWith
    }
});

export const resetStoreSignOut = () => ({
    type: RESET_STORE_SIGN_OUT
});

export const setDataListened = (dataListened) => ({
    type: SET_DATA_LISTENED,
    payload: {
        dataListened
    }
});