import { CustomButton, CustomModal } from '@components/uiComponents';
import DateTimeConst from '@constants/DateTimeConst';
import Theme from '@constants/Theme';
import React from 'react';
import { View } from 'react-native';
import ScrollPicker from 'react-native-wheel-scroll-picker';

const {
    FONT: {
        TEXT_REGULAR
    },
    SIZES,
    COLORS
} = Theme;

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
            <View
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 79,
                    height: 40,
                    width: '100%',
                    borderColor: COLORS.ACTIVE,
                    borderWidth: 0.5,
                    borderRadius: 20,
                    zIndex: 99
                }}
            />
            <ScrollPicker
                dataSource={hourArr}
                selectedIndex={
                    modalActiveType === 'start' ? startHourActive + 17 : endHourActive + 17
                }
                onValueChange={(data) => {
                    onChangeHourTimePicker(data);
                }}
                wrapperHeight={200}
                wrapperWidth={150}
                wrapperBackground={COLORS.BASE}
                itemHeight={40}
                highlightColor={COLORS.BASE}
                highlightBorderWidth={2}
                activeItemTextStyle={{
                    color: COLORS.ACTIVE,
                    fontFamily: TEXT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
                itemTextStyle={{
                    color: COLORS.DEFAULT,
                    fontFamily: TEXT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
            />

            <ScrollPicker
                dataSource={minuteArr}
                selectedIndex={
                    modalActiveType === 'start' ? startMinuteActive + 60 : endMinuteActive + 60
                }
                onValueChange={(data) => {
                    onChangeMinuteTimePicker(data);
                }}
                wrapperHeight={200}
                wrapperWidth={150}
                wrapperBackground={COLORS.BASE}
                itemHeight={40}
                highlightColor={COLORS.BASE}
                highlightBorderWidth={2}
                activeItemTextStyle={{
                    color: COLORS.ACTIVE,
                    fontFamily: TEXT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
                itemTextStyle={{
                    color: COLORS.DEFAULT,
                    fontFamily: TEXT_REGULAR,
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
                            label="Chọn"
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
