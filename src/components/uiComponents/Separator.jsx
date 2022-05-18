import Theme from '@constants/Theme';
import React from 'react';
import { View } from 'react-native';

const { COLORS, SIZES } = Theme;

export default function Separator({
    style
}) {
    return (
        <View
            style={[{
                width: SIZES.WIDTH_BASE,
                backgroundColor: COLORS.SEPARATE,
                height: 7,
                alignSelf: 'center'
            }, style]}
        />
    );
}
