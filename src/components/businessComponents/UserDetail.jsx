/* eslint-disable max-len */
import { Albums, AvatarPanel, ModalReport } from '@components/businessComponents';
import {
    CustomButton, IconCustom, Separator
} from '@components/uiComponents';
import {
    IconFamily, Rx, ScreenName, Theme
} from '@constants/index';
import { checkIsFillDataForTheFirstTime, correctFullNameDisplay } from '@helpers/CommonHelpers';
import { CommonHelpers, MediaHelpers, ToastHelpers } from '@helpers/index';
import { setCurrentUser } from '@redux/Actions';
import { UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl,
    ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useDispatch, useSelector } from 'react-redux';
import PartnerDataSection from './PartnerDataSection';
import ProfileInfoItem from './ProfileInfoItem';
import SubInfoProfile from './SubInfoProfile';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function UserDetail({ navigation, userInfo, setIsShowSpinner }) {
    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageReview, setListImageReview] = useState([]);
    const [listImageDisplay, setListImageDisplay] = useState([]);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [modalReasonVisible, setModalReasonVisible] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            createListImageDisplay();

            if (userInfo.id === currentUser.id) {
                setIsCurrentUser(true);
            }
        }, [userInfo]
    );

    useEffect(
        () => {
            const onFocus = navigation.addListener('focus', () => {
                if (userInfo.id === currentUser.id) {
                    setIsCurrentUser(true);
                    checkIsFillDataForTheFirstTime(currentUser, navigation);
                }
            });

            return onFocus;
        }, []
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const fetchCurrentUserInfo = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        if (data) {
            const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
            dispatch(setCurrentUser(currentUserInfo));
        }
        setIsShowSpinner(false);
        setRefreshing(false);
    };

    const createListImageDisplay = () => {
        const { posts } = userInfo;
        const listImage = [];

        if (!posts || posts.length === 0) return;

        posts.forEach((post) => {
            listImage.push({
                uri: post.url,
                id: post.id
            });
        });

        setListImageDisplay(listImage);
        setListImageReview(listImage);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCurrentUserInfo();
    };

    const handleOnPickAvatar = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.imgbbUploadImage(
            uri,
            (res) => {
                setIsShowSpinner(false);
                setImage(uri);

                const newUserInfo = { ...userInfo, url: res.data.url, dob: userInfo?.dob?.substring(0, 4) || '1996' };
                dispatch(
                    setCurrentUser(newUserInfo)
                );
                onSubmitUpdateInfo(newUserInfo);
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    const onSubmitUpdateInfo = async (body) => {
        setIsShowSpinner(true);

        const result = await UserServices.submitUpdateInfoAsync(body);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    const onClickUpdateAvatar = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleOnPickAvatar(result.uri));
    };

    const onClickUploadProfileImage = () => {
        MediaHelpers.pickImage(false, [1, 1], (result) => handleUploadImageProfile(result.uri));
    };

    const onLongPressImage = (imageObj) => {
        Alert.alert(
            'Ảnh của bạn',
            '',
            [
                { text: 'Xoá ảnh', onPress: () => removeImage(imageObj) },
                {
                    text: 'Đóng',
                    style: 'cancel'
                },
                // { text: 'Đặt làm ảnh chính', onPress: () => setImageToPrimary(imageObj.uri) },
            ],
            { cancelable: true }
        );
    };

    // eslint-disable-next-line no-unused-vars
    const setImageToPrimary = async (imageUri) => {
        setIsShowSpinner(true);
        const newUser = { ...userInfo };
        newUser.imageUrl = imageUri;

        const result = await UserServices.submitUpdateInfoAsync(newUser);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
            fetchCurrentUserInfo();
        }
        setIsShowSpinner(false);
    };

    const removeImage = (imageObj) => {
        if (imageObj.uri === userInfo.imageUrl) {
            ToastHelpers.renderToast('Không thể xoá ảnh chính');
        } else {
            setIsShowSpinner(true);
            MediaHelpers.removeImage(
                `${Rx.USER.REMOVE_USER_IMAGE}/${imageObj.id}`,
                (res) => {
                    ToastHelpers.renderToast(
                        res?.data?.message || 'Xoá ảnh thành công!', 'success'
                    );

                    fetchCurrentUserInfo();
                },
                (err) => {
                    ToastHelpers.renderToast(
                        err?.data?.message || 'Xoá ảnh thất bại! Vui lòng thử lại.', 'error'
                    );
                    setIsShowSpinner(false);
                },
            );
        }
    };

    const handleUploadImageProfile = async (uri) => {
        setIsShowSpinner(true);
        MediaHelpers.imgbbUploadImage(
            uri,
            async (res) => {
                setIsShowSpinner(false);
                setImage(uri);

                const body = {
                    title: `${userInfo.fullName}`,
                    url: res.data.url
                };

                const result = await UserServices.addUserPostImageAsync(body);
                const { data } = result;

                if (data) {
                    fetchCurrentUserInfo();
                }
                setIsShowSpinner(false);
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderImageView = () => {
        const listImageObj = [];

        listImageReview.forEach((item) => {
            listImageObj.push({
                uri: item.uri
            });
        });

        if (visible) {
            return (
                <ImageView
                    images={listImageObj}
                    imageIndex={imageIndex}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                />
            );
        }
        return <></>;
    };

    const renderPartnerDataPanel = () => {
        const {
            earningExpected,
            bookingCompletedCount,
            ratingAvg,
            estimatePricing
        } = userInfo;

        const amountDisplay = isCurrentUser ? earningExpected : estimatePricing;

        return (
            <View
                style={{
                    width: SIZES.WIDTH_MAIN,
                    marginTop: 5,
                }}
            >
                <PartnerDataSection
                    listData={
                        [
                            {
                                value: amountDisplay && `${CommonHelpers.formatCurrency(amountDisplay)}Xu/Phút`,
                                type: 'earningExpected',
                                label: 'Phí mời',
                            },
                            {
                                value: `${bookingCompletedCount} lần`,
                                type: 'booking',
                                label: 'Được mời',
                            },
                            {
                                value: `${ratingAvg}/5 sao`,
                                type: 'rating',
                                label: 'Đánh giá',
                            },
                        ]
                    }
                />
            </View>
        );
    };

    const handleShowPartnerDataPanel = () => {
        if (isCurrentUser) {
            if (currentUser.isHost) {
                return (
                    <>
                        <Separator style={{
                            marginVertical: 10
                        }}
                        />
                        {renderPartnerDataPanel()}
                    </>
                );
            }
        }
        if (userInfo.isHost) {
            return (
                <>
                    <Separator style={{
                        marginVertical: 10
                    }}
                    />
                    {renderPartnerDataPanel()}
                </>
            );
        }
        return <></>;
    };

    const renderButtonOption = () => (
        <View
            style={{
                width: SIZES.WIDTH_MAIN,
                alignSelf: 'center',
                flex: 1,
                justifyContent: 'center',
                marginTop: 10
            }}
        >
            <CustomButton
                onPress={() => onClickMore()}
                labelStyle={{
                    fontSize: SIZES.FONT_H3,
                    color: COLORS.ACTIVE,
                }}
                label="Tuỳ chọn"
                buttonStyle={{
                    width: 80,
                    alignSelf: 'flex-start'
                }}
                leftIcon={{
                    name: 'menu',
                    size: 23,
                    color: COLORS.ACTIVE,
                    family: IconFamily.ENTYPO
                }}
                leftIconStyle={{
                    marginTop: 3
                }}
            />
        </View>
    );

    const onClickMore = () => {
        Alert.alert(
            `${userInfo.fullName}`,
            '',
            [
                {
                    text: 'Đóng',
                    style: 'cancel'
                },
                {
                    text: 'Chặn người dùng',
                    onPress: () => {
                        ToastHelpers.renderToast('Đã chặn người dùng, lệnh chặn sẽ hiệu lực sau 48h.');
                    }
                },
                {
                    text: 'Báo cáo người dùng',
                    onPress: () => {
                        setModalReasonVisible(true);
                    }
                },
            ],
            { cancelable: true }
        );
    };

    const renderPartnerPanel = () => (
        <View
            style={{
                width: '95%'
            }}
        >
            {isCurrentUser && (
                <>
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName="treasure-chest"
                        iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                        content={`Xu trong ví: ${CommonHelpers.formatCurrency(userInfo.walletAmount)}`}
                        iconSize={18}
                        contentTextStyle={{
                            fontFamily: TEXT_BOLD,
                            color: COLORS.ACTIVE
                        }}
                    />
                    {!userInfo.isCustomerVerified && !userInfo.isPartnerVerified && (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(ScreenName.VERIFICATION, {
                                    navigateFrom: ScreenName.MENU
                                });
                            }}
                        >
                            <ProfileInfoItem
                                fontSize={SIZES.FONT_H3}
                                iconName="info-circle"
                                iconFamily={IconFamily.FONT_AWESOME}
                                content="Vui lòng xác thực tài khoản"
                                iconSize={18}
                                contentTextStyle={{
                                    color: COLORS.ERROR
                                }}
                                iconColor={COLORS.ERROR}
                            />
                        </TouchableOpacity>
                    )}
                </>
            )}

            {handleShowPartnerDataPanel()}
        </View>
    );

    return (
        <>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={(
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            if (isCurrentUser) {
                                onRefresh();
                            }
                        }}
                        tintColor={COLORS.ACTIVE}
                    />
                )}
                contentContainerStyle={{
                    paddingBottom: isCurrentUser ? 30 : 60,
                    alignItems: 'center'
                }}
            >
                {renderImageView()}
                <View
                    style={{
                        width: SIZES.WIDTH_MAIN,
                        flexDirection: 'row',
                        marginBottom: 10
                    }}
                >
                    <AvatarPanel
                        user={userInfo}
                        image={image}
                        onClickAvatar={() => {
                            if (isCurrentUser) {
                                onClickUpdateAvatar();
                            }
                        }}
                        isCurrentUser={isCurrentUser}
                    />

                    <View style={{
                        width: SIZES.WIDTH_BASE * 0.6,
                        justifyContent: 'center',
                        marginTop: 10
                    }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                if (isCurrentUser) {
                                    navigation.navigate(
                                        ScreenName.UPDATE_INFO_ACCOUNT
                                    );
                                }
                            }}
                        >
                            <View style={[
                                {
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    width: '98%',
                                    alignSelf: 'center',
                                },
                                isCurrentUser && {
                                    marginLeft: 10
                                }
                            ]}
                            >
                                <Text
                                    style={{
                                        color: COLORS.ACTIVE,
                                        fontSize: SIZES.FONT_H3,
                                        fontFamily: TEXT_BOLD,
                                        textAlign: 'center',
                                    }}
                                >
                                    {`${correctFullNameDisplay(userInfo.fullName) || 'N/a'}`}
                                </Text>
                                {isCurrentUser && (
                                    <IconCustom
                                        style={{
                                            marginTop: 10,
                                            marginLeft: 2
                                        }}
                                        name="pencil-alt"
                                        family={IconFamily.FONT_AWESOME_5}
                                        size={10}
                                        color={COLORS.DEFAULT}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        <View>
                            <Text
                                style={{
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H4 - 1,
                                    color: COLORS.DEFAULT,
                                    textAlign: 'center'
                                }}
                            >
                                {'"'}
                                {userInfo.description || 'N/a'}
                                {'"'}
                            </Text>
                        </View>
                    </View>
                </View>

                <Separator style={{
                    marginVertical: 10
                }}
                />

                <SubInfoProfile user={userInfo} />
                {renderPartnerPanel()}

                {/* {isCurrentUser && (
                    <>
                        {!userInfo?.isCustomerVerified && (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate(ScreenName.VERIFICATION);
                                }}
                            >
                                <VerificationStatusPanel />
                            </TouchableOpacity>
                        )}
                    </>
                )} */}

                <Separator style={{
                    marginVertical: 10,
                    marginBottom: 30
                }}
                />

                <Albums
                    isCurrentUser={isCurrentUser}
                    user={userInfo}
                    listImageDisplay={listImageDisplay}
                    onLongPressImage={(imageItem) => {
                        if (isCurrentUser) {
                            onLongPressImage(imageItem);
                        }
                    }}
                    setImageIndex={(index) => setImageIndex(index)}
                    setVisible={(value) => setVisible(value)}
                    onClickUploadProfileImage={() => {
                        if (isCurrentUser) {
                            onClickUploadProfileImage();
                        }
                    }}
                />
                {!isCurrentUser && (
                    <>
                        {renderButtonOption()}
                    </>
                )}

            </ScrollView>
            <ModalReport
                modalReasonVisible={modalReasonVisible}
                setModalReasonVisible={(modalVisible) => setModalReasonVisible(modalVisible)}
                setIsShowSpinner={(showSpinner) => setIsShowSpinner(showSpinner)}
                userId={userInfo.id}
            />
        </>
    );
}
