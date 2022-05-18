import { Images, ScreenName, Theme } from '@constants/index';
import { setPersonTabActiveIndex } from '@redux/Actions';
import { NotificationServices } from '@services/index';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';

const {
    FONT: { TEXT_REGULAR, TEXT_BOLD },
    SIZES,
    COLORS,
} = Theme;

export default function NotificationItem({
    onTriggerRead,
    notiItem,
    navigation,
}) {
    const dispatch = useDispatch();

    const onClickRead = async (isReadAll, notiId = null) => {
        let result;
        if (isReadAll) {
            result = await NotificationServices.triggerReadAllNotificationAsync();
        } else {
            result = await NotificationServices.triggerReadNotificationAsync(
                notiId
            );
        }
        const { data } = result;

        if (data) {
            onTriggerRead();
        }
    };

    const handleNavigation = (navigationId, navigationType) => {
        switch (navigationType) {
            case 2: {
                navigation.navigate(ScreenName.BOOKING_DETAIL, {
                    bookingId: navigationId,
                });
                break;
            }
            case 3: {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(1));
                break;
            }
            case 4: {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(1));
                break;
            }
            case 5: {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(0));
                break;
            }
            default: {
                break;
            }
        }
    };

    const renderAvatar = () => (
        <Image
            style={styles.avatar}
            source={notiItem.url ? { uri: notiItem.url } : Images.defaultImage}
        />
    );

    const renderNotiContent = () => {
        const {
            content, id, navigationId, type, title
        } = notiItem;

        return (
            <>
                <View
                    style={{
                        marginRight: 15,
                        alignSelf: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    {renderAvatar()}
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        flex: 8,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            handleNavigation(navigationId, type);
                            onClickRead(false, id);
                        }}
                    >
                        <View
                            style={{
                                paddingVertical: 5,
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: COLORS.DEFAULT,
                                    fontSize: SIZES.FONT_H4,
                                    fontFamily: !isRead
                                        ? TEXT_BOLD
                                        : TEXT_REGULAR,
                                }}
                            >
                                {title}
                            </Text>
                            <Text
                                numberOfLines={2}
                                style={{
                                    color: COLORS.DEFAULT,
                                    fontSize: SIZES.FONT_H5,
                                    fontFamily: !isRead
                                        ? TEXT_BOLD
                                        : TEXT_REGULAR,
                                }}
                            >
                                {content}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </>
        );
    };

    const { isRead } = notiItem;

    return (
        <View
            style={{
                height: 73,
                backgroundColor: isRead ? COLORS.SEPARATE : COLORS.BASE
            }}
        >
            <View
                style={{
                    height: SIZES.HEIGHT_BASE * 0.1,
                    marginHorizontal: 10,
                    flexDirection: 'row',
                    flex: 1,
                }}
            >
                {renderNotiContent()}
            </View>
        </View>
    );
}

NotificationItem.propTypes = {
    onTriggerRead: PropTypes.func.isRequired,
    notiItem: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 100,
        width: SIZES.WIDTH_BASE * 0.1,
        height: SIZES.WIDTH_BASE * 0.1,
    },
});
