import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScannerPage = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
												   

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    try {
      // Basic JSON validation check
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

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
													
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'], // Only scan QR codes
        }}
						  
      />
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
});

export default ScannerPage;
