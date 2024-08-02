import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'SettingScreen'>;

const SettingScreen: React.FC<Props> = ({ navigation }) => {
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    const loadApiUrl = async () => {
      const storedUrl = await AsyncStorage.getItem('apiUrl');
      if (storedUrl) setApiUrl(storedUrl);
    };

    loadApiUrl();
  }, []);

  const saveApiUrl = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Validation Error', 'API URL cannot be empty.');
      return;
    }

    try {
      await AsyncStorage.setItem('apiUrl', apiUrl);
      Alert.alert('Success', 'API URL saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the API URL.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>API URL:</Text>
      <TextInput
        style={styles.input}
        value={apiUrl}
        onChangeText={setApiUrl}
        placeholder="Enter API URL"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={saveApiUrl}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#fff',
    fontSize: 16,
    color:'black'
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingScreen;
