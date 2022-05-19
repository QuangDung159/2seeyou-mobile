import Theme from '@constants/Theme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const {
    COLORS, SIZES, FONT: {
        TEXT_REGULAR,
    }
} = Theme;

export default function RadioButton({
    selected, style, label, onPress, labelStyle
}) {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}
            onPress={() => onPress()}
        >
            <View
                style={[
                    {
                        height: 24,
                        width: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: selected ? COLORS.ACTIVE : COLORS.PLACE_HOLDER,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    style,
                ]}
            >
                <View
                    style={{
                        height: 15,
                        width: 15,
                        borderRadius: 7,
                        backgroundColor: selected ? COLORS.ACTIVE : COLORS.BASE,
                    }}
                />
            </View>
            {label && (
                <Text
                    style={[{
                        marginLeft: 5,
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H4,
                    }, labelStyle]}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}
