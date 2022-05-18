import { CustomButton, CustomModal } from '@components/uiComponents';
import { LOCATION_HCMC } from '@constants/Common';
import Theme from '@constants/Theme';
import { getLocationIndexByName } from '@helpers/CommonHelpers';
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

export default function LocationModal({
    modalLocationVisible, setModalLocationVisible, hometownSelectedIndex,
    setHometownSelectedIndex, setModalFilterVisible = null
}) {
    const onChangeLocation = (data) => {
        const locationIndex = getLocationIndexByName(data);

        if (locationIndex === -1) {
            return;
        }
        setHometownSelectedIndex(locationIndex);
    };

    const handleGetListLocationName = () => {
        const listLocationName = [];
        LOCATION_HCMC.forEach((locationItem) => {
            listLocationName.push(locationItem.value);
        });

        return listLocationName;
    };

    const renderLocationPicker = () => (
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
                dataSource={handleGetListLocationName()}
                selectedIndex={hometownSelectedIndex}
                onValueChange={(data) => {
                    onChangeLocation(data);
                }}
                wrapperHeight={280}
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
            <View
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 119,
                    height: 40,
                    width: '100%',
                    borderColor: COLORS.ACTIVE,
                    borderWidth: 0.5,
                    borderRadius: 20
                }}
            />
        </View>
    );

    const renderLocationModal = () => (
        <CustomModal
            modalVisible={modalLocationVisible}
            renderContent={() => (
                <>
                    {renderLocationPicker()}
                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                setModalLocationVisible(false);
                                setModalFilterVisible && setModalFilterVisible(true);
                            }}
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
            {renderLocationModal()}
        </>
    );
}
