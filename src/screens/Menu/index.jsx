/* eslint-disable import/no-unresolved */
import {
    CustomText, IconCustom, Separator
} from '@components/uiComponents';
import App from '@constants/App';
import IconFamily from '@constants/IconFamily';
import OutsideApp from '@constants/OutsideApp';
import ScreenName from '@constants/ScreenName';
import ScreenTitle from '@constants/ScreenTitle';
import Theme from '@constants/Theme';
import { getConfigByEnv } from '@helpers/CommonHelpers';
import ToastHelpers from '@helpers/ToastHelpers';
import { resetStoreSignOut } from '@redux/Actions';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import {
    FlatList, Platform, TouchableOpacity, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const { ENV } = getConfigByEnv();

const {
    SIZES, FONT: {
        TEXT_BOLD
    },
    COLORS
} = Theme;

export default function Menu({ navigation }) {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const listMenu = [
        // {
        //     title: 'Đơn hẹn',
        //     icon: {
        //         name: 'list-alt',
        //         family: IconFamily.FONT_AWESOME,
        //         size: 26,
        //     },
        //     onPress: () => {
        //         navigation.navigate(ScreenName.LEADER_BOARD);
        //     },
        // },
        {
            title: ScreenTitle.POLICY,
            icon: {
                name: 'legal',
                family: IconFamily.FONT_AWESOME,
                size: 20,
            },
            onPress: () => {
                navigation.navigate(ScreenName.POLICY);
            },
        },
        {
            title: ScreenTitle.GUIDE,
            icon: {
                name: 'book',
                family: IconFamily.FONT_AWESOME,
                size: 22,
            },
            onPress: () => {
                navigation.navigate(ScreenName.GUIDE);
            },
        },
        // {
        //     title: ScreenTitle.LEADER_BOARD,
        //     icon: {
        //         name: 'award',
        //         family: IconFamily.FONT_AWESOME_5,
        //         size: 22,
        //     },
        //     onPress: () => {
        //         navigation.navigate(ScreenName.LEADER_BOARD);
        //     },
        // },
        !currentUser.isPartnerVerified && {
            title: 'Đăng ký Host',
            icon: {
                name: 'star',
                family: IconFamily.FONT_AWESOME,
                size: 24,
            },
            onPress: () => {
                navigation.navigate(ScreenName.VERIFICATION, {
                    navigateFrom: ScreenName.MENU
                });
            },
        },
        {
            title: ScreenTitle.CHANGE_PASSWORD,
            icon: {
                name: 'user-lock',
                family: IconFamily.FONT_AWESOME_5,
                size: 18,
            },
            onPress: () => {
                navigation.navigate(ScreenName.CHANGE_PASSWORD);
            },
        },
        {
            title: ScreenTitle.SUPPORT,
            icon: {
                family: IconFamily.MATERIAL_ICONS,
                size: 26,
                name: 'contact-support',
            },
            onPress: () => {
                navigation.navigate(ScreenName.SUPPORT);
            },
        },
        // {
        //     title: ScreenTitle.SETTINGS,
        //     icon: {
        //         name: 'gear',
        //         family: IconFamily.FONT_AWESOME,
        //         size: 26,
        //     },
        //     onPress: () => {
        //         navigation.navigate(ScreenName.SETTINGS);
        //     },
        // },
        {
            title: 'Fanpage',
            icon: {
                name: 'facebook-square',
                family: IconFamily.FONT_AWESOME,
                size: 24,
            },
            onPress: () => {
                Linking.openURL(`${OutsideApp.FACEBOOK.deepLink}`);
            },
        },
        {
            title: 'Đánh giá ứng dụng',
            // icon: {
            //     name: 'facebook-square',
            //     family: IconFamily.FONT_AWESOME,
            //     size: 24,
            // },
            icon: Platform.OS === 'ios' ? {
                name: 'logo-apple-appstore',
                family: IconFamily.IONICONS,
                size: 24,
            } : {
                name: 'google-play',
                family: IconFamily.ENTYPO,
                size: 24,
            },
            onPress: () => {
                if (Platform.OS === 'ios') {
                    //
                } else {
                    Linking.openURL(OutsideApp.GOOGLE_PLAY_STORE.deepLink);
                }
            },
        },
        {
            title: 'Đăng xuất',
            onPress: () => onSignOut(),
            icon: {
                name: 'logout',
                size: 20,
                family: IconFamily.SIMPLE_LINE_ICONS
            },
        },
    ];

    const onSignOut = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.ONBOARDING }],
        });
        dispatch(resetStoreSignOut());
        SecureStore.deleteItemAsync('api_token')
            .then(console.log('api_token was cleaned!'));
    };

    const renderMenuItem = (menuItem) => {
        if (!menuItem) {
            return <></>;
        }

        const { icon } = menuItem;
        return (
            (
                <View style={{
                    alignSelf: 'center',
                    backgroundColor: COLORS.BASE
                }}
                >
                    <Separator />
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: SIZES.WIDTH_MAIN,
                            alignSelf: 'center',
                            height: 60,
                        }}
                        onPress={() => menuItem.onPress()}
                    >
                        <View
                            style={{
                                flex: 1
                            }}
                        >
                            <IconCustom
                                name={icon.name}
                                family={icon.family}
                                size={icon.size}
                                color={COLORS.ACTIVE}
                            />
                        </View>
                        <View
                            style={{
                                flex: 9,
                            }}
                        >
                            <CustomText
                                text={menuItem.title}
                                style={{
                                    fontSize: SIZES.FONT_H3,
                                    fontFamily: TEXT_BOLD
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        );
    };

    try {
        return (
            <View style={{
                backgroundColor: COLORS.SEPARATE,
                flex: 1
            }}
            >
                <FlatList
                    data={listMenu}
                    renderItem={({ item, index }) => renderMenuItem(item, index)}
                    keyExtractor={(item) => item?.title}
                />
                {/* <TouchableText
                    onPress={() => {
                        console.log('object');
                        Clipboard.setString(currentUser.expoNotificationToken);
                        ToastHelpers.renderToast('Đã lưu vào khay nhớ tạm.', 'success');
                    }}
                    style={{
                        fontSize: SIZES.FONT_H5,
                        textAlign: 'center',
                        marginBottom: 10
                    }}
                    text={currentUser.expoNotificationToken}
                /> */}
                <CustomText
                    style={{
                        fontSize: SIZES.FONT_H5,
                        textAlign: 'center',
                        marginBottom: 5
                    }}
                    text={`${ENV} - ${App.STORE_VERSION} (${App.APP_VERSION_OTA})`}
                />
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
