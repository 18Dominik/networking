import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // Updated to use CameraView and useCameraPermissions
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScannerPage = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions(); // Using useCameraPermissions hook

  // Function to handle scanned data
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    try {
      const isValidJson = (str) => {
        try {
          JSON.parse(str);
          return true;
        } catch {
          return false;
        }
      };

      if (isValidJson(data)) {
        const profileData = JSON.parse(data); // Parse the JSON data from the QR code
        await AsyncStorage.setItem('name', profileData.name);
        await AsyncStorage.setItem('surname', profileData.surname);
        await AsyncStorage.setItem('department', profileData.department);
        await AsyncStorage.setItem('description', profileData.description);

        Alert.alert('Success', 'Profile data loaded successfully!');
        navigation.navigate('ProfilePage');
      } else {
        Alert.alert('Error', 'Scanned data is not valid JSON.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data from QR code.');
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

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} // QR code scanner function
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
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
