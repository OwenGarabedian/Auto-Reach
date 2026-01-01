import { ScrollView, FlatList, StyleSheet, Text, View, ViewToken, Dimensions } from 'react-native';
import React, { use, useEffect, useRef, useState } from 'react';
import { ImageSliderData, ImageSliderDataType } from '../../data/sliderData';
import SliderItem from './sliderItem';
import Animated, { scrollTo, useAnimatedRef, useAnimatedScrollHandler, useDerivedValue, useSharedValue, runOnJS } from 'react-native-reanimated';
import Pagination from './pagination';

type SliderProps = {
    itemList: ImageSliderDataType[];
};

const { width } = Dimensions.get("screen");

const shouldAnimate = useSharedValue(true);

const Slider = ({itemList} : SliderProps) => {
    const scrollX = useSharedValue(0);
    const [paginationIndex, setPaginationIndex] = useState(0);
    const [data, setData] = useState<ImageSliderDataType[]>([]);
    const ref = useAnimatedRef<FlatList<any>>();
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const offset = useSharedValue(0);
    const shouldAnimate = useSharedValue(true);

    

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
        onMomentumEnd: (event) => {
            offset.value = event.contentOffset.x;

            const n = itemList.length;
            if (n === 0) return;
            const index = Math.round(offset.value / width);

            if (index < n) {
            const newOffset = (index + n) * width;
            offset.value = newOffset;
            scrollTo(ref, newOffset, 0, false);
        }
        // if we're in the last copy, jump to the middle copy silently
        else if (index >= n * 2) {
            const newOffset = (index - n) * width;
            offset.value = newOffset;
            scrollTo(ref, newOffset, 0, false);
        }
        },
    });

    // build tripled data and center on mount / when itemList changes
    useEffect(() => {
        if (!itemList || itemList.length === 0) return;
        const tripled = [...itemList, ...itemList, ...itemList];
        setData(tripled);

        const n = itemList.length;
        const centerOffset = n * width;
        offset.value = centerOffset;
        shouldAnimate.value = true;
    }, [itemList, offset, ref, shouldAnimate]);

    useEffect(() => {
        if(isAutoPlay == true) {
            interval.current = setInterval(() => {
                offset.value = offset.value + width;
            }, 7500);
        } else {
            if (interval.current) clearInterval(interval.current);
        }
        return () => {
            if (interval.current) clearInterval(interval.current);
        }
    }, [isAutoPlay, offset, width]);

    useDerivedValue(() => {
        scrollTo(ref, offset.value, 0, shouldAnimate.value);

        const n = itemList.length;
        if (n === 0) return;
        const index = Math.round(offset.value / width);

    });

const onViewableItemsChanged = ({viewableItems}: {viewableItems: ViewToken[]}) => {
    if( viewableItems[0]?.index !== undefined && viewableItems[0]?.index !== null ) {
        setPaginationIndex(viewableItems[0].index % itemList.length);
    }
}

const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
}

const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged}
]);

    return (
        <View>
            <View style={{height: 500}}>
            <Animated.FlatList
                ref={ref}
                data={data}
                renderItem={({ item, index }) => 
                    (<SliderItem item={item} index={index} scrollX={scrollX} />
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                initialScrollIndex={itemList.length}                       
                getItemLayout={(_, index) => ({ length: width, offset: width * index, index })} 
                initialNumToRender={Math.max(3, itemList.length)}       
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                onScrollBeginDrag={() => {
                    setIsAutoPlay(false)
                }}
                onScrollEndDrag={() => {
                    setIsAutoPlay(true)
                }}
            />
            </View>
            <Pagination
                items={itemList}
                paginationIndex={paginationIndex}
                scrollX={scrollX} 
            />
        </View>
    );
};

export default Slider;

const styles = StyleSheet.create({});