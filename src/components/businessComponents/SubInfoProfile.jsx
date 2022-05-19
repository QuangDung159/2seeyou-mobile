import { IconFamily, Theme } from '@constants/index';
import { calculateAge, getYear } from '@helpers/CommonHelpers';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import ProfileInfoItem from './ProfileInfoItem';

const {
    SIZES,
} = Theme;

export default function SubInfoProfile({ user }) {
    const handleInterestFromAPI = () => {
        if (!user?.interests) {
            return 'N/a';
        }

        const result = user.interests.split(', ');
        result.splice(result.length - 1, 1);
        return result.join(', ');
    };

    return (
        <View
            style={{
                width: SIZES.WIDTH_MAIN,
                alignSelf: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H3}
                    iconName={user.isMale ? 'male' : 'female'}
                    iconFamily={IconFamily.FONTISTO}
                    content={`${user.isMale ? 'Nam' : 'Nữ'}`}
                    iconSize={16}
                />
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H3}
                    iconName="birthday-cake"
                    iconFamily={IconFamily.FONT_AWESOME}
                    content={getYear(user.dob).toLowerCase() !== 'invalid date'
                        ? `${calculateAge(+getYear(user.dob))} tuổi`
                        : ''}
                    iconSize={16}
                />
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H3}
                    iconName="weight"
                    iconFamily={IconFamily.FONT_AWESOME_5}
                    content={`${user.weight} kg`}
                    iconSize={16}
                />
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H3}
                    iconName="human-male-height"
                    iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    content={`${user.height} cm`}
                    iconSize={16}
                />
            </View>
            <ProfileInfoItem
                fontSize={SIZES.FONT_H3}
                iconName="home"
                iconFamily={IconFamily.FONT_AWESOME_5}
                content={`${user.homeTown || 'N/a'}`}
                iconSize={16}
            />
            <ProfileInfoItem
                fontSize={SIZES.FONT_H3}
                iconName="badminton"
                iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                content={`${handleInterestFromAPI()}`}
                iconSize={16}
                containerStyle={{ alignItems: 'flex-start' }}
                iconContainerStyle={{
                    marginTop: 6
                }}
                contentTextStyle={{ width: SIZES.WIDTH_90 - 25 }}
            />
        </View>
    );
}

SubInfoProfile.propTypes = {
    user: PropTypes.object.isRequired
};
