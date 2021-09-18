import {
    CenterLoader, CustomButton
} from '@components/uiComponents';
import {
    DocumentType, ScreenName, Theme, VerificationStatus
} from '@constants/index';
import { MediaHelpers, ToastHelpers } from '@helpers/index';
import { setCurrentUser, setPersonTabActiveIndex, setVerificationStore } from '@redux/Actions';
import { UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

let verificationArray = [];

export default function Verification({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [faceUrl, setFaceUrl] = useState('');
    const [frontUrl, setFrontUrl] = useState('');
    const [backUrl, setBackUrl] = useState('');

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const verificationStore = useSelector((state) => state.userReducer.verificationStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            if (!verificationStore?.verificationDocuments || verificationStore.verificationDocuments.length === 0) {
                fetchVerification();
            } else {
                fillImageFromAPI(verificationStore.verificationDocuments);
            }
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

    const fetchVerification = async () => {
        const result = await UserServices.fetchVerificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setVerificationStore(data.data));
            const listDocUrl = data.data.verificationDocuments;
            fillImageFromAPI(listDocUrl);
        }
    };

    const renderUploadDocForm = (docType, buttonText) => {
        let isDisabled = false;
        if (currentUser.verifyStatus !== VerificationStatus.NONE
            && currentUser.verifyStatus !== VerificationStatus.REJECT) {
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
                        width: SIZES.WIDTH_BASE * 0.9,
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
            {renderUploadDocForm(DocumentType.FACE_IMAGE, 'Ảnh chụp cá nhân')}
            {renderDocImageByType(DocumentType.FACE_IMAGE, faceUrl)}
            <View
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(DocumentType.DRIVER_FRONT, 'Mặt trước CMND/CCCD/bằng xe còn thời hạn')}
                {renderDocImageByType(DocumentType.DRIVER_FRONT, frontUrl)}
            </View>
            <View
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(DocumentType.DRIVER_BACK, 'Mặt sau CMND/CCCD/bằng lái còn thời hạn')}
                {renderDocImageByType(DocumentType.DRIVER_BACK, backUrl)}
            </View>
        </View>
    );

    const fillImageFromAPI = (listDocs) => {
        if (!listDocs || !listDocs.length === 0) return false;

        listDocs.forEach((docItem) => {
            const docImage = docItem.url;
            switch (docItem.type) {
                case DocumentType.FACE_IMAGE: {
                    setFaceUrl(docImage);
                    break;
                }
                case DocumentType.DRIVER_FRONT: {
                    setFrontUrl(docImage);
                    break;
                }
                case DocumentType.DRIVER_BACK: {
                    setBackUrl(docImage);
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
            case DocumentType.DRIVER_FRONT: {
                setFrontUrl(uri);
                break;
            }
            case DocumentType.DRIVER_BACK: {
                setBackUrl(uri);
                break;
            }
            default: {
                break;
            }
        }
    };

    const uploadDoc = (docType, imageLocalUrl) => {
        MediaHelpers.imgbbUploadImage(
            imageLocalUrl,
            (res) => {
                const verifyItem = {
                    url: res.data.url,
                    type: docType
                };

                verificationArray.push(verifyItem);
                if (verificationArray.length === 3) {
                    const result = UserServices.addVerifyDocAsync({ documents: verificationArray });
                    const { data } = result;

                    if (data) {
                        verificationArray = [];
                    }
                }
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    const onGetCurrentUserData = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        if (data) {
            const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
            dispatch(setCurrentUser(currentUserInfo));

            navigation.navigate(ScreenName.PERSONAL);
            dispatch(setPersonTabActiveIndex(0));
        }
    };

    const onSubmitUploadList = () => {
        if (!(backUrl && faceUrl && frontUrl)) {
            ToastHelpers.renderToast('Vui lòng chọn đủ hình ảnh');
            return;
        }

        setIsShowSpinner(true);
        setTimeout(() => {
            navigation.goBack();
            onGetCurrentUserData();
            ToastHelpers.renderToast('Tải lên thành công.', 'success');
        }, 5000);

        uploadDoc(DocumentType.FACE_IMAGE, faceUrl);
        uploadDoc(DocumentType.DRIVER_FRONT, frontUrl);
        uploadDoc(DocumentType.DRIVER_BACK, backUrl);
    };

    const renderButtonPanel = () => {
        if (currentUser.verifyStatus === VerificationStatus.NONE) {
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
                            navigation.goBack();
                        }}
                        type="default"
                        label="Huỷ bỏ"
                    />
                    <CustomButton
                        onPress={() => onSubmitUploadList()}
                        type="active"
                        label="Xác nhận"
                    />
                </View>
            );
        }
        return null;
    };

    const renderDocImageByType = (docType, imageUrl) => {
        if (imageUrl === '') {
            return (
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
                        Chưa có ảnh
                    </Text>
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
                    width={SIZES.WIDTH_BASE * 0.9}
                    source={{ uri: imageUrl }}
                />
            </View>
        );
    };

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center'
                        }}
                    >
                        <View
                            style={{
                                marginTop: 10,
                                backgroundColor: COLORS.BLOCK,
                            }}
                        >
                            {renderDocSection()}
                        </View>
                        {renderButtonPanel()}
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

const styles = StyleSheet.create({
    docFormContainer: {
        marginTop: 30
    }
});
