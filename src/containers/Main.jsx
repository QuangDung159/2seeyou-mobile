/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
/* eslint-disable no-shadow */
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SOCKET_URL } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Block, GalioProvider } from 'galio-framework';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Listener } from '../components/bussinessComponents';
import { NowTheme } from '../constants';
import Stacks from '../navigations/Stacks';
import { setDeviceId, setDeviceTimezone, setMessageListened } from '../redux/Actions';

export default function Main() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.userReducer.token);

    // apollo
    // Instantiate required constructor fields
    const cache = new InMemoryCache();

    const createHttpLink = (token) => {
        const httpLink = new HttpLink({
            uri: `https:${SOCKET_URL}`,
            headers: {
                authorization: token,
            }
        });
        return httpLink;
    };

    const createWsLink = (token) => {
        const wsLink = new WebSocketLink({
            uri: `ws:${SOCKET_URL}/subscriptions`,
            options: {
                reconnect: true,
                connectionParams: {
                    authorization: token,
                },
            }
        });
        return wsLink;
    };

    const doSplitLink = (token) => {
        split(
            ({ query }) => {
                const definition = getMainDefinition(query);
                return (
                    definition.kind === 'OperationDefinition'
          && definition.operation === 'subscription'
                );
            },
            createWsLink(token),
            createHttpLink(token),
        );
    };

    useEffect(
        () => {
            dispatch(setDeviceId(Constants.deviceId));
            dispatch(setDeviceTimezone());
        }, [dispatch]
    );

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

    try {
        return (
            <ApolloProvider client={
                new ApolloClient({
                    cache,
                    link: doSplitLink(token),
                })
            }
            >
                <NavigationContainer>
                    <Listener
                        onListenedData={(data) => { handleData(data.listen); }}
                    />
                    <GalioProvider theme={NowTheme}>
                        <Block flex>
                            <Stacks />
                        </Block>
                    </GalioProvider>
                </NavigationContainer>
            </ApolloProvider>
        );
    } catch (error) {
        console.log('error', error);
    }
}