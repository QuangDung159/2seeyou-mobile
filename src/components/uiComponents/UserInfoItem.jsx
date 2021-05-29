import { Block, Text } from 'galio-framework';
import React from 'react';
import { NowTheme } from '../../constants';
import IconCustom from './IconCustom';

export default function UserInfoItem({
    value, icon: {
        name, family, color, size
    }
}) {
    return (
        <Block
            row
            style={{
                alignSelf: 'center',
                marginBottom: 10
            }}
        >
            <Block
                flex={1}
            >
                <IconCustom
                    name={name}
                    family={family}
                    color={color}
                    size={size}
                />
            </Block>
            <Block
                row
                flex={7}
            >
                <Text
                    size={NowTheme.SIZES.FONT_H2}
                    color={NowTheme.COLORS.DEFAULT}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    {value || 'N/a'}
                </Text>
            </Block>
        </Block>
    );
}