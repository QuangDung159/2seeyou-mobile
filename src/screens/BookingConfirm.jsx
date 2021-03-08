import {
    Block, Button, Input, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal, StyleSheet
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { CustomCalendar } from '../components/bussinessComponents';
import { CenterLoader, IconCustom, Line } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function BookingConfirm({ route, navigation }) {
    const [booking, setBooking] = useState({
        start: '',
        end: '',
        isDraft: true,
        locationId: '',
        locationAddress: ''
    });
    const [selectedDate, setSelectedDate] = useState(moment().format('DD-MM-YYYY'));
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listBusyBySelectedDate, setListBusyBySelectedDate] = useState([]);
    const [busyCalendar, setBusyCalendar] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [listLocationForDropdown, setListLocationForDropdown] = useState([]);
    const [currentTask, setCurrentTask] = useState('create');
    const [earningExpected, setEarningExpected] = useState(0);

    const token = useSelector((state) => state.userReducer.token);
    const listBookingLocation = useSelector((state) => state.locationReducer.listBookingLocation);

    useEffect(
        () => {
            const {
                params: {
                    bookingToEdit,
                    partner
                }
            } = route;

            if (bookingToEdit) {
                getPartnerInfo(partner.id);
            } else {
                setEarningExpected(partner.earningExpected);
            }

            setListLocationForDropdown(createListLocationForDropdown(listBookingLocation));
            setBooking({
                ...booking,
                locationId: listBookingLocation[0].id,
                locationAdress: listBookingLocation[0].address
            });
            getCalendarPartner();
            fillBookingDataFromDetail();
        }, []
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    const onChangeStart = (startInput) => {
        if (startInput.length === 2
            && startInput.length >= booking.start.length) {
            setBooking({ ...booking, start: `${startInput}:` });
        } else {
            setBooking({ ...booking, start: startInput });
        }
    };

    const onChangeEnd = (endInput) => {
        if (endInput.length === 2
            && endInput.length >= booking.end.length) {
            setBooking({ ...booking, end: `${endInput}:` });
        } else {
            setBooking({ ...booking, end: endInput });
        }
    };

    const getCalendarPartner = () => {
        const {
            params: {
                partner
            }
        } = route;

        setIsShowSpinner(true);

        rxUtil(
            `${Rx.CALENDAR.PARTNER_CALENDAR}/${partner.id}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setBusyCalendar(res.data.data);
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const fillBookingDataFromDetail = () => {
        const {
            params: {
                bookingToEdit
            }
        } = route;

        if (bookingToEdit) {
            const {
                endAt,
                date,
                startAt,
                location: {
                    id,
                    address
                }
            } = bookingToEdit;

            setCurrentTask('update');
            setBooking({
                ...booking,
                start: convertMinutesToStringHours(startAt),
                end: convertMinutesToStringHours(endAt),
                locationId: id,
                locationAdress: address
            });

            onChangeDateCalendar(moment(date.substring(0, 10), 'YYYY-MM-DD').format('DD-MM-YYYY'));
        }
    };

    const onChangeLocation = (locationId, locationAdress) => {
        setBooking({
            ...booking, locationId, locationAdress
        });
    };

    const onSubmitBooking = () => {
        const {
            params: {
                partner,
                bookingToEdit
            }
        } = route;

        const dateString = `${moment(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}T00:00:00`;
        const startString = convertStringHoursToMinutes(booking.start);
        const endString = convertStringHoursToMinutes(booking.end);

        const bookingToSubmit = {
            StartAt: startString,
            EndAt: endString,
            LocationId: booking.locationId,
            IsDraft: booking.isDraft,
            Date: dateString,
            isConfirm: false
        };

        setIsShowSpinner(true);

        const endpoint = currentTask === 'create'
            ? `${Rx.BOOKING.SCHEDULE_BOOKING}/${partner.id}`
            : `${Rx.BOOKING.UDPATE_BOOKING}/${bookingToEdit.id}`;

        rxUtil(
            endpoint,
            'POST',
            bookingToSubmit,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                navigation.navigate(ScreenName.HOME);
            },
            () => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast();
            },
            (errResponse) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(errResponse, 'error');
            }
        );
    };

    const convertStringHoursToMinutes = (hoursStr) => {
        const deltaTime = hoursStr.split(':');
        const hours = deltaTime[0];
        const minutes = deltaTime[1];
        return hours * 60 + +minutes;
    };

    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    const getPartnerInfo = (partnerId) => {
        rxUtil(
            `${Rx.PARTNER.PARTNER_DETAIL}/${partnerId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                setEarningExpected(res.data.data.earningExpected);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const calculateTotalAmount = (start, end) => {
        const startMinutesNumber = convertStringHoursToMinutes(start) || 0;
        const endMinutesNumber = convertStringHoursToMinutes(end) || 0;
        if (startMinutesNumber < endMinutesNumber) {
            return (endMinutesNumber - startMinutesNumber) * earningExpected;
        }
        return 0;
    };

    const onChangeDateCalendar = (date) => {
        const result = busyCalendar.find(
            (item) => date === moment(item.date).format('DD-MM-YYYY')
        );

        setSelectedDate(date);
        setListBusyBySelectedDate(result ? result.details : []);
    };

    const createListLocationForDropdown = (listLocation) => {
        const listLocationFinal = [];

        if (listLocation) {
            listLocation.forEach((item) => {
                const location = { ...item };
                location.label = item.name;
                location.value = item.id;
                listLocationFinal.push(location);
            });
        }
        return listLocationFinal;
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    const renderListBusySection = () => {
        if (listBusyBySelectedDate[0] !== '') {
            return listBusyBySelectedDate.map((item, sectionIndex) => {
                const startStr = convertMinutesToStringHours(item.startAt);
                const endStr = convertMinutesToStringHours(item.endAt);

                return (
                    <>
                        <Block
                            style={{
                                backgroundColor: sectionIndex % 2 === 0
                                    ? NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                                    : NowTheme.COLORS.LIST_ITEM_BACKGROUND_2,
                                height: NowTheme.SIZES.HEIGHT_BASE * 0.07,
                                justifyContent: 'center',
                            }}
                        >
                            <Block
                                row
                                space="between"
                                style={{
                                    marginHorizontal: 10,
                                    alignItems: 'center'
                                }}
                            >
                                <Block
                                    row
                                    flex
                                    space="around"
                                >
                                    <Text
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                        }}
                                        size={27}
                                        color={NowTheme.COLORS.ACTIVE}
                                    >
                                        {startStr}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                        }}
                                        size={27}
                                        color={NowTheme.COLORS.ACTIVE}
                                    >
                                        -
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                        }}
                                        size={27}
                                        color={NowTheme.COLORS.ACTIVE}
                                    >
                                        {endStr}
                                    </Text>
                                </Block>
                            </Block>
                        </Block>
                    </>
                );
            });
        }
        return <></>;
    };

    const renderModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Block style={styles.centeredView}>
                    <Block style={styles.modalView}>
                        <Text
                            size={NowTheme.SIZES.FONT_INFO}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                marginVertical: 10
                            }}
                        >
                            Lịch bận của đối tác
                        </Text>
                        <Block
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.75
                            }}
                        >
                            {renderBusyCalendar()}
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => setModalVisible(false)}
                                style={[styles.buttonModal, {
                                    marginVertical: 10
                                }]}
                                shadowless
                            >
                                Đóng
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Modal>
    );

    const renderInput = () => (
        <Block
            space="between"
            row
            style={{
                marginBottom: 10
            }}
        >
            <Input
                maxLength={5}
                style={{
                    borderRadius: 5,
                    width: NowTheme.SIZES.WIDTH_BASE * 0.39,
                    height: 45,
                    marginRight: 10
                }}
                color={NowTheme.COLORS.HEADER}
                placeholder="Bắt đầu..."
                value={booking.start}
                keyboardType="number-pad"
                textInputStyle={{
                    fontSize: 18,
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                }}
                onChangeText={(startInput) => onChangeStart(startInput)}
            />
            <Input
                maxLength={5}
                style={{
                    borderRadius: 5,
                    width: NowTheme.SIZES.WIDTH_BASE * 0.39,
                    height: 45
                }}
                color={NowTheme.COLORS.HEADER}
                placeholder="Kết thúc..."
                value={booking.end}
                keyboardType="number-pad"
                textInputStyle={{
                    fontSize: 18,
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                }}
                onChangeText={(endInput) => onChangeEnd(endInput)}
            />
            {renderIconShowModal()}
        </Block>
    );

    const renderAlert = () => (
        Alert.alert(
            'Huỷ bỏ?',
            'Bạn có chắc muốn huỷ đặt hẹn?',
            [
                {
                    text: 'Tiếp tục đặt',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Đồng ý huỷ',
                    onPress: () => {
                        navigation.navigate(ScreenName.PROFILE, {
                            user: route.params.partner
                        });
                    }
                }
            ],
            { cancelable: false }
        )
    );

    const renderDropDownLocation = () => (
        <Block
            style={{
                width: NowTheme.SIZES.WIDTH_95,
                alignSelf: 'center',
                marginBottom: 10,
            }}
        >
            {listLocationForDropdown && listLocationForDropdown.length !== 0 && (
                <DropDownPicker
                    items={listLocationForDropdown}
                    defaultValue={booking.locationId}
                    containerStyle={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_95,
                        alignSelf: 'center',
                        marginBottom: 10
                    }}
                    selectedtLabelStyle={{
                        color: 'red'
                    }}
                    placeholderStyle={{
                        color: NowTheme.COLORS.MUTED
                    }}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                    activeLabelStyle={{ color: NowTheme.COLORS.ACTIVE }}
                    onChangeItem={(item) => onChangeLocation(item.value, item.address)}
                    labelStyle={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                    placeholder="Chọn địa điểm..."
                    searchable
                    searchablePlaceholder="Tìm kiếm..."
                    searchablePlaceholderTextColor={NowTheme.COLORS.MUTED}
                    searchableError={() => <Text>Not Found</Text>}
                />
            )}
            <Block>
                {booking.locationAdress ? (
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            fontSize: NowTheme.SIZES.FONT_SUB_TITLE,
                            marginBottom: 10
                        }}
                        color={NowTheme.COLORS.ACTIVE}
                    >
                        {booking.locationAdress}
                    </Text>
                ) : (
                    <Block style={{
                        marginBottom: 10
                    }}
                    />
                )}
            </Block>
        </Block>
    );

    const renderFormBlock = (partner) => {
        const {
            params: {
                bookingToEdit
            }
        } = route;

        const activeDate = bookingToEdit
            ? moment(bookingToEdit.date.substring(0, 10), 'YYYY-MM-DD').format('DD-MM-YYYY')
            : selectedDate;

        return (
            <Block
                style={{
                    zIndex: 99,
                }}
                flex
            >
                <Block>
                    <Text style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginTop: 10
                    }}
                    >
                        THÔNG TIN CUỘC HẸN
                    </Text>
                    <Line
                        borderWidth={0.5}
                        borderColor={NowTheme.COLORS.ACTIVE}
                        style={{
                            marginVertical: 10
                        }}
                    />
                    {renderInfoBlock(partner)}

                    <CustomCalendar
                        onChangeDate={(date) => { onChangeDateCalendar(date); }}
                        selectedDate={activeDate}
                    />

                    {renderInput()}

                    {renderDropDownLocation()}

                </Block>
            </Block>
        );
    };

    const renderInfoBlock = (partner) => {
        const {
            params: {
                fullName
            }
        } = route;

        return (
            <Block
                middle
                style={{
                    marginBottom: 10,
                }}
            >
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={NowTheme.SIZES.FONT_MAIN_TITLE}
                    style={styles.title}
                >
                    {fullName || partner.fullName}
                </Text>
            </Block>
        );
    };

    const renderTotal = () => {
        const {
            start, end
        } = booking;

        return (
            <Block>
                <Block>
                    <Text style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginTop: 10
                    }}
                    >
                        XÁC NHẬN ĐẶT
                    </Text>
                    <Line
                        borderWidth={0.5}
                        borderColor={NowTheme.COLORS.ACTIVE}
                        style={{
                            marginTop: 10
                        }}
                    />
                </Block>
                <Block
                    middle
                >
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                            fontSize: 30,
                            paddingVertical: 10
                        }}
                        color={NowTheme.COLORS.ACTIVE}
                    >
                        {calculateTotalAmount(start, end)}
                        {' '}
                        <IconCustom
                            name="diamond"
                            family={IconFamily.SIMPLE_LINE_ICONS}
                            size={20}
                            color={NowTheme.COLORS.ACTIVE}
                        />
                    </Text>
                </Block>
                {renderButton()}
            </Block>
        );
    };

    const renderButton = () => (
        <Block
            row
            center
            space="between"
        >
            <Button
                onPress={() => {
                    onSubmitBooking();
                }}
                shadowless
            >
                Xác nhận
            </Button>

            <Button
                onPress={() => {
                    renderAlert();
                }}
                shadowless
                color={NowTheme.COLORS.DEFAULT}
            >
                Huỷ bỏ
            </Button>
        </Block>
    );

    const renderIconShowModal = () => (
        <Block
            middle
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <IconCustom
                    name="calendar"
                    family={IconFamily.FONT_AWESOME}
                    size={23}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableWithoutFeedback>
        </Block>
    );

    const renderBusyCalendar = () => (
        <>
            {!listBusyBySelectedDate || listBusyBySelectedDate.length === 0 ? (
                <Block
                    middle
                    flex
                    style={{
                        marginBottom: 10
                    }}
                >
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                        size={14}
                    >
                        Đối tác rảnh vào ngày này, đặt hẹn nào!
                    </Text>
                </Block>
            ) : (
                <Block>
                    {renderListBusySection()}
                </Block>
            )}
        </>
    );

    const {
        params: {
            partner,
        }
    } = route;

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader size="large" />
                ) : (
                    <KeyboardAwareScrollView
                        style={{
                            width: NowTheme.SIZES.WIDTH_95,
                            alignSelf: 'center'
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {renderModal()}

                        {renderFormBlock(partner)}

                        {renderTotal()}
                    </KeyboardAwareScrollView>
                )}

            </>
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        marginVertical: 10
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});