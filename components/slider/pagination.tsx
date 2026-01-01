import { StyleSheet, View, Dimensions } from 'react-native';
import React from 'react';  
import { ImageSliderDataType } from '../../data/sliderData';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type PaginationProps = {
    items: ImageSliderDataType[];
    paginationIndex: number;
    scrollX: SharedValue<number>;
}

const { width } = Dimensions.get("screen");

const Pagination = ({items, paginationIndex, scrollX}: PaginationProps) => {
    const centerOffset = items.length * width;

    return (
        <View style={styles.container}>
            {items.map((_, index) => {
                const pgAnimationStyle = useAnimatedStyle(() => {
                    const dotWidth = interpolate(
                        scrollX.value,
                        [
                            centerOffset + (index - 1) * width,
                            centerOffset + index * width,
                            centerOffset + (index + 1) * width
                        ],
                        [8, 20, 8],
                        Extrapolation.CLAMP
                    );
                    return {
                        width: dotWidth,
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            pgAnimationStyle,
                            { backgroundColor: paginationIndex === index ? '#222' : '#aaa' }
                        ]}
                    />
                );
            })}
        </View>
    );
};

export default Pagination;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
    },
    dot: {
        backgroundColor: '#aaa',
        height: 8,
        width: 8,
        marginHorizontal: 2,
        borderRadius: 8,
    },
});