import {
    Block, Button, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, ImageBackground,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import {
    setCurrentUser,
    setListBank, setListBookingLocation,
    setListNotification, setToken
} from '../redux/Actions';
import { rxUtil } from '../utils';

export default function SignIn(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const dispatch = useDispatch();

    const token = useSelector((state) => state.userReducer.token);
    const listBank = useSelector((state) => state.bankReducer.listBank);
    const listBookingLocation = useSelector(
        (state) => state.locationReducer.listBookingLocation
    );
    const listNotification = useSelector(
        (state) => state.notificationReducer.listNotification
    );

    useEffect(
        () => {
            getMetaData();
        }, [token]
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onChangeUsername = (usernameInput) => {
        setUsername(usernameInput);
    };

    const onChangePassword = (passwordInput) => {
        setPassword(passwordInput);
    };

    const onSubmitLogin = () => {
        if (validation()) {
            const data = {
                username,
                password
            };

            toggleSpinner(true);
            rxUtil(
                Rx.AUTHENTICATION.CUSTOMER_LOGIN,
                'POST',
                data,
                {},
                (res) => {
                    const tokenFromAPI = res.data.data;
                    onLoginSucess(tokenFromAPI);
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
        }
    };

    const validation = () => {
        if (!username) {
            ToastHelpers.renderToast('Tên đăng nhập không hợp lệ!', 'error');
            return false;
        }

        if (!password) {
            ToastHelpers.renderToast('Mật khẩu không hợp lệ!', 'error');
            return false;
        }

        return true;
    };

    const getMetaData = () => {
        getListNotificationAPI();
        getListBookingLocationFromAPI();
        getListBankFromAPI();
    };

    const getListBankFromAPI = () => {
        const headers = {
            Authorization: token
        };

        if (listBank && listBank.length === 0) {
            // get list bank from api, set store
            rxUtil(
                Rx.BANK.SET_LIST_BANK,
                'GET',
                null,
                headers,
                (res) => {
                    dispatch(setListBank(res.data.data));
                },
                () => {},
                () => {}
            );
        }
    };

    const getListBookingLocationFromAPI = () => {
        const headers = {
            Authorization: token
        };

        if (listBookingLocation && listBookingLocation.length === 0) {
            // get list booking location and update store
            rxUtil(
                Rx.BOOKING.GET_LIST_BOOKING_LOCATION,
                'GET',
                null,
                headers,
                (res) => {
                    dispatch(setListBookingLocation(res.data.data));
                    getListBankFromAPI();
                },
                (err) => { console.log('err', err); },
                () => {}
            );
        }
    };

    const getListNotificationAPI = () => {
        if (listNotification && listNotification.length === 0) {
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
                },
                () => {},
                () => {}
            );
        }
    };

    const onGetCurrentUserData = (url, tokenFromAPI) => {
        const {
            navigation
        } = props;
        const headers = {
            Authorization: `Bearer ${tokenFromAPI}`
        };

        rxUtil(url, 'GET', '', headers,
            (res) => {
                dispatch(setCurrentUser(res.data.data));
                getMetaData();
                toggleSpinner(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.APP }],
                });
                Toast.show({
                    type: 'success',
                    text1: 'Đăng nhập thành công!'
                });
            },
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Đăng nhập thất bại! Vui lòng thử lại.'
                });
            },
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Đăng nhập thất bại! Vui lòng thử lại.'
                });
            });
    };

    const onLoginSucess = (tokenFromAPI) => {
        dispatch(setToken(tokenFromAPI));

        onGetCurrentUserData(
            Rx.USER.CURRENT_USER_INFO,
            tokenFromAPI
        );
    };

    const toggleSpinner = (isShowSpinnerToggled) => {
        setIsShowSpinner(isShowSpinnerToggled);
    };

    return (
        <Block flex middle>
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
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                        textAlign: 'center'
                                    }}
                                    color="#333"
                                    size={24}
                                    height={100}
                                >
                                    Đăng nhập
                                </Text>
                            </Block>

                            {isShowSpinner ? (
                                <ActivityIndicator
                                    size="large"
                                    color={NowTheme.COLORS.ACTIVE}
                                />
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
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77,
                                                }}
                                                placeholder="Nhập tên đăng nhập..."
                                                value={username}
                                                onChangeText={
                                                    (usernameInput) => onChangeUsername(usernameInput)
                                                }
                                            />

                                            <Input
                                                placeholder="Nhập mật khẩu..."
                                                style={{
                                                    borderRadius: 5,
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77
                                                }}
                                                password
                                                viewPass
                                                value={password}
                                                onChangeText={
                                                    (passwordInput) => onChangePassword(passwordInput)
                                                }
                                            />
                                        </Block>
                                    </Block>

                                    <Block center>
                                        <Button
                                            onPress={() => onSubmitLogin()}
                                            style={[styles.button, {
                                                marginVertical: 10
                                            }]}
                                            shadowless
                                        >
                                            Đăng nhập
                                        </Button>
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
        width: NowTheme.SIZES.WIDTH_90,
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
