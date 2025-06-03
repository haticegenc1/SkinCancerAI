/*import React, {useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {loadModel, runModelOnImage} from '../model/tfliteHelper';


export default function GalleryScreen({navigation}) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const openGallery = async () => {
    try {
      const response = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1});
      if (!response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);

        await loadModel();
        const output = await runModelOnImage(selected.uri);
        console.log('Model sonucu:', output);
        setResult(output);
      }

    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Hata', 'Görüntü seçilemedi veya model hatası oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openGallery}>
        <Text style={styles.buttonText}>Galeriden Seç</Text>
      </TouchableOpacity>

      {image && (
        <>
          <Image source={{uri: image.uri}} style={styles.image} />
          <Text style={{marginTop: 10}}>
            {result ? `Sonuç: ${result[0]?.label} (${(result[0]?.confidence * 100).toFixed(1)}%)` : 'Analiz ediliyor...'}
          </Text>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#888'}]}
        onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {
    backgroundColor: '#008b8b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});*/

import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

export default function GalleryScreen({navigation}) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const openGallery = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets &&
        response.assets.length > 0
      ) {
        const selected = response.assets[0];
        setImage(selected);

        // Flask sunucunun IP adresini gir
        const formData = new FormData();
        formData.append('image', {
          uri: selected.uri,
          name: 'image.jpg',
          type: selected.type || 'image/jpeg',
        });

        const flaskURL = 'http://192.168.1.35:5050/predict'; // telefonum için MacBook'un yerel IP adresini yazmalıyız: const flaskURL = 'http://192.168.1.41:5000/predict'; ve pc ve telefon aynı wifide olmalı

        const res = await fetch(flaskURL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const json = await res.json();
        if (json.result) {
          setResult(json.result[0]); // en yüksek tahmini al
        } else {
          Alert.alert('Hata', 'Modelden sonuç alınamadı.');
        }
      }
    } catch (error) {
      console.error('Tahmin hatası:', error);
      Alert.alert('Hata', 'İşlem sırasında hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openGallery}>
        <Text style={styles.buttonText}>Galeriden Seç</Text>
      </TouchableOpacity>

      {image && (
        <>
          <Image source={{uri: image.uri}} style={styles.image} />
          <Text style={{marginTop: 10}}>
            {result
              ? `Sonuç: ${result.label} (%${(result.confidence * 100).toFixed(
                  1,
                )})`
              : 'Analiz ediliyor...'}
          </Text>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#888'}]}
        onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {
    backgroundColor: '#008b8b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
