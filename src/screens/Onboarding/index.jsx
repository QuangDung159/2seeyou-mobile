/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import {
    CenterLoader, CustomButton, CustomModal, CustomText, TouchableText
} from '@components/uiComponents';
import App from '@constants/App';
import {
    Images, ScreenName, Theme
} from '@constants/index';
import { clearAllLocalStorage, getConfigByEnv } from '@helpers/CommonHelpers';
import {
    setCurrentUser, setIsSignInOtherDeviceStore, setListPartnerHomeRedux, setNavigation
} from '@redux/Actions';
import { BookingServices, UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    Image, StyleSheet, Text, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import SignIn from './SignIn';

const { ENV } = getConfigByEnv();

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function Onboarding({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [deviceIdDisplay, setDeviceIdDisplay] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    // const [isRegisterPartner, setIsRegisterPartner] = useState(false);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            getListPartner();
            dispatch(setNavigation(navigation));
            onLogin();

            SecureStore.getItemAsync('deviceId').then((deviceIdLocal) => {
                setDeviceIdDisplay(deviceIdLocal);
            });
        }, []
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

    const getListPartner = async () => {
        const result = await BookingServices.fetchListPartnerAsync({ pageIndex: 1 });
        const { data } = result;

        if (data) {
            dispatch(setListPartnerHomeRedux(data.data));
        }
    };

    const onLogin = async () => {
        const phoneNumber = await SecureStore.getItemAsync('username');
        const password = await SecureStore.getItemAsync('password');
        const apiToken = await SecureStore.getItemAsync('api_token');
        const deviceId = await SecureStore.getItemAsync('deviceId');

        if (apiToken) {
            if (phoneNumber && password) {
                const body = {
                    username: phoneNumber,
                    password,
                    deviceId
                };

                setIsShowSpinner(true);
                const result = await UserServices.submitLoginAsync(body);
                const {
                    data, status
                } = result;

                if (data) {
                    const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
                    SecureStore.setItemAsync('api_token', `${currentUserInfo.token}`);
                    dispatch(setCurrentUser(currentUserInfo));

                    if (status === 200) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: ScreenName.APP }],
                        });
                        dispatch(setIsSignInOtherDeviceStore(false));
                    }

                    if (status === 201) {
                    // re otp
                        navigation.reset({
                            index: 0,
                            routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                        });
                    }
                } else {
                    setIsShowSpinner(false);
                }
            }
        }
    };

    const renderModalRegisterPartner = () => (
        <CustomModal
            modalVisible={modalVisible}
            renderContent={() => (
                <View>
                    <CustomText
                        style={{
                            textAlign: 'center',
                            marginBottom: 10,
                            fontSize: SIZES.FONT_H4
                        }}
                        text="Vui lòng đăng nhập để tiếp tục"
                    />

                    <CustomText
                        style={{
                            textAlign: 'center',
                            marginBottom: 10,
                            fontSize: SIZES.FONT_H4
                        }}
                        text={'Nếu bạn chưa có tài khoản,\nvui lòng đăng ký tài khoản 2SeeYou'}
                    />

                    <View>
                        <CustomButton
                            onPress={() => setModalVisible(!modalVisible)}
                            buttonStyle={[styles.button, {
                                width: SIZES.WIDTH_BASE * 0.8
                            }]}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

    return (
        <>
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        backgroundColor: COLORS.BASE,
                        alignItems: 'center',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <>
                        <View
                            style={{
                                position: 'absolute',
                                top: 40,
                                zIndex: 99,
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {/* <CustomText
                                style={{
                                    fontSize: SIZES.FONT_H5 - 4
                                }}
                                text={`${Constants.manifest.version} (${App.APP_VERSION_OTA})`}
                            /> */}
                            <CustomText
                                style={{
                                    fontSize: SIZES.FONT_H5 - 4
                                }}
                                text={!deviceIdDisplay || ''}
                            />
                        </View>
                        {renderModalRegisterPartner()}
                        <View
                            style={{
                                marginTop: 115
                            }}
                        >
                            <View
                                style={{
                                    paddingBottom: 35,
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    source={Images.Logo}
                                    style={{
                                        width: SIZES.WIDTH_MAIN,
                                        height: 50
                                    }}
                                />
                                <CustomText
                                    style={{
                                        color: COLORS.ACTIVE,
                                        fontSize: SIZES.FONT_H2
                                    }}
                                    text="Cà phê nhé!"
                                />
                            </View>
                        </View>
                        <SignIn
                            navigation={navigation}
                            setIsShowSpinner={(isShow) => setIsShowSpinner(isShow)}
                            // isRegisterPartner={isRegisterPartner}
                        />
                        <View
                            style={{
                                marginTop: 10,
                                alignSelf: 'center',
                                alignItems: 'center',
                                marginBottom: 30
                            }}
                        >
                            <TouchableText
                                style={{
                                    color: COLORS.ACTIVE,
                                    fontSize: SIZES.FONT_H3,
                                    fontFamily: TEXT_BOLD
                                }}
                                onLongPress={() => clearAllLocalStorage()}
                                text="Đăng ký"
                                onPress={() => navigation.navigate(ScreenName.SIGN_UP)}
                            />
                            {/* <TouchableText
                                text="Quên mật khẩu?"
                                onPress={() => navigation.navigate(ScreenName.FORGOT_PASSWORD)}
                                style={{
                                    color: COLORS.ACTIVE,
                                    marginBottom: 10,
                                    fontSize: SIZES.FONT_H3
                                }}
                            /> */}
                            {/* <BecomePartnerText onPress={() => {
                                setModalVisible(true);
                                setIsRegisterPartner(true);
                            }}
                            /> */}
                            <TouchableText
                                style={{
                                    fontSize: SIZES.FONT_H5,
                                    marginTop: 10,
                                    textAlign: 'center',
                                    width: SIZES.WIDTH_MAIN,
                                }}
                                text={'Bằng việc đăng nhập vào ứng dụng,\nbạn đã đồng ý với "Điều khoản sử dụng" của ứng dụng'}
                                onPress={() => navigation.navigate(ScreenName.POLICY)}
                            />
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 15,
                                alignSelf: 'center'
                            }}
                        >
                            <CustomText
                                style={{
                                    fontSize: SIZES.FONT_H5,
                                    textAlign: 'center',
                                    marginBottom: 5
                                }}
                                text={`${ENV} - ${App.STORE_VERSION} (${App.APP_VERSION_OTA})`}
                            />
                            <Text
                                style={{
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H5,
                                    color: COLORS.ACTIVE,
                                }}
                            >
                                Powered by DragonC92Team
                            </Text>
                        </View>
                    </>
                </KeyboardAwareScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10
    },
});
