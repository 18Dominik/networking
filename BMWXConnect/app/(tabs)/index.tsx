import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {

  // Detect whether dark mode or light mode is active
  const colorScheme = useColorScheme();
  

  // Conditional styles based on the color scheme
  const isDarkMode = colorScheme === 'dark';

  const [colleagues, setColleagues] = useState([]);
  const [filteredColleagues, setFilteredColleagues] = useState([]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [protocol, setProtocol] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchColleagues();
  }, []);

  const fetchColleagues = async () => {
    try {
      const colleaguesString = await AsyncStorage.getItem('colleagues');
      const colleagues = colleaguesString ? JSON.parse(colleaguesString) : [];
      setColleagues(colleagues);
      setFilteredColleagues(colleagues);
    } catch (error) {
      console.error('Failed to fetch colleagues:', error);
    }
  };

  const saveColleague = async () => {
    try {
      let updatedColleagues;
      if (editingId) {
        // Edit colleague
        updatedColleagues = colleagues.map(colleague =>
          colleague._id === editingId
            ? { _id: editingId, name, surname, department, description, protocol }
            : colleague
        );
        setEditingId(null);
      } else {
        // Add colleague
        const newColleague = { _id: Date.now().toString(), name, surname, department, description, protocol };
        updatedColleagues = [...colleagues, newColleague];
      }
      await AsyncStorage.setItem('colleagues', JSON.stringify(updatedColleagues));
      setName('');
      setSurname('');
      setDepartment('');
      setDescription('');
      setProtocol('');
      fetchColleagues();
    } catch (error) {
      console.error('Failed to save colleague:', error);
    }
  };

  const editColleague = (colleague) => {
    setName(colleague.name);
    setSurname(colleague.surname);
    setDepartment(colleague.department);
    setDescription(colleague.description);
    setProtocol(colleague.protocol);
    setEditingId(colleague._id);
  };

  const deleteColleague = async (colleagueId) => {
    try {
      const updatedColleagues = colleagues.filter(colleague => colleague._id !== colleagueId);
      await AsyncStorage.setItem('colleagues', JSON.stringify(updatedColleagues));
      fetchColleagues();
    } catch (error) {
      console.error('Failed to delete colleague:', error);
    }
  };

  const searchColleagues = (text) => {
    setSearch(text);
    const filtered = colleagues.filter(colleague =>
      colleague.name.toLowerCase().includes(text.toLowerCase()) ||
      colleague.surname.toLowerCase().includes(text.toLowerCase()) ||
      colleague.department.toLowerCase().includes(text.toLowerCase()) ||
      colleague.description.toLowerCase().includes(text.toLowerCase()) ||
      colleague.protocol.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredColleagues(filtered);
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>      
      {/* Logo in the upper right corner */}
      <Image
        source={require('../../assets/images/bmwpng.png')}
        style={styles.logo}
      />

      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>My BMW XConnect</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Name"
          placeholderTextColor={isDarkMode ? '#888888' : '#888'}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Surname"
          placeholderTextColor={isDarkMode ? '#888888' : '#888'}
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Department"
          placeholderTextColor={isDarkMode ? '#888888' : '#888'}
          value={department}
          onChangeText={setDepartment}
        />
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Description"
          placeholderTextColor={isDarkMode ? '#888888' : '#888'}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Last Catch-Up Protocol"
          placeholderTextColor={isDarkMode ? '#888888' : '#888'}
          value={protocol}
          onChangeText={setProtocol}
        />
        <Button color='#1c69d4' title={editingId ? "Update" : "Add"} onPress={saveColleague} />
      </View>
      
      <TextInput
        style={[styles.searchInput, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Search by name, surname, department, description or protocol"
        placeholderTextColor={isDarkMode ? '#888888' : '#888'}
        value={search}
        onChangeText={searchColleagues}
      />

      <FlatList
        data={filteredColleagues}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.colleagueItem}>
            <View style={styles.colleagueDetails}>
              <Text style={[styles.colleagueText, isDarkMode ? styles.darkText : styles.lightText]}>{item.name} {item.surname}</Text>
              <Text>
                <Text style={styles.attribute}>Department: </Text>
                <Text style={styles.colleagueText}>{item.department}</Text>
              </Text>

              <Text>
                <Text style={styles.attribute}>Desciption: </Text>
                <Text style={styles.colleagueText}> {item.description}</Text>
              </Text>

              <Text>
                <Text style={styles.attribute}>Last Catch-Up Protocol: </Text>
                <Text style={styles.colleagueText}> {item.protocol}</Text>
              </Text>

            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editColleague(item)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteColleague(item._id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  attribute: {
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  searchInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  colleagueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  colleagueDetails: {
    flex: 1,
  },
  colleagueText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },


  deleteButton: {
    color: 'red',
  },
});

export default App;
