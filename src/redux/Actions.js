import {
    RESET_STORE_SIGN_OUT, SET_CHATTING_WITH, SET_COUNTDOWN_SEND_OTP_REDUX, SET_CURRENT_BOOKING_REDUX, SET_CURRENT_USER,
    SET_DATA_LISTENED, SET_DEVICE_LOCALE, SET_DEVICE_TIMEZONE,
    SET_EXPO_TOKEN, SET_IS_SIGN_IN_OTHER_DEVICE_STORE, SET_LIST_BANK,
    SET_LIST_BOOKING_LOCATION,
    SET_LIST_BOOKING_STORE,
    SET_LIST_CASH_HISTORY_STORE,
    SET_LIST_CONVERSATION, SET_LIST_NOTIFICATION, SET_LIST_PARTNER_HOME_REDUX, SET_MESSAGE_LISTENED,
    SET_NAVIGATION,
    SET_NOTIFICATION_RECEIVED_REDUX,
    SET_NUMBER_MESSAGE_UNREAD,
    SET_NUMBER_NOTIFICATION_UNREAD,
    SET_PERSON_TAB_ACTIVE_INDEX,
    SET_SHOW_LOADER_STORE, SET_TOKEN,
    SET_VERIFICATION_STORE
} from './ActionTypes';

export const setDeviceTimezone = () => ({
    type: SET_DEVICE_TIMEZONE,
});

export const setDeviceLocale = () => ({
    type: SET_DEVICE_LOCALE,
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
    type: SET_CHATTING_WITH,
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

export const setExpoToken = (expoToken) => ({
    type: SET_EXPO_TOKEN,
    payload: {
        expoToken
    }
});

export const setNumberNotificationUnread = (numberNotificationUnread) => ({
    type: SET_NUMBER_NOTIFICATION_UNREAD,
    payload: {
        numberNotificationUnread
    }
});

export const setNavigation = (navigationObj) => ({
    type: SET_NAVIGATION,
    payload: {
        navigationObj
    }
});

export const setPersonTabActiveIndex = (personTabActiveIndex) => ({
    type: SET_PERSON_TAB_ACTIVE_INDEX,
    payload: {
        personTabActiveIndex
    }
});

export const setListCashHistoryStore = (listCashHistoryStore) => ({
    type: SET_LIST_CASH_HISTORY_STORE,
    payload: {
        listCashHistoryStore
    }
});

export const setListBookingStore = (listBookingStore) => ({
    type: SET_LIST_BOOKING_STORE,
    payload: {
        listBookingStore
    }
});

export const setVerificationStore = (verificationStore) => ({
    type: SET_VERIFICATION_STORE,
    payload: {
        verificationStore
    }
});

export const setIsSignInOtherDeviceStore = (isSignInOtherDeviceStore) => ({
    type: SET_IS_SIGN_IN_OTHER_DEVICE_STORE,
    payload: {
        isSignInOtherDeviceStore
    }
});

export const setShowLoaderStore = (showLoaderStore) => ({
    type: SET_SHOW_LOADER_STORE,
    payload: {
        showLoaderStore
    }
});

export const setNotificationReceivedRedux = (notificationReceivedRedux) => ({
    type: SET_NOTIFICATION_RECEIVED_REDUX,
    payload: {
        notificationReceivedRedux
    }
});

export const setCurrentBookingRedux = (currentBookingRedux) => ({
    type: SET_CURRENT_BOOKING_REDUX,
    payload: {
        currentBookingRedux
    }
});

export const setListPartnerHomeRedux = (listPartnerHomeRedux) => {
    const result = listPartnerHomeRedux?.filter((item) => !item.userName.includes('pickme-'));

    return {
        type: SET_LIST_PARTNER_HOME_REDUX,
        payload: {
            listPartnerHomeRedux: result
        }
    };
};

export const setCountdownSendOtpRedux = (countdownSendOtpRedux) => ({
    type: SET_COUNTDOWN_SEND_OTP_REDUX,
    payload: {
        countdownSendOtpRedux
    }
});
