/* eslint-disable no-unused-vars */
import {
    CustomButton, CustomInput, CustomModal, CustomText, OptionItem
} from '@components/uiComponents';
import { LOCATION } from '@constants/Common';
import { GENDER_ARRAY } from '@constants/Gender';
import Interests from '@constants/Interests';
import Theme from '@constants/Theme';
import CommonHelpers, { arrayUnique } from '@helpers/CommonHelpers';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function FilterModal({
    modalFilterVisible, setModalFilterVisible, setModalLocationVisible, hometownSelectedIndex, setHometownSelectedIndex
}) {
    const defaultFilter = {
        ageFrom: 18,
        ageTo: 30,
        feeFrom: 1250,
        feeTo: 10000,
        rating: 0,
        from: 1,
        isMale: false,
    };

    const [filterObj, setFilterObj] = useState(defaultFilter);
    const [feeFromDisplay, setFeeFromDisplay] = useState(CommonHelpers.formatCurrency(filterObj.feeFrom));
    const [feeToDisplay, setFeeToDisplay] = useState(CommonHelpers.formatCurrency(filterObj.feeTo));
    const [listInterestSelected, setListInterestSelected] = useState(Interests);
    const [listGenderSelected, setListGenderSelected] = useState(GENDER_ARRAY);

    useEffect(
        () => {
            initFilterFromLocal();
        }, []
    );

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

    const initFilterFromLocal = () => {
        getListInterestFromLocal();
        getListGenderFromLocal();
        getFilterFromLocal();
    };

    const getFilterFromLocal = async () => {
        let filterObjLocal = await SecureStore.getItemAsync('FILTER');
        if (filterObjLocal) {
            filterObjLocal = JSON.parse(filterObjLocal);
            setHometownSelectedIndex(filterObjLocal.from);
            setFilterObj(filterObjLocal);
        }
    };

    const getListInterestFromLocal = async () => {
        let listInterestFromLocal = await SecureStore.getItemAsync('LIST_INTEREST_FILTER');
        if (listInterestFromLocal) {
            listInterestFromLocal = JSON.parse(listInterestFromLocal);
            listInterestFromLocal = [...listInterestFromLocal, ...Interests];
            setListInterestSelected(arrayUnique(listInterestFromLocal, 'value'));
        }
    };

    const getListGenderFromLocal = async () => {
        const listGenderFromLocal = await SecureStore.getItemAsync('LIST_GENDER_FILTER');
        if (listGenderFromLocal) {
            setListGenderSelected(JSON.parse(listGenderFromLocal));
        }
    };

    const renderHometownButton = () => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: SIZES.WIDTH_90,
                marginBottom: 10
            }}
        >
            <CustomText
                text="Nơi ở hiện tại:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                }}
            />
            <CustomButton
                onPress={() => {
                    setModalFilterVisible(false);
                    setModalLocationVisible(true);
                }}
                type="active"
                label={LOCATION[hometownSelectedIndex]?.value}
                buttonStyle={{
                    backgroundColor: COLORS.BASE,
                    borderColor: COLORS.ACTIVE,
                    width: SIZES.WIDTH_BASE * 0.6
                }}
                labelStyle={{
                    color: COLORS.DEFAULT
                }}
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
                    marginBottom: 3
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
                    marginBottom: 3
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
                    onChangeText={(input) => setFilterObj({ ...filterObj, ageTo: +input })}
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
            marginVertical: 10,
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
                    key={listGenderSelected[0].value}
                    item={listGenderSelected[0]}
                    index={0}
                    handlePressItem={() => {
                        handlePressGender(0);
                    }}
                    isSelected={listGenderSelected[0].selected}
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
                    key={listGenderSelected[1].value}
                    item={listGenderSelected[1]}
                    index={1}
                    handlePressItem={() => {
                        handlePressGender(1);
                    }}
                    isSelected={listGenderSelected[1].selected}
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
                    marginBottom: 3
                }}
                text="Phí mời (xu/phút):"
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
                    onChangeText={(input) => {
                        setFilterObj({ ...filterObj, feeFrom: +input });
                        setFeeFromDisplay(input);
                    }}
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
                    onChangeText={(input) => {
                        setFilterObj({ ...filterObj, feeTo: +input });
                        setFeeToDisplay(input);
                    }}
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

    const renderFilterModal = useCallback(
        () => (
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
                            {renderHometownButton()}
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
                            {/* <CustomButton
                                onPress={() => {
                                    console.log('genderArrayDefault :>> ', genderArrayDefault);
                                    setFilterObj(defaultFilter);
                                    setHometownSelectedIndex(defaultFilter.from);
                                    setListInterestSelected(Interests);
                                    setListGenderSelected(genderArrayDefault);
                                }}
                                type="default"
                                label="Mặc định"
                                buttonStyle={{
                                    width: SIZES.WIDTH_BASE * 0.44
                                }}
                            /> */}
                            <CustomButton
                                onPress={() => {
                                    setModalFilterVisible(false);
                                    SecureStore.setItemAsync('FILTER',
                                        JSON.stringify({ ...filterObj, from: hometownSelectedIndex }));
                                    SecureStore.setItemAsync('LIST_GENDER_FILTER', JSON.stringify(listGenderSelected));
                                    SecureStore.setItemAsync('LIST_INTEREST_FILTER',
                                        JSON.stringify(listInterestSelected));
                                }}
                                type="active"
                                label="Lọc"
                                buttonStyle={{
                                    width: SIZES.WIDTH_BASE * 0.44
                                }}
                            />
                        </View>
                    </>
                )}
            />
        ), [filterObj,
            listGenderSelected,
            listInterestSelected,
            modalFilterVisible,
            feeToDisplay,
            feeFromDisplay
        ]
    );

    return (
        <>
            {renderFilterModal()}
        </>
    );
}
