import {
    CenterLoader
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import UsernamePasswordForm from './UsernamePasswordForm';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function SignUp({ navigation }) {
    // const [step, setStep] = useState(1);
    // const [isEmail, setIsEmail] = useState(false);
    // const [otp, setOtp] = useState('');
    // const [password, setPassword] = useState('');
    // const [username, setUsername] = useState('');

    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);

    // const renderSignUpViewByStep = () => {
    //     switch (step) {
    //         case 1: {
    //             return (
    //                 <UsernameForm
    //                     isEmail={isEmail}
    //                     username={username}
    //                     setUsername={(usernameInput) => setUsername(usernameInput)}
    //                     setModalVisible={(isVisible) => setModalVisible(isVisible)}
    //                     setOtp={(otpCode) => setOtp(otpCode)}
    //                     setIsEmail={(isEmailLogin) => setIsEmail(isEmailLogin)}
    //                     setStep={(stepIndex) => setStep(stepIndex)}
    //                     renderFrom={ScreenName.SIGN_UP}
    //                 />
    //             );
    //         }
    //         case 2: {
    //             return (
    //                 <OtpForm
    //                     navigation={navigation}
    //                     otp={otp}
    //                     password={password}
    //                     username={username}
    //                     setOtp={(otpCode) => setOtp(otpCode)}
    //                     setPassword={(passwordStr) => setPassword(passwordStr)}
    //                     isEmail={isEmail}
    //                     renderFrom={ScreenName.SIGN_UP}
    //                 />
    //             );
    //         }
    //         default: {
    //             return (<></>);
    //         }
    //     }
    // };

    return (
        <>
            <View
                style={styles.container}
            >
                {showLoaderStore ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView>
                        <View
                            style={{
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <View
                                style={styles.stepSessionContainer}
                            >
                                <Text
                                    style={
                                        [
                                            styles.title,
                                            {
                                                color: COLORS.DEFAULT,
                                                fontSize: SIZES.FONT_H1,
                                                marginTop: 125
                                            }
                                        ]
                                    }
                                >
                                    Tạo tài khoản mới
                                </Text>
                            </View>
                            {/* {renderSignUpViewByStep()} */}
                            <UsernamePasswordForm navigation={navigation} />
                        </View>
                    </KeyboardAwareScrollView>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SIZES.WIDTH_BASE,
        height: '100%',
        backgroundColor: COLORS.BASE,
    },
    title: {
        fontFamily: TEXT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: 220,
        alignSelf: 'center',
        alignItems: 'center'
    },
});
