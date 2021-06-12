import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { NowTheme } from '../../../constants';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function ProfileInfoItem({
    label, value
}) {
    let handleValue = value;
    if (value === null || value === undefined || value.toString() === '') {
        handleValue = 'N/a';
    }
    return (
        <View
            style={{
                margin: 5,
                flexDirection: 'row'
            }}
        >
            <Text
                style={{
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H2,
                    color: COLORS.DEFAULT,
                }}

            >
                {`${label}: `}
            </Text>

            <Text
                style={{
                    fontFamily: MONTSERRAT_BOLD,
                    fontSize: SIZES.FONT_H2,
                    color: COLORS.ACTIVE,
                }}
            >
                {handleValue}
            </Text>
        </View>
    );
}

ProfileInfoItem.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
};

ProfileInfoItem.defaultProps = {
    label: 'label',
    value: 'N/a',
};
