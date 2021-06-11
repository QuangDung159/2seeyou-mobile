/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import {
    Block, Text
} from 'galio-framework';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, ScrollView, StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import { CardImage } from '../../components/businessComponents';
import { CenterLoader, CustomButton } from '../../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { rxUtil } from '../../utils';
import UserInfoSection from '../Personal/UserInformation/UserInfoSection';

export default function Profile({ route, navigation }) {
    const [visible, setVisible] = useState(false);
    const [partnerInfo, setPartnerInfo] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageFullscreen, setListImageFullscreen] = useState([]);

    const token = useSelector((state) => state.userReducer.token);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    useEffect(
        () => {
            getPartnerInfo();
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

    const getPartnerInfo = () => {
        const {
            params: {
                userId
            }
        } = route;

        rxUtil(
            `${Rx.PARTNER.PARTNER_DETAIL}/${userId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                const {
                    data, data: {
                        posts
                    }
                } = res.data;
                setPartnerInfo(data);

                const listImage = [
                    {
                        uri: data.url,
                    }
                ];

                posts.forEach((post) => {
                    listImage.push({
                        uri: post.url
                    });
                });

                setListImageFullscreen(listImage);
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

    const renderSubInfo = () => {
        const {
            description,
            earningExpected,
            fullName,
            height,
            weight,
            dob,
            homeTown,
            interests
        } = partnerInfo;

        return (
            <Block style={{
                marginTop: 30,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center'
            }}
            >
                <Block row center>
                    <Text
                        style={{
                            color: NowTheme.COLORS.ACTIVE,
                            fontWeight: 'bold',
                            fontSize: NowTheme.SIZES.FONT_H1,
                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                        }}
                    >
                        {fullName}
                        {' '}
                    </Text>
                </Block>

                <Block
                    center
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE - 40,
                        paddingBottom: 30,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            textAlign: 'center',
                        }}
                        size={NowTheme.SIZES.FONT_H2}
                        color={NowTheme.COLORS.DEFAULT}
                    >
                        {'"'}
                        {description}
                        {'"'}
                    </Text>
                </Block>

                <UserInfoSection
                    listUserInfo={
                        [
                            {
                                value: earningExpected && `${earningExpected.toString()} kim cương/phút`,
                                icon: {
                                    name: 'diamond',
                                    family: IconFamily.SIMPLE_LINE_ICONS,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                            {
                                value: '26 đơn hẹn',
                                icon: {
                                    name: 'list-alt',
                                    family: IconFamily.FONT_AWESOME,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                            {
                                value: '4.8/5 đánh giá',
                                icon: {
                                    name: 'star-o',
                                    family: IconFamily.FONT_AWESOME,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 28
                                }
                            },
                            {
                                value: `${height} cm`,
                                icon: {
                                    name: 'human-male-height',
                                    family: IconFamily.MATERIAL_COMMUNITY_ICONS,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 26
                                }
                            },
                            {
                                value: `${weight} kg`,
                                icon: {
                                    name: 'weight',
                                    family: IconFamily.FONT_AWESOME_5,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                            {
                                value: moment(dob).format('YYYY').toString(),
                                icon: {
                                    name: 'birthday-cake',
                                    family: IconFamily.FONT_AWESOME,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 23
                                }
                            },
                            {
                                value: homeTown,
                                icon: {
                                    name: 'home',
                                    family: IconFamily.FONT_AWESOME,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 28
                                }
                            },
                            {
                                value: interests,
                                icon: {
                                    name: 'badminton',
                                    family: IconFamily.MATERIAL_COMMUNITY_ICONS,
                                    color: NowTheme.COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                        ]
                    }
                />
            </Block>
        );
    };

    const renderListPostImage = () => (
        <>
            {listImageFullscreen && (
                <Block>
                    {listImageFullscreen.map((imageItem, index) => (
                        <Block key={`${imageItem.uri}`}>
                            {index === 0 ? (<></>) : (
                                <Block style={{
                                    marginVertical: 20
                                }}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            setImageIndex(index);
                                            setVisible(true);
                                        }}
                                    >
                                        <CardImage
                                            key={imageItem.imageId}
                                            imageUrl={imageItem.uri}
                                            user={partnerInfo}
                                            isShowTitle={false}
                                            navigation={navigation}
                                        />
                                    </TouchableWithoutFeedback>
                                </Block>
                            )}
                        </Block>
                    ))}
                    <Block style={{ height: NowTheme.SIZES.HEIGHT_BASE * 0.13 }} />
                </Block>
            )}
        </>
    );

    // const listImage = partnerInfo.posts;
    // const listImagePreview = createListImageForImageView();

    const {
        params: {
            userId
        }
    } = route;

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <>
                        <Block style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            zIndex: 1,
                            backgroundColor: NowTheme.COLORS.BASE
                        }}
                        >
                            <ImageView
                                images={listImageFullscreen}
                                imageIndex={imageIndex}
                                visible={visible}
                                onRequestClose={() => setVisible(false)}
                            />

                            <Block flex={1}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Block>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                setVisible(true);
                                                setImageIndex(0);
                                            }}
                                        >
                                            <Block
                                                style={{
                                                    zIndex: 99
                                                }}
                                            >
                                                <ImageBackground
                                                    source={{
                                                        uri: partnerInfo.url || NO_AVATAR_URL
                                                    }}
                                                    style={[styles.profileContainer]}
                                                    imageStyle={styles.profileBackground}
                                                />
                                            </Block>
                                            <CenterLoader />
                                        </TouchableWithoutFeedback>

                                        <Block style={{ marginTop: -(NowTheme.SIZES.HEIGHT_BASE * 0.4) }}>
                                            {renderSubInfo()}
                                            {renderListPostImage()}
                                        </Block>
                                    </Block>
                                </ScrollView>
                            </Block>
                        </Block>
                        <Block style={styles.buttonPanelContainer}>
                            <Block
                                middle
                                row
                            >
                                <CustomButton
                                    onPress={() => {
                                        navigation.navigate(ScreenName.MESSAGE, {
                                            name: partnerInfo.fullName,
                                            userStatus: 'Vừa mới truy cập',
                                            toUserId: userId,
                                            userInfo: partnerInfo
                                        });
                                    }}
                                    type="active"
                                    label="Nhắn tin"
                                    buttonStyle={{
                                        width: 114,
                                        height: 44,
                                        marginHorizontal: 5,
                                        elevation: 0,
                                        borderRadius: 20,
                                        backgroundColor: NowTheme.COLORS.ACTIVE
                                    }}
                                    labelStyle={{
                                        fontSize: 16,
                                        color: NowTheme.COLORS.BASE
                                    }}
                                />

                                <CustomButton
                                    onPress={() => {
                                        navigation.navigate(ScreenName.CREATE_BOOKING, {
                                            partner: partnerInfo,
                                            from: ScreenName.PROFILE
                                        });
                                    }}
                                    type="active"
                                    label="Đặt hẹn"
                                    buttonStyle={{
                                        width: 114,
                                        height: 44,
                                        marginHorizontal: 5,
                                        elevation: 0,
                                        borderRadius: 20,
                                        backgroundColor: NowTheme.COLORS.ACTIVE
                                    }}
                                    labelStyle={{
                                        fontSize: 16,
                                        color: NowTheme.COLORS.BASE
                                    }}
                                />
                            </Block>
                        </Block>
                    </>
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

Profile.propTypes = {
    route: PropTypes.object,
};

Profile.defaultProps = {
    route: {}
};

const styles = StyleSheet.create({
    profileContainer: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    profileBackground: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE * 0.6
    },
    buttonPanelContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: NowTheme.SIZES.HEIGHT_BASE * 0.8,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 2,
        width: NowTheme.SIZES.WIDTH_BASE,
    },
});