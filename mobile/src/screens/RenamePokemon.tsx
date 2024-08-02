import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RenamePokemon'>;

const RenamePokemon: React.FC<Props> = ({ route, navigation }) => {
  const { id, currentNickname } = route.params;
  const [nickname, setNickname] = useState(currentNickname);
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    const loadPokemons = async () => {
      const savedPokemons = await AsyncStorage.getItem('myPokemons');
      if (savedPokemons) setPokemons(JSON.parse(savedPokemons));
    };

    const fetchBaseUrl = async () => {
      const storedUrl = await AsyncStorage.getItem('apiUrl');
      if (storedUrl) setBaseUrl(storedUrl);
    };

    loadPokemons();
    fetchBaseUrl();
  }, []);

  const handleRename = async () => {
    if (!nickname.trim()) {
      Alert.alert('Error', 'Nickname cannot be empty');
      return;
    }

    try {
      if (baseUrl) {
        const response = await fetch(`${baseUrl}/rename`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pokemonId: id, newName: nickname }),
        });
        const result = await response.json();
        if (result.success) {
          Alert.alert('Success', 'Pokemon renamed successfully!');
          const updatedPokemons = pokemons.map(pokemon =>
            pokemon.id === id ? { ...pokemon, nickname } : pokemon
          );
          await AsyncStorage.setItem('myPokemons', JSON.stringify(updatedPokemons));
          navigation.goBack();
        } else {
          Alert.alert('Error', 'Failed to rename Pokémon');
        }
      } else {
        const updatedPokemons = pokemons.map(pokemon =>
          pokemon.id === id ? { ...pokemon, nickname } : pokemon
        );

        await AsyncStorage.setItem('myPokemons', JSON.stringify(updatedPokemons));
        
        Alert.alert('Success', 'Pokemon renamed and saved successfully!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rename Pokemon</Text>
      <Text style={styles.currentNickname}>Current Nickname: {currentNickname}</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="Enter new nickname"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleRename}>
        <Text style={styles.buttonText}>Rename</Text>
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
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  currentNickname: {
    fontSize: 18,
    marginBottom: 16,
    color: '#555',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#fff',
    fontSize: 16,
    color: 'black'
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
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

export default RenamePokemon;
