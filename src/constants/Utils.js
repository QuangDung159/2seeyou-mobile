/* eslint-disable no-undef */
import { theme } from 'galio-framework';
import { Platform, StatusBar } from 'react-native';

const StatusHeight = StatusBar.currentHeight;
const HeaderHeight = theme.SIZES.BASE * 3.5 + (StatusHeight || 0);
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);

const TIME_FORMAT = {
    TIME_FORMAT_ZULU: 'YYYY-MM-DDTHH:mm:ss.SSS',
    TIME_FORMAT_DDMMYYYY: 'DD-MM-YYYY',
};

export default {
    StatusHeight,
    HeaderHeight,
    iPhoneX,
    TIME_FORMAT
};
