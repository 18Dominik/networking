import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // Updated to use CameraView and useCameraPermissions
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfilePage from './profile';

const ScannerPage = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions(); // Using useCameraPermissions hook

  // Function to handle scanned data
  const handleBarCodeScanned = async({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    try {
      // Parse the scanned data as JSON assuming it has the correct structure
      const parsedData = JSON.parse(data);
      const { namep, surnamep, departmentp, descriptionp } = parsedData;

      // Ensure that all the expected fields are present
      if (namep && surnamep && departmentp && descriptionp) {
        // Create the JSON object to store
        const barcodeData = {
          namep,
          surnamep,
          departmentp,
          descriptionp,
        };

        // Save JSON data to AsyncStorage
        await AsyncStorage.setItem('scannedBarcode', JSON.stringify(barcodeData));

        Alert.alert('Success', 'Profile data saved successfully!');
        console.log('Saved Barcode Data:', barcodeData);
      } else {
        Alert.alert('Error', 'Invalid data format in the scanned code.');
        console.log('Invalid JSON structure', parsedData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to parse scanned data.');
      console.error('Failed to save barcode data:', error);
    }
  };

   // Function to retrieve and display saved JSON data
   const retrieveBarcodeData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('scannedBarcode');
      if (jsonValue != null) {
        const barcodeData = JSON.parse(jsonValue);
        console.log('Retrieved Barcode Data:', barcodeData);
      } else {
        console.log('No data found');
      }
    } catch (e) {
      console.error('Failed to retrieve data', e);
    }
  };



  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }
      }
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});



export default ScannerPage;
