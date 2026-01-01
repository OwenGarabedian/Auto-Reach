import { Dimensions, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ImageSliderDataType } from '../../data/sliderData';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { Extrapolate, Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';


type SliderItemProps = {
    item: ImageSliderDataType;
    index: number;
    scrollX: SharedValue<number>;
};

const { width } = Dimensions.get('screen');

const SliderItem = ({ item, index, scrollX }: SliderItemProps) => {

    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [-width * 0.2, 0, width * 0.2],
                        Extrapolation.CLAMP
                    )
                },
                {
                scale: interpolate(
                    scrollX.value,
                    [(index - 1) * width, index * width, (index + 1) * width],
                    [0.9, 1, 0.9],
                    Extrapolation.CLAMP
                ),
                }
            ]
        };
    });

    return (
        <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
            <Image source={item.image} style={styles.image} />
            <LinearGradient
                colors={['transparent', 'transparent']}
                style={styles.background}
            >
                <View>
                    <TouchableOpacity style={styles.icon}>
                        <Ionicons name="heart-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 10 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}
export default SliderItem;

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        width: width,
    },
    background: {
        position: 'absolute',
        width: 300,
        height: 500,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-between',
    },
    image: {
        width: 300,
        height: 500,
        borderRadius: 20,
    },
    icon: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 5,
        borderRadius: 30,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '600',
        letterSpacing: 1.5,
    },
    description: {
        color: 'gray',
        fontSize: 12,
        letterSpacing: 1.2,
    },
});