import {
    CustomButton, CustomInput, CustomModal, CustomText, OptionItem
} from '@components/uiComponents';
import Gender from '@constants/Gender';
import Interests from '@constants/Interests';
import Theme from '@constants/Theme';
import CommonHelpers from '@helpers/CommonHelpers';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function FilterModal({ modalFilterVisible, setModalFilterVisible }) {
    const [filterObj, setFilterObj] = useState({
        ageFrom: 20,
        ageTo: 25,
        feeFrom: 1250,
        feeTo: 2000,
        rating: 4.5,
        from: 'Hồ Chí Minh',
        isMale: true,
    });
    const [feeFromDisplay, setFeeFromDisplay] = useState(CommonHelpers.formatCurrency(filterObj.feeFrom));
    const [feeToDisplay, setFeeToDisplay] = useState(CommonHelpers.formatCurrency(filterObj.feeTo));
    const [listInterestSelected, setListInterestSelected] = useState(Interests);
    const [listGenderSelected, setListGenderSelected] = useState(Gender.GENDER_ARRAY);

    const handlePressInterest = (index) => {
        const list = [...listInterestSelected];
        list[index].selected = !list[index].selected;
        setListInterestSelected(list);
    };

    const handlePressGender = (index) => {
        const list = [...listGenderSelected];
        list[index].selected = !list[index].selected;
        setListGenderSelected(list);
    };

    const renderInputHometown = () => (
        <View
            style={{
                marginBottom: 10
            }}
        >
            <CustomText
                text="Nơi sinh sống:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                }}
            />
            <CustomInput
                value={filterObj.from}
                onChangeText={(input) => setFilterObj({ ...filterObj, from: input })}
                containerStyle={{
                    width: SIZES.WIDTH_90,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                inputStyle={{ width: SIZES.WIDTH_90 }}
                label=""
                maxLength={35}
            />
        </View>
    );

    const renderOptionInterests = () => (
        <View
            style={{
                alignItems: 'flex-start',
                width: SIZES.WIDTH_90,
                marginBottom: 10
            }}
        >
            <CustomText
                text="Sở thích:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    flexWrap: 'wrap'
                }}
            >
                {listInterestSelected.map((item, index) => (
                    <OptionItem
                        key={item.value}
                        item={item}
                        index={index}
                        handlePressItem={() => {
                            handlePressInterest(index);
                        }}
                        isSelected={item.selected}
                        containerStyle={{
                            marginBottom: 5
                        }}
                    />
                ))}
            </View>
        </View>
    );

    const renderInputAge = () => (
        <View
            style={{
                marginBottom: 10
            }}
        >
            <CustomText
                style={{
                    color: COLORS.ACTIVE,
                }}
                text="Độ tuổi:"
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.WIDTH_90,
                    alignItems: 'center'
                }}
            >
                <CustomInput
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.39 }}
                    label=""
                    onChangeText={(input) => setFilterObj({ ...filterObj, ageFrom: input })}
                    value={filterObj.ageFrom}
                    keyboardType="number-pad"
                    maxLength={2}
                />
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                    }}
                    text="đến"
                />
                <CustomInput
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.39 }}
                    label=""
                    onChangeText={(input) => setFilterObj({ ...filterObj, ageTo: input })}
                    value={filterObj.ageTo}
                    keyboardType="number-pad"
                    maxLength={2}
                />
            </View>
        </View>
    );

    const renderGender = () => (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
        }}
        >
            <CustomText
                style={{
                    color: COLORS.ACTIVE,
                }}
                text="Giới tính:"
            />
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.6,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <OptionItem
                    key={Gender.GENDER_ARRAY[0].value}
                    item={Gender.GENDER_ARRAY[0]}
                    index={0}
                    handlePressItem={() => {
                        handlePressGender(0);
                    }}
                    isSelected={Gender.GENDER_ARRAY[0].selected}
                    containerStyle={{
                        width: '49%',
                        marginBottom: 0
                    }}
                    titleStyle={{
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                />
                <OptionItem
                    key={Gender.GENDER_ARRAY[1].value}
                    item={Gender.GENDER_ARRAY[1]}
                    index={1}
                    handlePressItem={() => {
                        handlePressGender(1);
                    }}
                    isSelected={Gender.GENDER_ARRAY[1].selected}
                    containerStyle={{
                        width: '49%',
                        marginBottom: 0
                    }}
                    titleStyle={{
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                />
            </View>
        </View>
    );

    const renderFee = () => (
        <View
            style={{
                marginBottom: 10
            }}
        >
            <CustomText
                style={{
                    color: COLORS.ACTIVE,
                }}
                text="Phí mời hẹn (xu/phút):"
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.WIDTH_90,
                    alignItems: 'center'
                }}
            >
                <CustomInput
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.39 }}
                    label=""
                    onChangeText={(input) => setFilterObj({ ...filterObj, feeFrom: +input })}
                    value={feeFromDisplay}
                    keyboardType="number-pad"
                    onEndEditing={
                        (e) => {
                            setFeeFromDisplay(CommonHelpers.formatCurrency(e.nativeEvent.text));
                        }
                    }
                    onFocus={() => {
                        setFeeFromDisplay(filterObj.feeFrom);
                    }}
                />
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                    }}
                    text="đến"
                />
                <CustomInput
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.39 }}
                    label=""
                    onChangeText={(input) => setFilterObj({ ...filterObj, feeTo: +input })}
                    value={feeToDisplay}
                    keyboardType="number-pad"
                    onEndEditing={
                        (e) => {
                            setFeeToDisplay(CommonHelpers.formatCurrency(e.nativeEvent.text));
                        }
                    }
                    onFocus={() => {
                        setFeeToDisplay(filterObj.feeTo);
                    }}
                />
            </View>
        </View>
    );

    const renderFilterModal = () => (
        <CustomModal
            modalVisible={modalFilterVisible}
            renderContent={() => (
                <>
                    <Text
                        style={{
                            fontFamily: TEXT_BOLD,
                            marginBottom: 15,
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT
                        }}
                    >
                        Bộ lọc
                    </Text>
                    <View
                        style={{
                            width: SIZES.WIDTH_90,
                            marginBottom: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {renderGender()}
                        {renderInputHometown()}
                        {renderInputAge()}
                        {renderFee()}
                        {renderOptionInterests()}
                    </View>

                    <View
                        style={{
                            width: SIZES.WIDTH_90,
                            marginBottom: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                setModalFilterVisible(false);
                            }}
                            type="default"
                            label="Huỷ"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.44
                            }}
                        />
                        <CustomButton
                            onPress={() => {
                                setModalFilterVisible(false);
                            }}
                            type="active"
                            label="Xác nhận"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.44
                            }}
                        />
                    </View>
                </>
            )}
        />
    );

    return (
        <>{renderFilterModal()}</>
    );
}
