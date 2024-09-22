import React, { useState, useEffect } from 'react';
import { View, useColorScheme, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';  // Correct import for React Native QR code

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  // Detect whether dark mode or light mode is active
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('name');
      const storedSurname = await AsyncStorage.getItem('surname');
      const storedDepartment = await AsyncStorage.getItem('department');
      const storedDescription = await AsyncStorage.getItem('description');
      if (storedName !== null) setName(storedName);
      if (storedSurname !== null) setSurname(storedSurname);
      if (storedDepartment !== null) setDepartment(storedDepartment);
      if (storedDescription !== null) setDescription(storedDescription);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data.');
    }
  };

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('surname', surname);
      await AsyncStorage.setItem('department', department);
      await AsyncStorage.setItem('description', description);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile data.');
    }
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.label, isDarkMode ? styles.darkText : styles.lightText]}>Name:</Text>
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor={isDarkMode ? '#888888' : '#888'}
      />

      <Text style={[styles.label, isDarkMode ? styles.darkText : styles.lightText]}>Surname:</Text>
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        value={surname}
        onChangeText={setSurname}
        placeholder="Enter your surname"
        placeholderTextColor={isDarkMode ? '#888888' : '#888'}
      />

      <Text style={[styles.label, isDarkMode ? styles.darkText : styles.lightText]}>Department:</Text>
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        value={department}
        onChangeText={setDepartment}
        placeholder="Enter your department"
        placeholderTextColor={isDarkMode ? '#888888' : '#888'}
      />

      <Text style={[styles.label, isDarkMode ? styles.darkText : styles.lightText]}>Description:</Text>
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter a short description"
        placeholderTextColor={isDarkMode ? '#888888' : '#888'}
      />

      <View style={styles.buttonContainer}>
        <Button color='#1c69d4' title="Save Profile" onPress={saveProfileData} />
      </View>

      <View style={styles.buttonContainer}>
        <Button color='#1c69d4' title="Share via QR Code" onPress={toggleQRCode} />
      </View>

      {showQRCode && (
        <QRCode
          value={JSON.stringify({ name, surname, department, description })}
          size={200}
        />
      )}
    </View>
  );
};

// Styles for Dark and Light Mode
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  lightInput: {
    borderColor: 'gray',
    backgroundColor: '#fff',
    color: '#000',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#333',
    color: '#fff',
  },
});

export default ProfilePage;
