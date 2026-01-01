import { ImageSourcePropType } from "react-native";

export type ImageSliderDataType = {
    title: string;
    description: string;
    image: ImageSourcePropType;
};

export const ImageSliderData = [
    {
        title: '1',
        description: 'This is some leaves.',
        image: require('../assets/splashScreen/leaf.jpg'),
    },
    {
        title: '2',
        description: 'This is some vines.',
        image: require('../assets/splashScreen/vines.jpg'),
    },
    {
        title: '3', 
        description: 'This is a sunset.',
        image: require('../assets/splashScreen/sunset.jpg'),
    },
];