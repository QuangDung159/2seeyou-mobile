/* eslint-disable max-len */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { CenterLoader, CustomInput, IconCustom } from '@components/uiComponents';
import {
    GraphQueryString, IconFamily, ScreenName, Theme
} from '@constants/index';
import { checkIsFillDataForTheFirstTime } from '@helpers/CommonHelpers';
import { ToastHelpers } from '@helpers/index';
import { setChattingWith, setNumberMessageUnread } from '@redux/Actions';
import { socketRequestUtil } from '@utils/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function Message({ navigation, route }) {
    const [listMessageFromAPI, setListMessageFromAPI] = useState([]);
    const [messageFromInput, setMessageFromInput] = useState('');
    const [nextPageIndex, setNextPageIndex] = useState(2);
    const [isShowLoader, setIsShowLoader] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const {
        params: {
            toUserId
        }
    } = route;

    const dispatch = useDispatch();

    useEffect(
        () => {
            setIsShowLoader(true);

            fetchListMessage(toUserId, 1, 20,
                (data) => {
                    dispatch(setChattingWith(toUserId));

                    setListMessageFromAPI(data.data.data.messages);
                    setIsShowLoader(false);
                });

            const onBlurScreen = navigation.addListener('blur', () => {
                dispatch(setChattingWith(''));
            });

            // fetch data when go back
            const onFocusScreen = navigation.addListener('focus', () => {
                fetchListMessage(
                    toUserId,
                    1,
                    20,
                    (data) => {
                        dispatch(setChattingWith(toUserId));
                        setListMessageFromAPI(data.data.data.messages);
                        calculateNumberOfNumberMessageUnread(data.data.data.messages);
                    }
                );

                // check latest message from another and unread by current user

                return () => {
                    onBlurScreen;
                    onFocusScreen;
                };
            });
        }, []
    );

    useEffect(
        () => {
            if (chattingWith === messageListened.from) {
                fetchListMessage(
                    toUserId,
                    1,
                    20,
                    (data) => {
                        dispatch(setChattingWith(toUserId));
                        setListMessageFromAPI(data.data.data.messages);
                    }
                );
            }

            triggerReadAllMessage(toUserId);
        }, [messageListened._id]
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    const calculateNumberOfNumberMessageUnread = (listMessage) => {
        const latestMessage = listMessage[0];

        if (latestMessage.from !== currentUser.id && !latestMessage.isRead) {
            if (numberMessageUnread > 0) {
                dispatch(setNumberMessageUnread(numberMessageUnread - 1));
            }
        }

        setTimeout(
            () => triggerReadAllMessage(toUserId),
            500
        );
    };

    // trigger read all message in backend
    const triggerReadAllMessage = (chattingWithUserId) => {
        const { token } = currentUser;
        const data = {
            query: GraphQueryString.READ_ALL_MESSAGE,
            variables: { from: chattingWithUserId }
        };

        socketRequestUtil(
            'POST',
            data,
            token
        );
    };

    const fetchListMessage = (to, pageIndex, pageSize, onSuccess) => {
        const { token } = currentUser;
        const data = {
            query: GraphQueryString.GET_LIST_MESSAGE,
            variables: {
                to,
                pageIndex,
                pageSize
            }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            (res) => {
                onSuccess(res);
            }
        );
    };

    const renderMessageItem = (message) => {
        const { id } = currentUser;

        const messageStyle = id !== message.from ? styles.messageRight : styles.messageLeft;
        const flexDirection = id !== message.from ? 'row' : 'row-reverse';
        return (
            <View
                style={{
                    marginBottom: 10,
                    flexDirection,
                }}
            >
                <View
                    style={{
                        marginHorizontal: 5
                    }}
                />
                <View
                    style={
                        [
                            {
                                borderRadius: 10,
                                maxWidth: SIZES.WIDTH_BASE * 0.8,
                                borderColor: COLORS.ACTIVE,
                                borderWidth: 0.5,
                                backgroundColor: COLORS.BASE
                            },
                            messageStyle
                        ]
                    }
                >
                    <View>
                        <Text
                            style={{
                                margin: 10,
                                fontFamily: TEXT_REGULAR,
                                color: COLORS.DEFAULT,
                                fontSize: SIZES.FONT_H3
                            }}
                        >
                            {message.content}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y
          >= contentSize.height - paddingToBottom;
    };

    const renderListMessage = () => (
        <FlatList
            inverted
            showsVerticalScrollIndicator={false}
            data={listMessageFromAPI}
            keyExtractor={() => uuid.v4()}
            renderItem={({ item }) => renderMessageItem(item)}
            style={{
                backgroundColor: COLORS.BASE
            }}
            onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                    addListMessagePaging();
                }
            }}
            scrollEventThrottle={400}
        />
    );

    const addListMessagePaging = () => {
        fetchListMessage(
            toUserId,
            nextPageIndex, 15,
            (data) => {
                const newListMessage = listMessageFromAPI.concat(
                    data.data.data.messages
                );

                setListMessageFromAPI(newListMessage);
                setNextPageIndex(nextPageIndex + 1);
            }
        );
    };

    const addLatestMessage = (messagePayload) => {
        const { id } = currentUser;

        // eslint-disable-next-line no-param-reassign
        messagePayload.from = id;
        const newArray = [...listMessageFromAPI];
        newArray.unshift(messagePayload);
        setListMessageFromAPI(newArray);
    };

    const onChangeMessageInput = (messageInput) => {
        setMessageFromInput(messageInput);
    };

    const triggerSendMessage = () => {
        const { token } = currentUser;
        const data = {
            query: GraphQueryString.SEND_MESSAGE,
            variables: {
                data: {
                    to: toUserId,
                    content: messageFromInput
                }
            }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            null,
            null,
            () => {
                ToastHelpers.renderToast('Có lỗi xảy ra, vui lòng đăng xuất và đăng nhập trở lại.');
            }
        );

        const messagePayload = {
            from: '',
            content: messageFromInput,
            createdAt: moment().unix() * 1000
        };

        addLatestMessage(messagePayload);
        setMessageFromInput('');
    };

    const renderInputMessage = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.BASE,
                height: 50,
                borderTopWidth: 0.5,
                borderTopColor: COLORS.ACTIVE
            }}
        >
            <CustomInput
                placeholder="Nhập tin nhắn"
                value={messageFromInput}
                onChangeText={(input) => onChangeMessageInput(input)}
                containerStyle={{
                    marginVertical: 10,
                    width: SIZES.WIDTH_90
                }}
                inputStyle={{
                    borderWidth: 0,
                    textAlign: 'left',
                    width: SIZES.WIDTH_90
                }}
                autoCapitalize
            />

            <TouchableOpacity
                onPress={() => {
                    if (messageFromInput !== '') {
                        if (!checkIsFillDataForTheFirstTime(currentUser, navigation)) {
                            triggerSendMessage();
                        }
                    }
                }}
                style={{
                    marginRight: 10,
                }}
            >
                <IconCustom
                    name="send"
                    family={IconFamily.FEATHER}
                    size={30}
                    color={COLORS.ACTIVE}
                />
            </TouchableOpacity>
        </View>
    );

    try {
        return (
            <>
                {isShowLoader ? (
                    <CenterLoader />
                ) : (
                    <>
                        {renderListMessage()}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={90}
                        >
                            {renderInputMessage()}
                        </KeyboardAvoidingView>
                    </>
                )}
            </>
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

const styles = StyleSheet.create({
    messageRight: {
        alignItems: 'flex-start',
        backgroundColor: COLORS.BASE
    },
    messageLeft: {
        alignItems: 'flex-end',
        backgroundColor: COLORS.BASE
    }
});
