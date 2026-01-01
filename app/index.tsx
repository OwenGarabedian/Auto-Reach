import {Dimensions, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import { Link, router } from 'expo-router';
import Slider from '../components/slider/slider';
import { ImageSliderData } from '../data/sliderData';

const { width } = Dimensions.get("screen");

const SplashScreen = () => {

    const handleLoginPress = () => {
        // Navigation is handled by the router from expo-router (use .push to navigate)
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Welcome to AutoReach</Text>
                <Text style={styles.discription}>
                    Your gateway to seamless automotive services. Explore, connect, and drive with confidence.
                </Text>
            </View>
            <Slider itemList={ImageSliderData}/>

            <View>
                <Pressable
                    onPress={handleLoginPress}
                    style={({pressed}) => pressed ? styles.pressedButton : styles.buttonNormal}
                >
                    <Text style={styles.buttonText}>Build Now</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 10,
        textAlign: 'center',
    },
    discription: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    buttonNormal: {
        backgroundColor: '#779cc3ff',
        justifyContent: 'center',
        width: width * .4,
        height: 50,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#868686ff',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.35, 
                shadowRadius: 15,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    pressedButton: {
        backgroundColor: '#6a9bcdff',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        width: width * .4,
        height: 48,
        ...Platform.select({
            ios: {
                shadowColor: '#424242ff',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.4, 
                shadowRadius: 15,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 1.2,
    },
});