/*import React, {useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {loadModel, runModelOnImage} from '../model/tfliteHelper';

export default function CameraScreen({navigation}) {
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);

  const openCamera = async () => {
    const response = await launchCamera({mediaType: 'photo'});
    if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
      const image = response.assets[0];
      setPhoto(image);

      try {
        await loadModel();
        const output = await runModelOnImage(image.uri);
        console.log('Model sonucu:', output);
        setResult(output);
      } catch (err) {
        console.error('Model hatası:', err);
        Alert.alert('Hata', 'Model çalıştırılamadı.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Fotoğraf Çek</Text>
      </TouchableOpacity>

      {photo && (
        <>
          <Image source={{uri: photo.uri}} style={styles.image} />
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
});  */

import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

export default function CameraScreen({navigation}) {
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);

  const openCamera = async () => {
    try {
      const response = await launchCamera({mediaType: 'photo'});
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets &&
        response.assets.length > 0
      ) {
        const captured = response.assets[0];
        setPhoto(captured);

        const formData = new FormData();
        formData.append('image', {
          uri: captured.uri,
          name: 'photo.jpg',
          type: captured.type || 'image/jpeg',
        });

        const flaskURL = 'http://192.168.1.35:5050/predict';

        const res = await fetch(flaskURL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const json = await res.json();
        if (json.result) {
          setResult(json.result[0]);
        } else {
          Alert.alert('Hata', 'Modelden sonuç alınamadı.');
        }
      }
    } catch (error) {
      console.error('Tahmin hatası:', error);
      Alert.alert('Hata', 'Fotoğraf çekme veya tahmin sırasında hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Fotoğraf Çek</Text>
      </TouchableOpacity>

      {photo && (
        <>
          <Image source={{uri: photo.uri}} style={styles.image} />
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
