import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import {
    Alert,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Rx, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import {
    setCurrentUser,
    setExpoToken,
    setListBookingStore,
    setListCashHistoryStore,
    setListNotification,
    setNumberNotificationUnread,
    setPersonTabActiveIndex
} from '../../redux/Actions';
import { rxUtil } from '../../utils';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function ExpoNotification() {
    const notificationListener = useRef();
    const responseListener = useRef();

    const token = useSelector((state) => state.userReducer.token);
    const navigationObj = useSelector((state) => state.appConfigReducer.navigationObj);

    const dispatch = useDispatch();

    useEffect(() => {
        registerForPushNotificationsAsync().then(() => {});

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(
        () => {
        // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener((notificationReceived) => {
            // in app trigger
                if (token && token !== 'Bearer ' && token !== 'Bearer null') {
                    getListNotiFromAPI();

                    const notiType = notificationReceived.request?.content?.data?.Type;

                    switch (notiType) {
                        case 1: {
                            getListBooking();
                            break;
                        }
                        case 2: {
                            fetchCurrentUserInfo();
                            fetchHistory();
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            });
        }, [token]
    );

    useEffect(
        () => {
        // This listener is fired
        // whenever a user taps on or interacts
        // with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            // on click noti popup outside
                const navigationData = response.notification.request.content.data;
                onClickRead(navigationData.Id, navigationData.NavigationId, navigationData.Type);
            });
        }, [navigationObj]
    );

    const fetchCurrentUserInfo = () => {
        rxUtil(
            Rx.USER.CURRENT_USER_INFO,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setCurrentUser(res.data.data));
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const fetchHistory = () => {
        rxUtil(
            Rx.CASH.GET_CASH_HISTORY,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setListCashHistoryStore(res.data.data));
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const onClickRead = (notiId = null, navigationId, navigationType) => {
        const endpoint = `${Rx.NOTIFICATION.TRIGGER_READ}/${notiId}`;

        rxUtil(
            endpoint,
            'POST',
            null,
            {
                Authorization: token
            },
            () => {
                handleNavigation(navigationId, navigationType);
                getListNotiFromAPI();
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const countNumberNotificationUnread = (listNotiFromAPI) => {
        let count = 0;
        listNotiFromAPI.forEach((item) => {
            if (!item.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberNotificationUnread(count));
    };

    const getListNotiFromAPI = () => {
        rxUtil(
            Rx.NOTIFICATION.GET_MY_NOTIFICATION,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                // set store
                dispatch(setListNotification(res.data.data));
                countNumberNotificationUnread(res.data.data);
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const getListBooking = () => {
        const pagingStr = '?pageIndex=1&pageSize=100';

        rxUtil(
            `${Rx.BOOKING.GET_MY_BOOKING_AS_CUSTOMER}${pagingStr}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setListBookingStore(res.data.data));
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const handleNavigation = (navigationId, navigationType) => {
        if (navigationObj) {
            switch (navigationType) {
                case 1: {
                    navigationObj.navigate(ScreenName.BOOKING_DETAIL, { bookingId: navigationId });
                    break;
                }
                case 3: {
                    navigationObj.navigate(ScreenName.PERSONAL);
                    dispatch(setPersonTabActiveIndex(1));
                    break;
                }
                default: {
                    break;
                }
            }
        }
    };

    async function registerForPushNotificationsAsync() {
        let expoToken;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert('Failed to get push token for push notification!');
                return;
            }
            expoToken = (await Notifications.getExpoPushTokenAsync()).data;
            dispatch(setExpoToken(expoToken));
        } else {
            Alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    return (
        null
    );
}
