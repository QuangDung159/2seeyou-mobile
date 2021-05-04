import * as SecureStore from 'expo-secure-store';
import {
    Block, Button
} from 'galio-framework';
import React, { useState } from 'react';
import {
    ImageBackground,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { ExpoNotification } from '../components/bussinessComponents';
import {
    CenterLoader, IconCustom, Input, NoteText
} from '../components/uiComponents';
import {
    IconFamily,
    Images, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import {
    setIsSignInOtherDeviceStore,
    setToken
} from '../redux/Actions';
import { rxUtil } from '../utils';

export default function SignInWithOTP({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [otp, setOtp] = useState('');

    const expoToken = useSelector((state) => state.appConfigReducer.expoToken);

    const dispatch = useDispatch();

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const updateExpoTokenToServer = (bearerToken) => {
        rxUtil(
            Rx.USER.UPDATE_EXPO_TOKEN,
            'POST',
            {
                token: expoToken
            },
            {
                Authorization: bearerToken,
            }
        );
    };

    const onSubmitLogin = async () => {
        setIsShowSpinner(true);
        const deviceId = await SecureStore.getItemAsync('deviceId');
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        const password = await SecureStore.getItemAsync('password');

        const data = {
            username: phoneNumber,
            password,
            deviceId
        };

        toggleSpinner(true);
        rxUtil(
            Rx.AUTHENTICATION.LOGIN,
            'POST',
            data,
            null,
            (res) => {
                onLoginSucess(res.data.data);
            },
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                });
            },
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                });
            }
        );
        return true;
    };

    const onClickGetOTP = async () => {
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        const password = await SecureStore.getItemAsync('password');

        rxUtil(
            Rx.USER.GET_OTP_REGISTER,
            'POST',
            {
                phoneNum: phoneNumber,
                password
            },
            null,
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');

                // in testing, will remove when prod
                setOtp(res.data.data.code);
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
        return true;
    };

    const onLoginSucess = (tokenFromAPI) => {
        const bearerToken = `Bearer ${tokenFromAPI}`;
        dispatch(setToken(tokenFromAPI));

        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.APP }],
        });

        updateExpoTokenToServer(bearerToken);
        SecureStore.setItemAsync('api_token', `${tokenFromAPI}`)
            .then(console.log('tokenFromAPI :>> ', tokenFromAPI));

        dispatch(setIsSignInOtherDeviceStore(false));
    };

    const toggleSpinner = (isShowSpinnerToggled) => {
        setIsShowSpinner(isShowSpinnerToggled);
    };

    return (
        <Block flex middle>
            <ExpoNotification navigation={navigation} />
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
                <KeyboardAwareScrollView>
                    <Block flex middle>
                        <Block style={styles.registerContainer}>
                            <Block
                                middle
                                style={{
                                    height: NowTheme.SIZES.HEIGHT_BASE * 0.3,
                                    marginBottom: 10
                                }}
                            >
                                <Block>
                                    <NoteText
                                        width={NowTheme.SIZES.WIDTH_BASE * 0.77}
                                        title="Dường như bạn đang đăng nhập từ một thiết bị khác:"
                                        content="Bạn vui lòng đăng nhập lại để xác thực thiết bị này."
                                        contentStyle={{
                                            fontSize: NowTheme.SIZES.FONT_H4,
                                            color: NowTheme.COLORS.ACTIVE,
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                            marginTop: 5
                                        }}
                                        iconComponent={(
                                            <IconCustom
                                                name="info-circle"
                                                family={IconFamily.FONT_AWESOME}
                                                size={18}
                                                color={NowTheme.COLORS.ACTIVE}
                                            />
                                        )}
                                        backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_1}
                                    />
                                </Block>
                            </Block>

                            {isShowSpinner ? (
                                <CenterLoader />
                            ) : (
                                <>
                                    <Block style={{
                                        height: NowTheme.SIZES.HEIGHT_BASE * 0.3
                                    }}
                                    >
                                        <Block
                                            style={{
                                                marginBottom: 10,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Input
                                                style={{
                                                    borderRadius: 5,
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77
                                                }}
                                                keyboardType="number-pad"
                                                value={otp}
                                                placeholder="Nhập mã xác thực..."
                                                onChangeText={(otpInput) => setOtp(otpInput)}
                                            />
                                        </Block>
                                    </Block>

                                    <Block center>
                                        {otp === '' ? (
                                            <Button
                                                onPress={() => onClickGetOTP()}
                                                style={[styles.button, {
                                                    marginVertical: 10
                                                }]}
                                                shadowless
                                            >
                                                Nhận mã xác thực
                                            </Button>
                                        ) : (
                                            <Button
                                                onPress={() => onSubmitLogin()}
                                                style={[styles.button, {
                                                    marginVertical: 10
                                                }]}
                                                shadowless
                                            >
                                                Đăng nhập
                                            </Button>
                                        )}
                                    </Block>
                                </>
                            )}
                        </Block>
                    </Block>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </Block>
    );
}

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    imageBackground: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE
    },
    registerContainer: {
        marginTop: 55,
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
        height: NowTheme.SIZES.HEIGHT_BASE < 812 ? NowTheme.SIZES.HEIGHT_BASE * 0.8 : NowTheme.SIZES.HEIGHT_BASE * 0.8,
        backgroundColor: NowTheme.COLORS.BASE,
        borderRadius: 4,
        shadowColor: NowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: 'hidden'
    },
    button: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.77
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
    }
});