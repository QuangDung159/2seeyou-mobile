import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NowTheme } from '../../constants';
import CustomButton from './CustomButton';

export default function StepIndicator({
    type, buttonText, content
}) {
    let indicatorStyle = styles.stepIndicatorCurrent;
    let buttonFontColor = NowTheme.COLORS.BASE;
    switch (type) {
        case 'next': {
            indicatorStyle = styles.stepIndicatorNext;
            break;
        }
        case 'prev': {
            indicatorStyle = styles.stepIndicatorPrev;
            break;
        }
        default: {
            buttonFontColor = NowTheme.COLORS.ACTIVE;
            break;
        }
    }
    return (
        <View
            style={{
                flexDirection: 'row'
            }}
        >
            <View
                style={styles.stepIndicatorContainer}
            >
                <CustomButton
                    buttonStyle={indicatorStyle}
                    labelStyle={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                        fontSize: NowTheme.SIZES.FONT_H2,
                        color: buttonFontColor
                    }}
                    label={buttonText}
                />
            </View>

            <View
                style={styles.contentContainer}
            >
                <Text
                    style={{
                        color: NowTheme.COLORS.DEFAULT,
                        fontSize: NowTheme.SIZES.FONT_H3,
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    {content}
                </Text>
            </View>
        </View>
    );
}

StepIndicator.propTypes = {
    type: PropTypes.oneOf(['next', 'current', 'prev']),
    buttonText: PropTypes.string,
    content: PropTypes.string
};

StepIndicator.defaultProps = {
    type: 'current',
    buttonText: '1',
    content: 'Booking was rejected'
};

const styles = StyleSheet.create({
    stepIndicatorCurrent: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.BASE,
        borderColor: NowTheme.COLORS.ACTIVE,
        borderWidth: 3,
    },
    stepIndicatorNext: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.INPUT,
        borderWidth: 0,
    },
    stepIndicatorPrev: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.ACTIVE,
        borderWidth: 0
    },
    stepIndicatorContainer: {
        width: 30,
        height: 30,
        alignSelf: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        marginLeft: 10,
        alignSelf: 'center',
        alignItems: 'center'
    }
});
