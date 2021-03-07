/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { Block, Text } from 'galio-framework';
import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from '../components/uiComponents';
import { GraphQueryString, NowTheme, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';
import { setListConversation, setNumberMessageUnread } from '../redux/Actions';
import { socketRequestUtil } from '../utils';

export default function ConversationList({ navigation }) {
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const listConversation = useSelector((state) => state.messageReducer.listConversation);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducerchattingWith);

    const dispatch = useDispatch();

    useEffect(
        () => {
            const onFocusScreen = navigation.addListener(
                'focus',
                () => {
                    getListConversationFromSocket(
                        1, 20,
                        (data) => {
                            dispatch(setListConversation(data.data.data.getRecently));
                            countNumberOfUnreadConversation(data.data.data.getRecently);
                        }
                    );
                }
            );
            return onFocusScreen;
        }, []
    );

    useEffect(
        () => {
            getListConversationFromSocket(
                1, 20,
                (data) => {
                    setListConversation(data.data.data.getRecently);
                    countNumberOfUnreadConversation(data.data.data.getRecently);
                }
            );
        }, [messageListened._id]
    );

    const countNumberOfUnreadConversation = () => {
        if (messageListened.from === chattingWith) {
            return;
        }

        let count = 0;
        listConversation.forEach((conversation) => {
            if (conversation.to === currentUser.id && !conversation.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberMessageUnread(count));
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onClickConversationItem = (conversationParams) => {
        if (!conversationParams.isRead) {
            dispatch(setNumberMessageUnread(numberMessageUnread - 1));
        }

        navigation.navigate(ScreenName.MESSAGE, conversationParams);
    };

    const getListConversationFromSocket = (pageIndex, pageSize, onFetchData) => {
        const data = {
            query: GraphQueryString.GET_LIST_CONVERSATION,
            variables: { pageIndex, pageSize }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            (res) => {
                onFetchData(res);
            },
            () => {},
            () => {}
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderConversationItem = (conversation) => {
        let params = {
            userStatus: 'Vừa mới truy cập',
            conversationId: conversation.id
        };

        // detect this recently message from current user or another
        if (conversation.to === currentUser.id) {
            // this recently message from another
            params = {
                ...params,
                toUserId: conversation.from,
                userInfo: conversation.fromUser,
                name: conversation.fromUser.fullName || 'N/A',
                imageUrl: conversation.fromUser.url,
                isRead: conversation.isRead
            };
        } else {
            // this recently message from current user

            // eslint-disable-next-line no-param-reassign
            conversation.isRead = true;
            params = {
                ...params,
                toUserId: conversation.to,
                userInfo: conversation.toUser,
                name: conversation.toUser.fullName || 'N/A',
                imageUrl: conversation.toUser.url,
                isRead: conversation.isRead
            };
        }

        return (
            <TouchableWithoutFeedback
                onPress={
                    () => onClickConversationItem(params)
                }
            >
                <Block
                    row
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Block
                        style={{
                            marginHorizontal: 10,
                            paddingVertical: 10
                        }}
                    >
                        <Image
                            source={{
                                uri: params.imageUrl
                            }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25
                            }}
                        />
                    </Block>
                    <Block>
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                            }}
                            size={16}
                            color={NowTheme.COLORS.DEFAULT}
                        >
                            {params.name}
                        </Text>
                        <Block
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.77
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: conversation.isRead
                                        ? NowTheme.FONT.MONTSERRAT_REGULAR
                                        : NowTheme.FONT.MONTSERRAT_BOLD

                                }}
                                size={16}
                                color={NowTheme.COLORS.DEFAULT}
                                numberOfLines={2}
                            >
                                {conversation.content}
                            </Text>
                        </Block>
                    </Block>
                </Block>
                <Block
                    alignItems="flex-end"
                >
                    <Line
                        borderColor={NowTheme.COLORS.ACTIVE}
                        borderWidth={0.5}
                        width={NowTheme.SIZES.WIDTH_BASE * 0.85}
                    />
                </Block>
            </TouchableWithoutFeedback>
        );
    };

    try {
        return (
            <FlatList
                data={listConversation}
                renderItem={({ item, index }) => renderConversationItem(item, index)}
                keyExtractor={(item) => item.id}
            />
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}
