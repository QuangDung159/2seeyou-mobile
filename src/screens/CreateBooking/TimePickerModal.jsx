import { CustomButton, CustomModal } from '@components/uiComponents';
import DateTimeConst from '@constants/DateTimeConst';
import NowTheme from '@constants/NowTheme';
import React from 'react';
import { Text, View } from 'react-native';
import ScrollPicker from 'react-native-wheel-scroll-picker';

const {
    FONT: {
        MONTSERRAT_REGULAR
    },
    SIZES,
    COLORS
} = NowTheme;

const hourArr = DateTimeConst.HOUR_ARR;
const minuteArr = DateTimeConst.MINUTE_ARR;

export default function TimePickerModal({
    setTotal, modalActiveType, startTimeStr, setStartTimeStr, endTimeStr, setEndTimeStr,
    startHourActive, endHourActive, startMinuteActive, endMinuteActive,
    modalTimePickerVisible, setModalTimePickerVisible
}) {
    const onChangeHourTimePicker = (data) => {
        setTotal(0);
        if (modalActiveType === 'start') {
            const startTimeArr = startTimeStr.split(':');
            startTimeArr[0] = data;
            setStartTimeStr(startTimeArr.join(':'));

            const endTimeArr = endTimeStr.split(':');
            endTimeArr[0] = +data + 2;
            setEndTimeStr(endTimeArr.join(':'));
        } else {
            const endTimeArr = endTimeStr.split(':');
            endTimeArr[0] = data;
            setEndTimeStr(endTimeArr.join(':'));
        }
    };

    const onChangeMinuteTimePicker = (data) => {
        setTotal(0);
        if (modalActiveType === 'start') {
            const startTimeArr = startTimeStr.split(':');
            startTimeArr[1] = data;
            setStartTimeStr(startTimeArr.join(':'));

            const endTimeArr = endTimeStr.split(':');
            endTimeArr[1] = data;
            setEndTimeStr(endTimeArr.join(':'));
        } else {
            const endTimeArr = endTimeStr.split(':');
            endTimeArr[1] = data;
            setEndTimeStr(endTimeArr.join(':'));
        }
    };

    const renderTimePicker = () => (
        <View
            style={{
                alignSelf: 'center',
                width: SIZES.WIDTH_BASE * 0.8,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: COLORS.BASE
            }}
        >
            <ScrollPicker
                dataSource={hourArr}
                selectedIndex={
                    modalActiveType === 'start' ? startHourActive : endHourActive
                }
                renderItem={(data) => (
                    <Text>
                        {`${data}`}
                    </Text>
                )}
                onValueChange={(data) => {
                    onChangeHourTimePicker(data);
                }}
                wrapperHeight={120}
                wrapperWidth={150}
                wrapperBackground={COLORS.BLOCK}
                itemHeight={40}
                highlightColor={COLORS.BASE}
                highlightBorderWidth={2}
                activeItemTextStyle={{
                    color: COLORS.ACTIVE,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
                itemTextStyle={{
                    color: COLORS.DEFAULT,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
            />

            <ScrollPicker
                dataSource={minuteArr}
                selectedIndex={
                    modalActiveType === 'start' ? startMinuteActive : endMinuteActive
                }
                renderItem={(data) => (
                    <Text>
                        {`${data}`}
                    </Text>
                )}
                onValueChange={(data) => {
                    onChangeMinuteTimePicker(data);
                }}
                wrapperHeight={120}
                wrapperWidth={150}
                wrapperBackground={COLORS.BLOCK}
                itemHeight={40}
                highlightColor={COLORS.BASE}
                highlightBorderWidth={2}
                activeItemTextStyle={{
                    color: COLORS.ACTIVE,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
                itemTextStyle={{
                    color: COLORS.DEFAULT,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
            />
        </View>
    );

    const renderTimePickerModal = () => (
        <CustomModal
            modalVisible={modalTimePickerVisible}
            renderContent={() => (
                <>
                    {renderTimePicker()}
                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => setModalTimePickerVisible(false)}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8,
                                marginVertical: 10
                            }}
                            type="active"
                            label="Đóng"
                        />
                    </View>
                </>
            )}
        />
    );

    return (
        <>
            {renderTimePickerModal()}
        </>
    );
}