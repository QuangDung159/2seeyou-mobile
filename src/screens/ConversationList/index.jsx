/* eslint-disable max-len */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { ModalReport } from '@components/businessComponents';
import {
    CenterLoader, IconCustom, Separator
} from '@components/uiComponents';
import {
    GraphQueryString, IconFamily, Images, ScreenName, Theme
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { setListConversation, setNumberMessageUnread } from '@redux/Actions';
import { socketRequestUtil } from '@utils/index';
import React, { useEffect, useState } from 'react';
import {
    Alert, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function ConversationList({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [modalReasonVisible, setModalReasonVisible] = useState(false);
    const [userId, setUserId] = useState();

    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const listConversation = useSelector((state) => state.messageReducer.listConversation);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

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

    useEffect(
        () => {
            getListConversationFromSocket();
        }, [messageListened]
    );

    useEffect(
        () => {
            const onFocus = navigation.addListener('focus', () => {
                getListConversationFromSocket();
            });
            return onFocus;
        }
    );

    const countNumberOfUnreadConversation = (listMessage) => {
        if (messageListened.from === chattingWith) {
            return;
        }

        let count = 0;
        listMessage.forEach((conversation) => {
            if (conversation?.to === currentUser.id && !conversation?.isRead) {
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

    const getListConversationFromSocket = () => {
        const { token } = currentUser;
        const data = {
            query: GraphQueryString.GET_LIST_CONVERSATION,
            variables: { pageIndex: 1, pageSize: 20 }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            (res) => {
                dispatch(setListConversation(res.data.data.getRecently));
                countNumberOfUnreadConversation(res.data.data.getRecently);
                setRefreshing(false);
                setIsShowSpinner(false);
            },
            () => {
                setRefreshing(false);
                setIsShowSpinner(false);
            },
            () => {
                setRefreshing(false);
                setIsShowSpinner(false);
            }
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        getListConversationFromSocket();
    };

    const onClickMore = (conversationParams) => {
        Alert.alert(
            `${conversationParams.name}`,
            '',
            [
                {
                    text: 'Đóng',
                    style: 'cancel'
                },
                {
                    text: 'Xem trang cá nhân',
                    onPress: () => navigation.navigate(ScreenName.PROFILE, { userId: conversationParams.toUserId })
                },
                {
                    text: 'Chặn người dùng',
                    onPress: () => {
                        ToastHelpers.renderToast('Đã chặn người dùng, lệnh chặn sẽ hiệu lực sau 48h.');
                    }
                },
                {
                    text: 'Báo cáo người dùng',
                    onPress: () => {
                        setModalReasonVisible(true);
                        setUserId(conversationParams.toUserId);
                        ToastHelpers.renderToast('Chúng tôi sẽ xem xét báo cáo và phản hồi trong vòng 48h.\nChúng tôi xin lỗi về những trải nghiệm không thoải mái của bạn.');
                    }
                },
            ],
            { cancelable: true }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderConversationItem = (conversation) => {
        let params = {
            userStatus: 'Vừa mới truy cập',
            conversationId: conversation?.id
        };

        // detect this recently message from current user or another
        if (conversation?.to === currentUser.id) {
            // this recently message from another
            params = {
                ...params,
                toUserId: conversation?.from,
                userInfo: conversation?.fromUser,
                name: conversation?.fromUser?.fullName || 'N/A',
                imageUrl: conversation?.fromUser?.url,
                isRead: conversation?.isRead
            };
        } else {
            // this recently message from current user

            // eslint-disable-next-line no-param-reassign
            conversation.isRead = true;
            params = {
                ...params,
                toUserId: conversation?.to,
                userInfo: conversation?.toUser,
                name: conversation?.toUser?.fullName || 'N/A',
                imageUrl: conversation?.toUser?.url,
                isRead: conversation?.isRead
            };
        }

        return (
            <>
                <Separator />
                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: SIZES.WIDTH_BASE,
                        backgroundColor: COLORS.BASE
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: params.toUserId })}
                    >
                        <View
                            style={{
                                marginHorizontal: 10,
                                paddingVertical: 10
                            }}
                        >
                            <Image
                                source={
                                    params.imageUrl ? { uri: params.imageUrl } : Images.defaultImage
                                }
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={
                            () => {
                                onClickConversationItem(params);
                            }
                        }
                    >
                        <View
                            style={{
                                width: SIZES.WIDTH_BASE * 0.7
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: conversation?.isRead
                                        ? TEXT_REGULAR
                                        : TEXT_BOLD,
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.DEFAULT,
                                }}

                            >
                                {params.name}
                            </Text>
                            <View
                                style={{
                                    width: SIZES.WIDTH_BASE * 0.77
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: conversation?.isRead
                                            ? TEXT_REGULAR
                                            : TEXT_BOLD,
                                        fontSize: SIZES.FONT_H4,
                                        color: COLORS.DEFAULT,

                                    }}
                                    numberOfLines={1}
                                >
                                    {conversation?.content}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onClickMore(params)}
                    >
                        <View
                            style={{
                                marginHorizontal: 10,
                                paddingVertical: 10
                            }}
                        >
                            <IconCustom
                                name="more-horizontal"
                                family={IconFamily.FEATHER}
                                size={23}
                                color={COLORS.PLACE_HOLDER}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </>
        );
    };

    try {
        return (
            <View style={{
                backgroundColor: COLORS.SEPARATE,
                flex: 1
            }}
            >
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <>
                        <ModalReport
                            modalReasonVisible={modalReasonVisible}
                            setModalReasonVisible={(visible) => setModalReasonVisible(visible)}
                            setIsShowSpinner={(showSpinner) => setIsShowSpinner(showSpinner)}
                            userId={userId}
                        />
                        {listConversation && listConversation?.length !== 0 ? (
                            <FlatList
                                data={listConversation}
                                renderItem={({ item, index }) => renderConversationItem(item, index)}
                                keyExtractor={(item) => item.id}
                                refreshControl={(
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={() => onRefresh()}
                                        tintColor={COLORS.ACTIVE}
                                    />
                                )}
                            />
                        ) : (
                            <ScrollView
                                refreshControl={(
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={() => onRefresh()}
                                        tintColor={COLORS.ACTIVE}
                                    />
                                )}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        marginVertical: 15
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: TEXT_REGULAR,
                                            color: COLORS.DEFAULT,
                                            fontSize: SIZES.FONT_H3
                                        }}
                                    >
                                        Danh sách trống
                                    </Text>
                                </View>
                            </ScrollView>
                        )}
                    </>
                )}
            </View>
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
