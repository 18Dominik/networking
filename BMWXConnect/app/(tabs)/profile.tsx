import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');

  // Load profile data from AsyncStorage when the component mounts
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

  // Save profile data to AsyncStorage
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Surname:</Text>
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
        placeholder="Enter your surname"
      />

      <Text style={styles.label}>Department:</Text>
      <TextInput
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
        placeholder="Enter your department"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter a short description"
      />

      <Button color='#1c69d4' title="Save Profile" onPress={saveProfileData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default ProfilePage;
