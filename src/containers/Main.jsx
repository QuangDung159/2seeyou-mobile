/* eslint-disable no-shadow */
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Listener } from '@components/businessComponents';
import OutsideApp from '@constants/OutsideApp';
import ScreenName from '@constants/ScreenName';
import { checkVersion, getConfigByEnv } from '@helpers/CommonHelpers';
import Stacks from '@navigations/Stacks';
import { NavigationContainer } from '@react-navigation/native';
import {
    setDeviceTimezone, setMessageListened, setNotificationReceivedRedux, setPersonTabActiveIndex
} from '@redux/Actions';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';

const { SOCKET_URL } = getConfigByEnv();

export default function Main() {
    const notificationReceivedRedux = useSelector((state) => state.notificationReducer.notificationReceivedRedux);
    const navigationObj = useSelector((state) => state.appConfigReducer.navigationObj);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const dispatch = useDispatch();

    useEffect(
        () => {
            dispatch(setDeviceTimezone());
            generateNewDeviceId();
            setTimeout(
                () => {
                    checkForUpdate();
                }, 2000
            );
        }, []
    );

    useEffect(
        () => {
            if (notificationReceivedRedux) {
                handleNotificationByType(notificationReceivedRedux.Type);
            }
        }, [notificationReceivedRedux]
    );

    const checkForUpdate = async () => {
        if (await checkVersion()) {
            Alert.alert('Đã có bản cập nhật mới',
                'Vui lòng cập nhật ứng dụng để có trải nghiệm tốt nhất với 2SeeYou',
                [
                    {
                        text: 'Cập nhật',
                        onPress: () => {
                            Linking.openURL(OutsideApp.GOOGLE_PLAY_STORE.deepLink);
                        },
                    }
                ]);
        }
    };

    // apollo
    // Instantiate required constructor fields
    const cache = new InMemoryCache();

    const httpLink = new HttpLink({
        uri: `http:${SOCKET_URL}`,
        headers: {
            authorization: `Bearer ${currentUser.token}`,
        }
    });

    const wsLink = new WebSocketLink({
        uri: `ws:${SOCKET_URL}/subscriptions`,
        options: {
            reconnect: true,
            connectionParams: {
                authorization: `Bearer ${currentUser.token}`,
            },
        }
    });

    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition'
            && definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink,
    );

    const client = new ApolloClient({
        cache,
        link: splitLink,
    });

    // check new installation
    const generateNewDeviceId = async () => {
        const deviceId = await SecureStore.getItemAsync('deviceId');

        if (!deviceId) {
            const myuuid = uuid.v4();

            // store deviceId to device storage
            SecureStore.setItemAsync('deviceId', myuuid);
        }
    };

    const handleNotification = () => {};

    const handleData = (data) => {
        const {
            type,
            payload
        } = data;

        if (type === 'message') {
            dispatch(setMessageListened(payload));
        } else {
            handleNotification(payload);
        }
    };

    const handleNotificationByType = (notificationType) => {
        switch (notificationType) {
            case 2: {
                dispatch(setPersonTabActiveIndex(2));
                break;
            }
            case 3: {
                dispatch(setPersonTabActiveIndex(1));
                break;
            }
            case 4: {
                dispatch(setPersonTabActiveIndex(1));
                break;
            }
            case 5: {
                dispatch(setPersonTabActiveIndex(2));
                break;
            }
            default: {
                break;
            }
        }
        navigationObj.navigate(ScreenName.PERSONAL);
        dispatch(setNotificationReceivedRedux(null));
    };

    try {
        return (
            <ApolloProvider client={client}>
                <NavigationContainer>
                    <Listener
                        onListenedData={(data) => { handleData(data.listen); }}
                    />
                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <Stacks />
                    </View>
                </NavigationContainer>
            </ApolloProvider>
        );
    } catch (error) {
        console.log('error', error);
    }
}
