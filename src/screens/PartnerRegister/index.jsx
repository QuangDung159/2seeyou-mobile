import {
    CenterLoader, CustomButton, CustomInput
} from '@components/uiComponents';
import { ScreenName, Theme } from '@constants/index';
import ValidationHelpers from '@helpers/ValidationHelpers';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function PartnerRegister({ navigation }) {
    const [partnerForm, setPartnerForm] = useState({
        earningExpected: '',
        bookingMinimum: ''
    });

    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);

    const validate = () => {
        const validateArr = [
            {
                fieldName: 'Thu nhập mong muốn\n',
                input: partnerForm.earningExpected,
                validate: {
                    required: {
                        value: true,
                    },
                    equalGreaterThan: {
                        value: 1000,
                    },
                }
            },
            {
                fieldName: 'Số phút tối thiểu\n',
                input: partnerForm.bookingMinimum,
                validate: {
                    required: {
                        value: true,
                    },
                    equalGreaterThan: {
                        value: 90,
                    },
                }
            },
        ];

        return ValidationHelpers.validate(validateArr);
    };

    const onSubmitAccountCreation = () => {
        if (!validate()) {
            return;
        }

        navigation.navigate(ScreenName.PERSONAL);
        console.log('partnerForm :>> ', partnerForm);
    };

    const renderFormByStep = () => (
        <>
            <View style={styles.formContainer}>
                <CustomInput
                    value={partnerForm.earningExpected}
                    onChangeText={(input) => setPartnerForm({ ...partnerForm, earningExpected: input })}
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    label="Thu nhập mong muốn (Đồng/phút)"
                />
                <CustomInput
                    value={partnerForm.bookingMinimum}
                    onChangeText={(input) => setPartnerForm({ ...partnerForm, bookingMinimum: input })}
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    label="Số phút tối thiểu"
                />
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <CustomButton
                    onPress={() => onSubmitAccountCreation()}
                    buttonStyle={[styles.button, {
                        width: SIZES.WIDTH_BASE * 0.9
                    }]}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );

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
                                flex: 1,
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
                                                fontSize: 24,
                                                marginTop: SIZES.HEIGHT_BASE * 0.15
                                            }
                                        ]
                                    }
                                >
                                    Trở thành đối tác
                                </Text>
                            </View>
                            {renderFormByStep()}
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
        height: SIZES.HEIGHT_BASE,
        backgroundColor: COLORS.BASE,
    },
    title: {
        fontFamily: TEXT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3,
        alignSelf: 'center',
        alignItems: 'center'
    },
    formContainer: {
        height: SIZES.HEIGHT_BASE * 0.65
    },
    button: {
        marginVertical: 10,
        width: SIZES.WIDTH_BASE * 0.44
    },
});
