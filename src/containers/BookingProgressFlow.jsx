import { Block, Text } from 'galio-framework';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IndicatorVerticalLine, Line, StepIndicator } from '../components/uiComponents';
import { BookingStatus, NowTheme } from '../constants';

export default function BookingProgressFlow({
    booking
}) {
    const {
        partner: {
            fullName
        },
        status
    } = booking;

    const [stepArr, setStepArr] = useState([
        {
            type: 'prev',
            content: 'Đơn hẹn được tạo',
            buttonText: '1'
        },
        {
            type: 'prev',
            content: `Chờ xác nhận từ ${fullName}`,
            buttonText: '2'
        },
        {
            type: 'current',
            content: 'Thanh toán',
            buttonText: '3'
        },
        {
            type: 'next',
            content: 'Cuộc hẹn sắp diễn ra',
            buttonText: '4'
        },
        {
            type: 'next',
            content: 'Hoàn tất',
            buttonText: '5'
        },
    ]);

    useEffect(
        () => {
            handleActiveStepByStatus();
        }, []
    );

    const handleActiveStepByStatus = () => {
        console.log('status', status);
    };

    return (
        <Block style={{
            marginBottom: 30,
        }}
        >
            <Text style={{
                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
            }}
            >
                SƠ ĐỒ ĐẶT HẸN
            </Text>
            <Line
                borderWidth={0.5}
                borderColor={NowTheme.COLORS.ACTIVE}
                style={{
                    marginTop: 10,
                    marginBottom: 20
                }}
            />

            {status !== BookingStatus.CANCEL ? (
                <Block>
                    {stepArr.map((item) => (
                        <Block key={item.buttonText}>
                            <StepIndicator
                                type={item.type}
                                buttonText={item.buttonText}
                                content={item.content}
                            />
                            {item.buttonText !== '5'
                            && (
                                <IndicatorVerticalLine
                                    active={item.type === 'prev'}
                                />
                            )}
                        </Block>
                    ))}
                </Block>
            ) : (
                <Block
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                        size={NowTheme.SIZES.FONT_INFO}
                    >
                        Xin lỗi! Đơn hẹn đã bị huỷ
                    </Text>
                </Block>
            )}
        </Block>
    );
}

BookingProgressFlow.propTypes = {
    booking: PropTypes.object.isRequired
};