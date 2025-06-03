import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import axios from 'axios';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

export default function InformationScreen({navigation}) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://192.168.1.35:3000/api/korunma') 
      .then(response => {
        
        const cleanedContent = response.data.content
          .split('\n') 
          .filter(line => line.trim() !== '') 
          .slice(2)
          .map((line, index) => {
            if (index === 0) {
             
              return line;
            } else {
              
              return `➜ ${line}`;
            }
          })
          .join('\n\n'); 

        setContent(cleanedContent); 
        setLoading(false);
      })
      .catch(error => {
        console.error('Veri çekme hatası:', error);
        setContent('Veri alınamadı.');
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bilgilendirme</Text>
        <View></View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Deri Kanseri İçin Risk Altında mısınız?
        </Text>
        <Image
          source={require('../assets/deri.jpg')} 
          style={styles.image}
        />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#008b8b"
            style={styles.loader}
          />
        ) : (
          <Text style={styles.text}>{content}</Text>
        )}
        <Text style={styles.title}>
          {' '}
          Daha fazlası için: https://www.derikanseri.org/"{' '}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008b8b',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#008b8b',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 20,
    marginBottom: 10,
    width: '50%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  header: {
    height: 90,
    width: '100%',
    backgroundColor: '#006d77',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 6,
    paddingBottom: 20, // Son padding
    width: '100%',
  },
});
