import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Modal, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

interface CatchResponse {
  success: boolean;
  message?: string; // Optional message field for error details
}

const PokemonDetail: React.FC<Props> = ({ route, navigation }) => {
  const [pokemon, setPokemon] = useState<any>(null);
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const { id } = route.params;

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const storedUrl = await AsyncStorage.getItem('apiUrl');
      if (storedUrl) setBaseUrl(storedUrl);
    };

    fetchBaseUrl();
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching pokemon details:', error);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleCatch = async () => {
    setLoading(true); // Set loading to true when starting catch process
    try {
      const response = await fetch(`${baseUrl}/catch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result: CatchResponse = await response.json();

      if (result.success) {
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'Failed to catch Pokémon');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false); // Set loading to false when catch process is done
    }
  };

  const handleSaveNickname = async () => {
    if (nickname.trim()) {
      // Generate new ID
      const generateId = () => {
        return Date.now().toString();
      };

      // Create new Pokémon object
      const newPokemon = { id: generateId(), pokemonId: pokemon.id, nickname, namaAwal: nickname };

      try {
        // Retrieve existing Pokémon from AsyncStorage
        const storedPokemons = await AsyncStorage.getItem('myPokemons');
        const pokemons = storedPokemons ? JSON.parse(storedPokemons) : [];

        // Check for duplicate nickname
        const isDuplicate = pokemons.some((pkm: { namaAwal: string; }) => pkm.namaAwal === nickname);
        if (isDuplicate) {
          Alert.alert('Error', 'Nickname already exists!');
          return;
        }

        // Add new Pokémon to the list
        pokemons.push(newPokemon);
        await AsyncStorage.setItem('myPokemons', JSON.stringify(pokemons));

        // Close modal and navigate
        setModalVisible(false);
        navigation.navigate('MyPokemonList');
      } catch (error) {
        Alert.alert('Error', 'Failed to save Pokémon');
      }
    } else {
      Alert.alert('Error', 'Nickname cannot be empty!');
    }
  };

  if (!pokemon) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
        style={styles.pokemonImage}
      />
      <Text style={styles.title}>Name: {pokemon.name}</Text>
      <Text style={styles.subtitle}>Types:</Text>
      <Text style={styles.types}>{pokemon.types.map((type: any) => type.type.name).join(', ')}</Text>

      <Text style={styles.subtitle}>Moves:</Text>
      <ScrollView style={styles.movesContainer}>
        <Text style={styles.moveItem}>{pokemon.moves.map((move: any) => move.move.name).join(', ')}</Text>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
        onPress={handleCatch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Catching...' : 'Catch Pokemon'}</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      )}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Nickname</Text>
            <TextInput
              style={styles.input}
              placeholder="Nickname"
              value={nickname}
              onChangeText={setNickname}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleSaveNickname} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  pokemonImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginVertical: 4,
  },
  types: {
    fontSize: 18,
    color: '#777',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
    marginTop:30
    // Disable button when loading
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  movesContainer: {
    width: '100%',
    maxHeight: 150, // Set maxHeight for the moves container
  },
  moveItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
});

export default PokemonDetail;
