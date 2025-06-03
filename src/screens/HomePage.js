import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const buttons = [
  {icon: 'camera', label: 'Fotoğraf Çek', route: 'CameraScreen'},
  {icon: 'image', label: 'Galeriden Seç', route: 'GalleryScreen'},
  {icon: 'comment-medical', label: 'Nasıl Korunurum?', route: 'MedicalScreen'},
  {icon: 'book-medical', label: 'Bilgilendirme', route: 'InformationScreen'},
];

export default function HomePage() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#E6F7F0', '#A0D6D2']}
      style={styles.container}
      start={{x: 0.0, y: 0.0}}
      end={{x: 1.0, y: 1.0}}>
      <LottieView
        source={require('../assets/Animation.json')}
        autoPlay
        loop
        style={styles.lottieBackground}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Merhaba,</Text>
        <Text style={styles.subtitle}>Sana nasıl yardımcı olabilirim?</Text>

        <View style={styles.gridContainer}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.gridItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(btn.route)}>
              <FontAwesome name={btn.icon} size={40} color="#fff" />
              <Text style={styles.buttonText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subtitle}>
          Bu uygulamada 10 farklı deri lezyonunun tespiti yapılmaktadır.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  lottieBackground: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    top: 0,
    left: 0,
    zIndex: -1,
  },
  title: {
    marginTop: SCREEN_HEIGHT / 2.4,
    fontSize: 36,
    fontWeight: '700',
    color: '#2F4F4F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2F4F4F',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  gridItem: {
    width: SCREEN_WIDTH / 2.4,
    height: SCREEN_WIDTH / 3.2,
    backgroundColor: '#008b8b',
    margin: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 9, height: 9},
    shadowOpacity: 0.33,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});
