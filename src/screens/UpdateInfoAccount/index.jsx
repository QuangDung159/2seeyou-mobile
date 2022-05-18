/* eslint-disable no-unused-vars */
import { LocationModal } from '@components/businessComponents';
import {
    CenterLoader, CustomButton, CustomCheckbox, CustomInput, CustomModal, CustomText, Line, OptionItem, TouchableText
} from '@components/uiComponents';
import { LOCATION } from '@constants/Common';
import { HOST_CONTENT } from '@constants/HostContent';
import { Interests, ScreenName, Theme } from '@constants/index';
import { getLocationIndexByName } from '@helpers/CommonHelpers';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import MediaHelpers from '@helpers/MediaHelpers';
import ValidationHelpers from '@helpers/ValidationHelpers';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { UserServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';

const { SIZES, COLORS, FONT: { TEXT_BOLD, TEXT_REGULAR } } = Theme;

export default function UpdateInfoAccount({ navigation }) {
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    // const [listInterest, setListInterest] = useState();
    const [listInterestSelected, setListInterestSelected] = useState(Interests);
    const [isModalInviteCoffeeVisible, setModalInviteCoffeeVisible] = useState(false);
    const [isAcceptInviteCoffeeVisible, setAcceptInviteCoffeeVisible] = useState(currentUser.isHost);
    const [imagePath, setImagePath] = useState(currentUser.imageUrl);
    const [amountDisplay, setAmountDisplay] = useState('');
    const [modalLocationVisible, setModalLocationVisible] = useState(false);
    const [hometownSelectedIndex, setHometownSelectedIndex] = useState(0);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser({ ...currentUser, isMale: currentUser.isMale });
            setAmountDisplay(CommonHelpers.formatCurrency(currentUser.earningExpected));
            handleListInterestFromAPI();

            const locationIndex = getLocationIndexByName(currentUser.homeTown);
            if (locationIndex !== -1) {
                setHometownSelectedIndex(locationIndex);
            } else {
                setHometownSelectedIndex(1);
            }
        }, []
    );

    const onChangeName = (nameInput) => {
        setNewUser({ ...newUser, fullName: nameInput });
    };

    const onChangeHometown = (hometownInput) => {
        setNewUser({ ...newUser, homeTown: hometownInput });
    };

    const onChangeMinimumDuration = (durationInput) => {
        setNewUser({ ...newUser, minimumDuration: durationInput });
    };

    const onChangeEarningExpected = (input) => {
        setNewUser({ ...newUser, earningExpected: input });
        setAmountDisplay(input);
    };

    // const onChangeInterests = (interestsInput) => {
    //     setNewUser({ ...newUser, interests: interestsInput });
    // };

    const onChangeDescription = (descriptionInput) => {
        setNewUser({ ...newUser, description: descriptionInput });
    };

    const createInterestStr = () => {
        let interestStr = '';

        listInterestSelected.forEach((item) => {
            if (item.selected) {
                interestStr += `${item.value}, `;
            }
        });

        return interestStr;
    };

    const renderInputName = () => (
        <CustomInput
            value={newUser.fullName}
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.62 }}
            onChangeText={(input) => onChangeName(input)}
            containerStyle={{
                width: SIZES.WIDTH_MAIN,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
            label="Tên hiển thị:"
            maxLength={35}
        />
    );

    const renderInputPhone = () => (
        <CustomInput
            value={newUser.phoneNum}
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.62 }}
            onChangeText={(input) => setNewUser({ ...newUser, phoneNum: input })}
            containerStyle={{
                width: SIZES.WIDTH_MAIN,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
            keyboardType="number-pad"
            label="Số điện thoại:"
            maxLength={12}
        />
    );

    const renderInputHometown = () => (
        <CustomInput
            value={newUser.homeTown}
            onChangeText={(input) => onChangeHometown(input)}
            containerStyle={{
                width: SIZES.WIDTH_MAIN,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.62 }}
            label="Nơi ở hiện tại:"
            maxLength={35}
        />
    );

    const renderHometownButton = () => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: SIZES.WIDTH_MAIN,
                marginTop: 10
            }}
        >
            <CustomText
                text="Nơi ở hiện tại:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                }}
            />
            <CustomButton
                onPress={() => {
                    setModalLocationVisible(true);
                }}
                type="active"
                label={LOCATION[hometownSelectedIndex]?.value}
                buttonStyle={{
                    backgroundColor: COLORS.BASE,
                    borderColor: COLORS.ACTIVE,
                    width: SIZES.WIDTH_BASE * 0.62
                }}
                labelStyle={{
                    color: COLORS.DEFAULT
                }}
            />
        </View>
    );

    // const renderInputInterests = () => (
    //     <CustomInput
    //         value={newUser.interests}
    //         onChangeText={(input) => onChangeInterests(input)}
    //         containerStyle={{
    //             marginVertical: 10,
    //             width: SIZES.WIDTH_90
    //         }}
    //         label="Sở thích:"
    //     />
    // );

    const handlePressInterest = (index) => {
        const list = [...listInterestSelected];
        list[index].selected = !list[index].selected;
        setListInterestSelected(list);
    };

    const handleListInterestFromAPI = () => {
        const list = currentUser?.interests ? currentUser.interests.split(', ') : [];

        if (list.length === 0) {
            return;
        }

        // list.splice(list.length - 1, 1);
        const listResult = [...listInterestSelected];

        list.forEach((itemFromAPI) => {
            listResult.forEach((item, index) => {
                if (itemFromAPI === item.value) {
                    listResult[index].selected = true;
                }
            });
        });

        setListInterestSelected(listResult);
    };

    const renderOptionInterests = () => (
        <View
            style={{
                alignItems: 'flex-start',
                width: SIZES.WIDTH_MAIN,
                marginTop: 10
            }}
        >
            <CustomText
                text="Sở thích:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                    marginBottom: 3,
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    flexWrap: 'wrap'
                }}
            >
                {listInterestSelected.map((item, index) => (
                    <OptionItem
                        key={item.value}
                        item={item}
                        index={index}
                        handlePressItem={() => {
                            handlePressInterest(index);
                        }}
                        isSelected={item.selected}
                        containerStyle={{
                            marginBottom: 5
                        }}
                    />
                ))}
            </View>
        </View>
    );

    const renderInputDescription = () => (
        <CustomInput
            multiline
            value={newUser.description}
            onChangeText={(input) => onChangeDescription(input)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_MAIN,
            }}
            inputStyle={{
                height: 60
            }}
            label="Mô tả ngắn:"
            maxLength={100}
        />
    );

    const renderInputHeight = () => (
        <CustomInput
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.62 }}
            label="Chiều cao (cm):"
            onChangeText={(input) => setNewUser({ ...newUser, height: input })}
            value={newUser.height}
            keyboardType="number-pad"
            maxLength={3}
            containerStyle={{
                width: SIZES.WIDTH_MAIN,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
        />
    );

    const renderInputWeight = () => (
        <CustomInput
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.62 }}
            label="Cân nặng (kg):"
            onChangeText={(input) => setNewUser({ ...newUser, weight: input })}
            value={newUser.weight}
            keyboardType="number-pad"
            maxLength={3}
            containerStyle={{
                width: SIZES.WIDTH_MAIN,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
        />
    );

    const renderEarningExpected = () => (
        <CustomInput
            containerStyle={{
                marginTop: 10,
                width: SIZES.WIDTH_MAIN
            }}
            onChangeText={(input) => onChangeEarningExpected(input)}
            value={amountDisplay}
            label="Thu nhập mong muốn (Xu/phút):"
            keyboardType="number-pad"
            onEndEditing={
                (e) => {
                    setAmountDisplay(CommonHelpers.formatCurrency(e.nativeEvent.text));
                }
            }
            onFocus={() => {
                setAmountDisplay(newUser.earningExpected);
            }}
        />
    );

    const renderInputMinimumDuration = () => (
        <CustomInput
            value={newUser.minimumDuration}
            onChangeText={(minimumDuration) => onChangeMinimumDuration(minimumDuration)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_MAIN
            }}
            keyboardType="number-pad"
            label="Số phút tối thiểu của buổi hẹn:"
        />
    );

    const renderInputHeightWeight = () => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
                width: '95%'
            }}
        >
            <View>
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        marginBottom: 5
                    }}
                    text="Chiều cao:"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.46
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, height: input })}
                    value={newUser.height}
                    keyboardType="number-pad"
                    maxLength={3}
                />
            </View>

            <View>
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        marginBottom: 5
                    }}
                    text="Cân nặng:"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.46
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, weight: input })}
                    value={newUser.weight}
                    keyboardType="number-pad"
                    maxLength={3}
                />
            </View>
        </View>
    );

    const renderDOB = () => (
        <CustomInput
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.62 }}
            containerStyle={{
                width: SIZES.WIDTH_MAIN,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10
            }}
            onChangeText={(input) => onChangeYear(input)}
            value={newUser?.dob?.substr(0, 4)}
            label="Năm Sinh:"
            keyboardType="number-pad"
            maxLength={4}
        />
    );

    const renderGender = () => (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: SIZES.WIDTH_MAIN,
            marginTop: 10,
        }}
        >
            <CustomText
                style={{
                    color: COLORS.ACTIVE,
                }}
                text="Giới tính:"
            />
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.62,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <OptionItem
                    item={{ value: 'Nam' }}
                    index={0}
                    handlePressItem={() => setNewUser({ ...newUser, isMale: true })}
                    isSelected={newUser.isMale}
                    containerStyle={{
                        width: '49%',
                        marginBottom: 0
                    }}
                    titleStyle={{
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                />
                <OptionItem
                    item={{ value: 'Nữ' }}
                    index={1}
                    handlePressItem={() => setNewUser({ ...newUser, isMale: false })}
                    isSelected={!newUser.isMale}
                    containerStyle={{
                        width: '49%',
                        marginRight: 0,
                        marginBottom: 0
                    }}
                    titleStyle={{
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                />
            </View>
        </View>
    );

    // const renderDobGender = () => (
    //     <View>
    //         <CustomInput
    //             inputStyle={{
    //                 width: SIZES.WIDTH_BASE * 0.46
    //             }}
    //             containerStyle={{
    //                 width: SIZES.WIDTH_MAIN,
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-between',
    //                 alignItems: 'center'
    //             }}
    //             onChangeText={(input) => onChangeYear(input)}
    //             value={newUser?.dob?.substr(0, 4)}
    //             label="Năm Sinh:"
    //             keyboardType="number-pad"
    //         />

    //         <View style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             width: SIZES.WIDTH_MAIN,
    //             marginTop: 10
    //         }}
    //         >

    //             <OptionItem
    //                 item={{ value: 'Nam' }}
    //                 index={0}
    //                 handlePressItem={() => setNewUser({ ...newUser, isMale: true })}
    //                 isSelected={newUser.isMale}
    //                 containerStyle={{
    //                     width: SIZES.WIDTH_BASE * 0.46
    //                 }}
    //                 titleStyle={{
    //                     fontFamily: TEXT_BOLD,
    //                     textAlign: 'center'
    //                 }}
    //             />
    //             <OptionItem
    //                 item={{ value: 'Nữ' }}
    //                 index={1}
    //                 handlePressItem={() => setNewUser({ ...newUser, isMale: false })}
    //                 isSelected={!newUser.isMale}
    //                 containerStyle={{
    //                     width: SIZES.WIDTH_BASE * 0.46,
    //                     marginRight: 0
    //                 }}
    //                 titleStyle={{
    //                     fontFamily: TEXT_BOLD,
    //                     textAlign: 'center'
    //                 }}
    //             />
    //         </View>
    //     </View>
    // );

    const onChangeYear = (yearInput) => {
        setNewUser({ ...newUser, dob: yearInput });
    };

    const renderButtonPanel = () => (
        <View
            style={{
                paddingBottom: 20,
            }}
        >
            <CustomButton
                onPress={() => onSubmitUpdateInfo()}
                type="active"
                label="Xác nhận"
                buttonStyle={{
                    width: SIZES.WIDTH_MAIN
                }}
            />
        </View>
    );

    const validate = () => {
        let validateArr = [
            {
                fieldName: 'Tên hiển thị',
                input: newUser.fullName,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Số điện thoại',
                input: newUser.phoneNum,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 12,
                    },
                }
            },
            {
                fieldName: 'Năm sinh',
                input: newUser.dob.length > 0 ? newUser.dob.substr(0, 4) : newUser.dob,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 4,
                    },
                    minLength: {
                        value: 4
                    }
                }
            },
            {
                fieldName: 'Chiều cao',
                input: newUser.height,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Cân nặng',
                input: newUser.weight,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Sở thích',
                input: createInterestStr(),
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            // {
            //     fieldName: 'Nơi ở',
            //     input: newUser.homeTown,
            //     validate: {
            //         required: {
            //             value: true,
            //         },
            //         maxLength: {
            //             value: 255,
            //         },
            //     }
            // },
            {
                fieldName: 'Mô tả bản thân\n',
                input: newUser.description,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
        ];

        if (isAcceptInviteCoffeeVisible) {
            validateArr = validateArr.concat([
                {
                    fieldName: 'Thu nhập mong muốn',
                    input: newUser.earningExpected,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 600
                        }
                    }
                },
                {
                    fieldName: 'Số phút tối thiểu của buổi hẹn',
                    input: newUser.minimumDuration,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 90
                        }
                    }
                }
            ]);
        }

        if (!validateYearsOld(newUser.dob)) {
            ToastHelpers.renderToast('Bạn phải đủ 16 tuổi!', 'error');
            return false;
        }

        return ValidationHelpers.validate(validateArr);
    };

    const onChooseImage = () => {
        MediaHelpers.pickImage(
            false,
            [4, 3],
            (result) => {
                setImagePath(result.uri);
            },
            0.6
        );
    };

    // eslint-disable-next-line no-unused-vars
    const hostRegisterSection = () => (
        <View
            style={{
                paddingBottom: 10,
                paddingTop: 5
            }}
        >
            <CustomCheckbox
                label="Tôi muốn trở thành Host"
                labelStyle={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3
                }}
                onPressLabel={() => {
                    setModalInviteCoffeeVisible(true);
                }}
                isChecked={isAcceptInviteCoffeeVisible}
                onChange={() => {
                    if (!isAcceptInviteCoffeeVisible) {
                        setModalInviteCoffeeVisible(true);
                    }
                    setAcceptInviteCoffeeVisible(!isAcceptInviteCoffeeVisible);
                }}
                containerStyle={{
                }}
            />

            {renderHostInfoForm()}
        </View>
    );

    const renderImagePicker = () => (
        <>
            <CustomButton
                onPress={() => onChooseImage()}
                type="active"
                label="Chọn ảnh"
                buttonStyle={{
                    width: SIZES.WIDTH_MAIN,
                }}
            />
            <View
                style={{
                    marginTop: 10,
                    alignSelf: 'center'
                }}
            >
                {imagePath ? (
                    <ImageScalable
                        style={{
                            zIndex: 99
                        }}
                        width={SIZES.WIDTH_MAIN}
                        source={{ uri: imagePath }}
                    />
                ) : (
                    <View
                        style={{
                            alignItems: 'center',
                            marginVertical: 5
                        }}
                    >
                        <CustomText text="Chưa có ảnh" />
                    </View>
                )}
            </View>
        </>
    );

    const renderHostInfoForm = () => (
        isAcceptInviteCoffeeVisible
            && (
                <>
                    {currentUser?.isPartnerVerified ? (
                        <View
                            style={{
                                alignSelf: 'center'
                            }}
                        >
                            {/* {renderImagePicker()} */}
                            {renderEarningExpected()}
                            {renderInputMinimumDuration()}
                        </View>
                    ) : (
                        <TouchableText
                            style={{
                                fontSize: SIZES.FONT_H5,
                                marginTop: 10,
                                textAlign: 'center',
                                width: SIZES.WIDTH_MAIN,
                            }}
                            // eslint-disable-next-line max-len
                            text="Tài khoản của bạn chưa được xác thực, vui lòng nhấn vào đây để tiến hành xác thực tài khoản"
                            onPress={() => {
                                navigation.navigate(ScreenName.VERIFICATION, {
                                    navigateFrom: ScreenName.MENU
                                });
                            }}
                        />
                    )}
                </>
            )
    );

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const uploadImage = (callback) => {
        MediaHelpers.imgbbUploadImage(
            imagePath,
            async (res) => callback(res),
        );
    };

    const submitPartnerData = async () => {
        const result = await UserServices.submitUpdatePartnerInfoAsync({
            ...newUser,
            minimumDuration: +newUser.minimumDuration,
            earningExpected: +newUser.earningExpected,
        });

        const { data } = result;

        if (!data) {
            ToastHelpers.renderToast('Cập nhật thông tin thất bại. Vui lòng thử lại sau ít phút.', 'error');
        }
    };

    const submitUpdateInfo = async (url) => {
        const body = {
            ...newUser,
            email: currentUser.userName,
            IsMale: newUser.isMale,
            interests: createInterestStr(),
            isHost: isAcceptInviteCoffeeVisible,
            imageUrl: url,
            minimumDuration: +newUser.minimumDuration,
            earningExpected: +newUser.earningExpected,
            homeTown: LOCATION[hometownSelectedIndex].value
        };

        if (currentUser?.isPartnerVerified) {
            submitPartnerData();
        }

        const result = await UserServices.submitUpdateInfoAsync(body);
        const { data } = result;

        if (data) {
            dispatch(
                setCurrentUser({
                    ...data.data,
                    earningExpected: +newUser.earningExpected,
                    minimumDuration: +newUser.minimumDuration
                })
            );
            dispatch(setPersonTabActiveIndex(0));
            setNewUser(data.data);
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    const onSubmitUpdateInfo = async () => {
        if (!validate()) {
            return;
        }

        setIsShowSpinner(true);
        uploadImage((image) => submitUpdateInfo(image.data.url));
    };

    const renderModalInviteCoffee = () => (
        <CustomModal
            modalVisible={isModalInviteCoffeeVisible}
            renderContent={() => (
                <View
                    style={{
                        width: SIZES.WIDTH_MAIN
                    }}
                >
                    <CustomText
                        text="Lưu ý"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <Text style={{
                        fontSize: SIZES.FONT_H4,
                        marginLeft: 10,
                        marginRight: 10,
                        fontFamily: TEXT_REGULAR,
                        color: COLORS.DEFAULT
                    }}
                    >
                        {HOST_CONTENT}
                    </Text>

                    <View>
                        <CustomButton
                            onPress={() => {
                                setModalInviteCoffeeVisible(false);
                                setAcceptInviteCoffeeVisible(true);
                            }}
                            buttonStyle={{ width: SIZES.WIDTH_BASE * 0.8 }}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

    try {
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
                            width: SIZES.WIDTH_BASE,
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        {newUser && (
                            <>
                                {renderInputName()}
                                {renderInputPhone()}
                                {/* {renderInputHometown()} */}
                                {renderHometownButton()}
                                {renderInputHeight()}
                                {renderInputWeight()}
                                {/* {renderInputHeightWeight()} */}
                                {renderGender()}
                                {renderDOB()}
                                {/* {renderDobGender()} */}
                                {/* {renderInputInterests()} */}
                                {renderOptionInterests()}
                                {renderInputDescription()}
                                <Line />
                                {hostRegisterSection()}
                                {renderButtonPanel()}
                            </>
                        )}
                        {renderModalInviteCoffee()}
                        <LocationModal
                            modalLocationVisible={modalLocationVisible}
                            setModalLocationVisible={setModalLocationVisible}
                            hometownSelectedIndex={hometownSelectedIndex}
                            setHometownSelectedIndex={setHometownSelectedIndex}
                        />
                    </KeyboardAwareScrollView>
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
