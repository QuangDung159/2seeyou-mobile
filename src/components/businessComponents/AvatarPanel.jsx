import {
    CenterLoader, IconCustom
} from '@components/uiComponents';
import IconFamily from '@constants/IconFamily';
import Images from '@constants/Images';
import Theme from '@constants/Theme';
import React from 'react';
import {
    Image, StyleSheet, TouchableOpacity, View
} from 'react-native';

const { SIZES, COLORS } = Theme;

export default function AvatarPanel({
    user, image, isCurrentUser = false, onClickAvatar = null
}) {
    // render
    const renderAvatar = () => {
        if (isCurrentUser && image) {
            return (
                <Image
                    style={styles.avatar}
                    source={{ uri: image }}
                />
            );
        }
        return (
            <>
                <Image
                    style={styles.avatar}
                    source={user.url ? { uri: user.url } : Images.defaultImage}
                />
                {isCurrentUser && user.isCustomerVerified && (
                    <View
                        style={{
                            zIndex: 99,
                            position: 'absolute',
                            top: 5,
                            right: 20,
                        }}
                    >
                        <IconCustom
                            name="check-circle-o"
                            family={IconFamily.FONT_AWESOME}
                            size={22}
                            color={COLORS.ACTIVE}
                        />
                    </View>
                )}

            </>
        );
    };

    const renderAvatarPanel = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.3,
                marginTop: 5,
            }}
        >
            <View
                style={{
                    marginTop: 10,
                }}
            >
                <CenterLoader containerStyle={{
                    marginRight: 19,
                    marginBottom: 5
                }}
                />
                <View
                    style={{
                        zIndex: 99,
                        backgroundColor: COLORS.BASE
                    }}
                >
                    <TouchableOpacity
                        onPress={() => isCurrentUser && onClickAvatar && onClickAvatar()}
                    >
                        {renderAvatar()}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    try {
        return (
            <>
                {renderAvatarPanel()}
            </>
        );
    } catch (error) {
        console.log('error :>> ', error);
    }
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 100,
        width: SIZES.WIDTH_BASE * 0.25,
        height: SIZES.WIDTH_BASE * 0.25,
    },
});
