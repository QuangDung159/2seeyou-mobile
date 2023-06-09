import Theme from '@constants/Theme';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import CustomText from './CustomText';

const {
    COLORS, SIZES, FONT: {
        TEXT_BOLD
    }
} = Theme;

export default function OptionItem({
    item, index, handlePressItem, isSelected, containerStyle, titleStyle
}) {
    return (
        <TouchableOpacity
            key={item.value}
            onPress={() => handlePressItem(index)}
            style={[{
                borderColor: COLORS.ACTIVE,
                borderWidth: 0.5,
                borderRadius: 20,
                marginRight: 5,
                marginBottom: 5,
                height: 36,
                backgroundColor: isSelected ? COLORS.ACTIVE : COLORS.BASE,
                alignItems: 'center',
                justifyContent: 'center'
            }, containerStyle]}
        >
            <CustomText
                style={[{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: isSelected ? COLORS.BASE : COLORS.DEFAULT,
                    fontSize: SIZES.FONT_H3,
                    fontFamily: TEXT_BOLD
                }, titleStyle]}
                text={item.value}
            />
        </TouchableOpacity>
    );
}
