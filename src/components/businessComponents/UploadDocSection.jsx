/* eslint-disable max-len */
import {
    CustomButton, CustomModal, CustomText, IconCustom, NoteText, RadioButton
} from '@components/uiComponents';
import DocumentType, { VERIFY_NOTE } from '@constants/DocumentType';
import IconFamily from '@constants/IconFamily';
import ScreenName from '@constants/ScreenName';
import Theme from '@constants/Theme';
import VerificationStatus from '@constants/VerificationStatus';
import MediaHelpers from '@helpers/MediaHelpers';
import ToastHelpers from '@helpers/ToastHelpers';
import { setCurrentUser, setVerificationStore } from '@redux/Actions';
import UserServices from '@services/UserServices';
import React, { useEffect, useState } from 'react';
import {
    Alert, StyleSheet, TouchableOpacity, View
} from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import VerificationStatusPanel from './VerificationStatusPanel';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

let verificationArray = [];

export default function UploadDocSection({ setIsShowSpinner, navigation, route }) {
    const [faceUrl, setFaceUrl] = useState('');
    const [frontUrl, setFrontUrl] = useState('');
    const [backUrl, setBackUrl] = useState('');
    const [greenUrl, setGreenUrl] = useState('');
    const [isForPartnerVerify, setIsForPartnerVerify] = useState(false);
    const [modalInfoVisible, setModalInfoVisible] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const verificationStore = useSelector((state) => state.userReducer.verificationStore);
    // const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);
    const navigateFrom = route?.params?.navigateFrom;

    const dispatch = useDispatch();

    useEffect(
        () => {
            if (navigateFrom && navigateFrom === ScreenName.MENU) {
                setIsForPartnerVerify(true);
            }

            if (!verificationStore?.verificationDocuments || verificationStore.verificationDocuments.length === 0) {
                fetchVerification();
            } else {
                fillImageFromAPI(verificationStore.verificationDocuments);
            }
        }, []
    );

    // useEffect(
    //     () => {
    //         const onFocus = navigation.addListener('focus', () => {
    //             fetchVerification();
    //         });

    //         return onFocus;
    //     }, []
    // );

    const fetchVerification = async () => {
        const result = await UserServices.fetchVerificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setVerificationStore(data.data));
            const listDocUrl = data.data.verificationDocuments;
            fillImageFromAPI(listDocUrl);
        }
    };

    const fillImageFromAPI = (listDocs) => {
        if (!listDocs || !listDocs.length === 0) return false;

        listDocs.forEach((docItem) => {
            const docImage = docItem.url;
            switch (docItem.type) {
                case DocumentType.FACE_IMAGE: {
                    setFaceUrl(docImage);
                    break;
                }
                case DocumentType.ID_CARD_FRONT: {
                    setFrontUrl(docImage);
                    break;
                }
                case DocumentType.ID_CARD_BACK: {
                    setBackUrl(docImage);
                    break;
                }
                case DocumentType.GREEN_CARD: {
                    setGreenUrl(docImage);
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return true;
    };

    const onPickVerificationDoc = (docType) => {
        MediaHelpers.pickImage(
            false,
            [4, 3],
            (result) => {
                handleOnPickVerificationDoc(result.uri, docType);
            },
            0.6
        );
    };

    const handleOnPickVerificationDoc = (uri, docType) => {
        switch (docType) {
            case DocumentType.FACE_IMAGE: {
                setFaceUrl(uri);
                break;
            }
            case DocumentType.ID_CARD_FRONT: {
                setFrontUrl(uri);
                break;
            }
            case DocumentType.ID_CARD_BACK: {
                setBackUrl(uri);
                break;
            }
            case DocumentType.GREEN_CARD: {
                setGreenUrl(uri);
                break;
            }
            default: {
                break;
            }
        }
    };

    const renderUploadDocForm = (docType, buttonText) => {
        let isDisabled = false;
        if (currentUser?.verifyStatus !== VerificationStatus.NONE
            && currentUser?.verifyStatus !== VerificationStatus.REJECT) {
            isDisabled = true;
        }
        return (
            <View style={{
                alignItems: 'center',
            }}
            >
                <CustomButton
                    onPress={() => onPickVerificationDoc(docType)}
                    type="active"
                    label={buttonText}
                    buttonStyle={{
                        width: SIZES.WIDTH_MAIN,
                        marginBottom: 10
                    }}
                    labelStyle={{
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H4
                    }}
                    disabled={isDisabled}
                />
            </View>
        );
    };

    const renderDocSection = () => (
        <View
            style={{
                marginVertical: 10
            }}
        >
            {renderUploadDocForm(DocumentType.FACE_IMAGE, 'Ảnh chụp chính diện')}
            {renderDocImage(faceUrl)}
            <View
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(DocumentType.ID_CARD_FRONT, 'Ảnh chụp nhìn sang phải')}
                {renderDocImage(frontUrl)}
            </View>
            <View
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(DocumentType.ID_CARD_BACK, 'Ảnh chụp mặt trước giấy phép lái xe')}
                {renderDocImage(backUrl)}
            </View>
            <View
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(DocumentType.GREEN_CARD, 'Thẻ xanh COVID')}
                {renderDocImage(greenUrl)}
            </View>
        </View>
    );

    const onSubmitUploadList = () => {
        if (!(backUrl && faceUrl && frontUrl && greenUrl)) {
            ToastHelpers.renderToast('Vui lòng chọn đủ hình ảnh');
            return;
        }

        setIsShowSpinner(true);
        setTimeout(() => {
            navigation.goBack();
            ToastHelpers.renderToast('Tải lên thành công.', 'success');
        }, 7000);

        uploadDoc(DocumentType.FACE_IMAGE, faceUrl);
        uploadDoc(DocumentType.ID_CARD_FRONT, frontUrl);
        uploadDoc(DocumentType.ID_CARD_BACK, backUrl);
        uploadDoc(DocumentType.GREEN_CARD, greenUrl);
    };

    const fetchCurrentUserInfo = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        if (data) {
            const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
            dispatch(setCurrentUser(currentUserInfo));
        }
    };

    const submitVerification = async (listDocUrl) => {
        const body = {
            verifyNote: isForPartnerVerify ? VERIFY_NOTE.FOR_PARTNER : VERIFY_NOTE.FOR_CUSTOMER,
            documents: listDocUrl,
            isApplyForPartner: isForPartnerVerify
        };

        setIsShowSpinner(true);
        const result = await UserServices.addVerifyDocAsync(body);
        setIsShowSpinner(false);

        const { data } = result;

        if (data) {
            verificationArray = [];
            fetchCurrentUserInfo();
            fetchVerification();
        }
    };

    const uploadDoc = (docType, imageLocalUrl) => {
        MediaHelpers.imgbbUploadImage(
            imageLocalUrl,
            async (res) => {
                const verifyItem = {
                    url: res.data.url,
                    type: docType
                };

                verificationArray.push(verifyItem);
                if (verificationArray.length === 4) {
                    submitVerification(verificationArray);
                }
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    const renderButtonPanel = () => {
        if (currentUser?.verifyStatus === VerificationStatus.NONE) {
            return (
                <View
                    style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <CustomButton
                        onPress={() => onSubmitUploadList()}
                        type="active"
                        label="Xác nhận"
                        buttonStyle={{
                            width: SIZES.WIDTH_MAIN
                        }}
                    />
                </View>
            );
        }

        if (!verificationStore.isApplyForPartner) {
            return (
                <View
                    style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <CustomButton
                        onPress={() => {
                            if (currentUser.isCustomerVerified) {
                                submitVerification(verificationStore.verificationDocuments);
                            } else {
                                Alert.alert(
                                    '', 'Vui lòng đợi quá trình xác thực tài khoản khách hàng hoàn thành.'
                                );
                            }
                        }}
                        type="active"
                        label="Xác nhận trở thành Host"
                        buttonStyle={{
                            width: SIZES.WIDTH_MAIN
                        }}
                    />
                </View>
            );
        }

        return null;
    };

    const renderDocImage = (imageUrl) => {
        if (imageUrl === '') {
            return (
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <CustomText text="Chưa có ảnh" />
                </View>
            );
        }

        return (
            <View
                style={{
                    alignSelf: 'center'
                }}
            >
                <ImageScalable
                    style={{
                        zIndex: 99
                    }}
                    width={SIZES.WIDTH_MAIN}
                    source={{ uri: imageUrl }}
                />
            </View>
        );
    };

    const renderInfoModal = () => (
        <CustomModal
            modalVisible={modalInfoVisible}
            renderContent={() => (
                <>
                    <CustomText
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            color: COLORS.DEFAULT,
                        }}
                        text='Nếu bạn chọn "Xác thực khách hàng", bạn sẽ có đầy đủ các tính năng khách hàng của 2SeeYou như nhắn tin, đặt hẹn,...'
                    />
                    <CustomText
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            color: COLORS.DEFAULT,
                        }}
                        text='Nếu bạn chọn "Đăng ký Host", bạn sẽ có đầy đủ các tính năng khách hàng của 2SeeYou như nhắn tin, đặt hẹn,..., và các chức năng của Host như nhận đơn hẹn, thêm thu nhập,...'
                    />

                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            marginVertical: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CustomButton
                            onPress={() => setModalInfoVisible(false)}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                            type="default"
                            label="Tôi đã hiểu"
                        />
                    </View>
                </>
            )}
        />
    );

    try {
        return (
            <View
                style={{
                    marginTop: 10
                }}
            >
                {renderInfoModal()}

                {navigateFrom === ScreenName.MENU && currentUser.isCustomerVerified && (
                    <NoteText
                        width={SIZES.WIDTH_MAIN}
                        title="Đăng ký trở thành Host:"
                        content="Trở thành Host để gia tăng thu nhập"
                        contentStyle={{
                            fontSize: SIZES.FONT_H4,
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_REGULAR,
                            marginTop: 5,
                        }}
                        iconComponent={(
                            <IconCustom
                                name="info-circle"
                                family={IconFamily.FONT_AWESOME}
                                size={18}
                                color={COLORS.ACTIVE}
                            />
                        )}
                    />
                )}

                {(verificationStore.verifyStatus === VerificationStatus.NONE || verificationStore.verifyStatus === VerificationStatus.REJECT) ? (
                    <>
                        {!currentUser.isCustomerVerified && (
                            <>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        marginBottom: 5
                                    }}
                                    onPress={() => setModalInfoVisible(true)}
                                >
                                    <CustomText
                                        text="Chọn mục đích: "
                                        style={{
                                            fontFamily: TEXT_BOLD
                                        }}
                                    />
                                    <IconCustom
                                        name="info-circle"
                                        family={IconFamily.FONT_AWESOME}
                                        size={14}
                                        color={COLORS.ACTIVE}
                                    />
                                </TouchableOpacity>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <RadioButton
                                        label="Xác thực khách hàng"
                                        selected={!isForPartnerVerify}
                                        onPress={() => setIsForPartnerVerify(false)}
                                        labelStyle={{
                                            fontSize: SIZES.FONT_H3
                                        }}
                                    />
                                    <RadioButton
                                        label="Đăng ký Host"
                                        selected={isForPartnerVerify}
                                        onPress={() => setIsForPartnerVerify(true)}
                                        labelStyle={{
                                            fontSize: SIZES.FONT_H3
                                        }}
                                    />
                                </View>
                            </>
                        )}
                    </>
                ) : (
                    <VerificationStatusPanel />
                )}

                <View
                    style={{
                        marginTop: 10,
                        backgroundColor: COLORS.BASE,
                    }}
                >
                    {renderDocSection()}
                </View>
                {renderButtonPanel()}
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

const styles = StyleSheet.create({
    docFormContainer: {
        marginTop: 30
    }
});
