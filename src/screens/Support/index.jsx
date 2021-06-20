/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import {
    CenterLoader,
    CustomButton, CustomInput, IconCustom, NoteText, TopTabBar
} from '@components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '@constants/index';
import { MediaHelpers, ToastHelpers } from '@helpers/index';
import { rxUtil } from '@utils/index';
import React, { useEffect, useState } from 'react';
import {
    Image, StyleSheet, Text, View
} from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { SceneMap } from 'react-native-tab-view';
import { useSelector } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function Support({ navigation }) {
    const [routes] = React.useState([
        { key: 'listFaq', title: 'Câu hỏi\nthường gặp' },
        { key: 'bugReportForm', title: 'Báo lỗi' },
    ]);

    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [listFAQ, setListFAQ] = useState([]);
    const [bugReportForm, setBugReportForm] = useState({
        title: '',
        description: '',
        url: ''
    });
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listImageReview, setListImageReview] = useState([]);
    const [image, setImage] = useState();
    const [visible, setVisible] = useState(false);

    const token = useSelector((state) => state.userReducer.token);
    const pickMeInfoStore = useSelector((state) => state.appConfigReducer.pickMeInfoStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            if (pickMeInfoStore?.faq) {
                setListFAQ(pickMeInfoStore.faq);
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

    const onChangeDescription = (descriptionInput) => {
        setBugReportForm({ ...bugReportForm, description: descriptionInput });
    };

    const onChangeBugTitle = (titleInput) => {
        setBugReportForm({ ...bugReportForm, title: titleInput });
    };

    const onSubmitBugReport = () => {
        setIsShowSpinner(true);
        rxUtil(
            Rx.SYSTEM.CREATE_BUG,
            'POST',
            bugReportForm,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                setBugReportForm({
                    title: '',
                    description: '',
                    url: ''
                });
                setImage();
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const handleOnPickImageReport = (uri) => {
        setIsShowSpinner(true);
        MediaHelpers.uploadImage(
            uri,
            Rx.SYSTEM.UPLOAD_IMAGE_AND_GET_URL,
            token,
            (res) => {
                setIsShowSpinner(false);
                setImage(uri);
                setBugReportForm({ ...bugReportForm, url: res.data.data.url });
            },
            (err) => {
                ToastHelpers.renderToast(
                    err?.data?.message || 'Tải ảnh lên thất bại! Vui lòng thử lại.', 'error'
                );
                setIsShowSpinner(false);
            },
            () => {
                ToastHelpers.renderToast('Tải ảnh lên thất bại! Vui lòng thử lại.', 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const onClickUploadImageReport = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleOnPickImageReport(result.uri));
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const ListFaqRoute = () => (
        <>
            {renderListFAQ()}
        </>
    );

    const BugReportFormRoute = () => (
        <>
            {renderBugReportForm()}
        </>
    );

    const renderScene = SceneMap({
        listFaq: ListFaqRoute,
        bugReportForm: BugReportFormRoute,
    });

    const renderImageReport = () => (
        <TouchableWithoutFeedback
            onPress={() => {
                setVisible(true);
                setListImageReview([{ url: bugReportForm.url }]);
            }}
        >
            {image && (
                <Image
                    style={styles.imageReport}
                    source={{ uri: image }}
                />
            )}
        </TouchableWithoutFeedback>
    );

    const renderImageView = () => {
        const listImageObj = [];

        listImageReview.forEach((item) => {
            listImageObj.push({
                uri: item.url
            });
        });

        if (visible) {
            return (
                <ImageView
                    images={listImageObj}
                    imageIndex={0}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                />
            );
        }
        return <></>;
    };

    const renderButtonPanel = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.9,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
        >
            <CustomButton
                onPress={() => {
                    setBugReportForm({
                        title: '',
                        description: '',
                        url: ''
                    });
                }}
                buttonStyle={styles.button}
                type="default"
                label="Huỷ bỏ"
            />
            <CustomButton
                onPress={() => onSubmitBugReport()}
                buttonStyle={styles.button}
                type="active"
                label="Xác nhận"
            />
        </View>
    );

    const renderListFAQ = () => {
        if (listFAQ && listFAQ.length !== 0) {
            return (
                <FlatList
                    data={listFAQ}
                    keyExtractor={(item) => item.question.toString()}
                    renderItem={({ item }) => (
                        <View
                            key={item.answer}
                            style={{
                                paddingVertical: 10
                            }}
                        >
                            <NoteText
                                width={SIZES.WIDTH_BASE * 0.9}
                                title={`${item.question}?`}
                                content={item.answer || 'N/A'}
                                contentStyle={{
                                    fontSize: SIZES.FONT_H3,
                                    fontFamily: MONTSERRAT_REGULAR,
                                    alignSelf: 'flex-start'
                                }}
                                backgroundColor={COLORS.LIST_ITEM_BACKGROUND_2}
                            />
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            );
        }

        return (
            <View
                style={{
                    alignItems: 'center',
                    marginVertical: 15
                }}
            >
                <Text
                    style={{
                        fontFamily: MONTSERRAT_REGULAR,
                        color: COLORS.DEFAULT,
                        fontSize: SIZES.FONT_H2
                    }}
                >
                    Danh sách trống
                </Text>
            </View>
        );
    };

    const renderUploadImageReportButton = () => (
        <View
            style={{
                paddingVertical: 10
            }}
        >
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                <Text
                    style={{
                        fontFamily: MONTSERRAT_REGULAR,
                        color: COLORS.ACTIVE,
                        fontSize: 16,
                    }}
                >
                    Ảnh chụp màn hình:
                </Text>

                <TouchableWithoutFeedback
                    onPress={() => onClickUploadImageReport()}
                    containerStyle={{
                        justifyContent: 'center',
                        marginLeft: 10
                    }}
                >
                    <IconCustom
                        name="photo-camera"
                        family={IconFamily.MATERIAL_ICONS}
                        color={COLORS.DEFAULT}
                        size={20}
                    />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );

    const renderBugReportForm = () => (
        <>
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                        paddingVertical: 10
                    }}
                >
                    {renderInputBugTitle()}
                    {renderInputBugDescription()}
                    {renderUploadImageReportButton()}
                    {renderImageReport()}
                    {renderButtonPanel()}
                </View>
            )}
        </>
    );

    const renderInputBugTitle = () => (
        <CustomInput
            multiline
            placeholder="Nhập tóm tắt lỗi..."
            value={bugReportForm.title}
            onChangeText={(input) => onChangeBugTitle(input)}
            inputStyle={{
                height: 60
            }}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Tóm tắt lỗi:"
        />
    );

    const renderInputBugDescription = () => (
        <CustomInput
            multiline
            placeholder="Nhập chi tiết lỗi..."
            value={bugReportForm.description}
            onChangeText={(input) => onChangeDescription(input)}
            inputStyle={{
                height: 60
            }}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Chi tiết lỗi:"
        />
    );

    return (
        <>
            {renderImageView()}
            <TopTabBar
                routes={routes}
                renderScene={renderScene}
                tabActiveIndex={tabActiveIndex}
                setTabActiveIndex={setTabActiveIndex}
            />
        </>
    );
}

const styles = StyleSheet.create({
    shadow: {
        backgroundColor: COLORS.BASE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3
    },
    titleBold: {
        fontFamily: MONTSERRAT_BOLD,
        fontSize: SIZES.FONT_H4
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.44,
        margin: 0
    },
    input: {
        borderRadius: 5,
        width: SIZES.WIDTH_BASE * 0.9,
    },
    imageReport: {
        width: SIZES.WIDTH_BASE * 0.25,
        height: SIZES.WIDTH_BASE * 0.25,
        marginBottom: 10
    },
});
