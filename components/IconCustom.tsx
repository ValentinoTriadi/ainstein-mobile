import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';

const ICONS: Record<string, ImageSourcePropType> = {
  book_ribbon: require('@/assets/images/icons/BookRibbon.png'),
  wand_shine: require('@/assets/images/icons/forum.png'),
  book_2: require('@/assets/images/icons/Book2.png'),
  account_circle: require('@/assets/images/icons/ProfileCircle.png'),
};

export function IconCustom({
  name,
  size = 24,
  tintColor,
}: {
  name: keyof typeof ICONS;
  size?: number;
  tintColor?: string;
}) {
  return (
    <Image
      source={ICONS[name]}
      style={{
        width: size,
        height: size,
        tintColor: tintColor, // important for color switching
      }}
      resizeMode="contain"
    />
  );
}
