import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'; 

export default function MedicalScreen({ navigation }) {
  const source = {
    uri: 'https://turkdermatoloji.org.tr/media/files/file/GUNESTEN_KORUNMA.pdf',
    cache: true,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
           <Text style={styles.headerTitle}>Korunma</Text>
           <View></View>
     </View>

      <Pdf
        source={source}
        style={styles.pdf}
        onError={(error) => {
          console.log(error);
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 90,
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
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

