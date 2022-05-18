import ResponsiveHelpers from '@helpers/ResponsiveHelpers';
import { Dimensions } from 'react-native';
import App from './App';

const { width, height } = Dimensions.get('window');

const COLORS = {
    DEFAULT: '#303133',
    ERROR: '#FF3636',
    SUCCESS: '#34a853',
    INPUT: '#DCDCDC',
    ACTIVE: '#34a853',
    LIST_ITEM_BACKGROUND_1: '#ffeee3',
    LIST_ITEM_BACKGROUND_2: '#cdf6ff',
    TRANSPARENT: 'transparent',
    SELECTED_DATE: '#b3f1ff',
    BASE: '#ffffff',
    PLACE_HOLDER: '#c4c4c4',
    SEPARATE: '#ededed'
};

const SIZES = {
    BASE: 16,
    OPACITY: 0.8,

    // montserrat
    FONT_H1: ResponsiveHelpers.normalize(26),
    FONT_H2: ResponsiveHelpers.normalize(21),
    FONT_H3: ResponsiveHelpers.normalize(19),
    FONT_H4: ResponsiveHelpers.normalize(17),
    FONT_H5: ResponsiveHelpers.normalize(15),

    WIDTH_BASE: width,
    HEIGHT_BASE: height,
    WIDTH_MAIN: width * 0.95,
    WIDTH_90: width * 0.9
};

const FONT = {
    TEXT_REGULAR: App.FONT.robotoRegular,
    TEXT_BOLD: App.FONT.robotoBold
};

export default {
    COLORS,
    SIZES,
    FONT
};
