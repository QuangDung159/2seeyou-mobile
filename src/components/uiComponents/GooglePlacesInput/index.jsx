/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { MAP_API_KEY } from '@env';
import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { NowTheme } from '../../../constants';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function GooglePlacesInput({ onChangeAddress, addressInput, label }) {
    const ref = useRef();

    useEffect(() => {
        ref.current.setAddressText(addressInput);
    }, []);

    const renderGooglePlacesInput = () => (
        <View
            style={{
                zIndex: 99,
            }}
        >
            {label && (
                <Text
                    style={{
                        fontFamily: MONTSERRAT_REGULAR,
                        fontSize: SIZES.FONT_H3,
                        color: COLORS.ACTIVE,
                        marginVertical: 10
                    }}
                >
                    {label}
                </Text>
            )}

            <GooglePlacesAutocomplete
                ref={ref}
                onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                    onChangeAddress(details);
                }}
                query={{
                    key: MAP_API_KEY,
                    language: 'vi',
                }}
                fetchDetails
                styles={{
                    textInputContainer: {
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.INPUT,
                        width: SIZES.WIDTH_BASE * 0.9,
                        marginBottom: 10,
                    },
                    textInput: {
                        height: 80,
                        color: COLORS.HEADER,
                        fontSize: SIZES.FONT_H3,
                        fontFamily: MONTSERRAT_REGULAR
                    },
                }}
                textInputProps={{
                    multiline: true,
                }}
                getDefaultValue={() => addressInput || 'asd'}
                renderRow={(rowData) => {
                    const title = rowData.structured_formatting.main_text;
                    const address = rowData.structured_formatting.secondary_text;
                    return (
                        <View>
                            <Text style={{
                                fontSize: SIZES.FONT_H3,
                                fontFamily: MONTSERRAT_REGULAR,
                                color: COLORS.HEADER
                            }}
                            >
                                {title}
                            </Text>
                            <Text style={{
                                fontSize: SIZES.FONT_H4,
                                fontFamily: MONTSERRAT_REGULAR,
                                color: COLORS.HEADER
                            }}
                            >
                                {address}
                            </Text>
                        </View>
                    );
                }}
            />
        </View>
    );
    return (
        <>
            {renderGooglePlacesInput()}
        </>
    );
}
