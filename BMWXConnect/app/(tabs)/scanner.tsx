import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera'; // Correct import for Camera
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScannerPage = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const profileData = JSON.parse(data); // Parse the JSON data from the QR code

      // Save the data into AsyncStorage
								  
      await AsyncStorage.setItem('name', profileData.name);
      await AsyncStorage.setItem('surname', profileData.surname);
      await AsyncStorage.setItem('department', profileData.department);
      await AsyncStorage.setItem('description', profileData.description);

      Alert.alert('Success', 'Profile data loaded successfully!');
      navigation.navigate('ProfilePage'); // Navigate back to the profile page
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data from QR code.');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Camera component for scanning QR codes */}
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'], // Only scan QR codes
        }}
        ref={setCameraRef}
      />
      {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScannerPage;
