import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

type Props = StackScreenProps<RootStackParamList, 'MyPokemonList'>;

const MyPokemonList: React.FC<Props> = ({ navigation }) => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const [loadingId, setLoadingId] = useState<string | null>(null); // Add state for loading Pokemon ID

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const storedUrl = await AsyncStorage.getItem('apiUrl');
      if (storedUrl) setBaseUrl(storedUrl);
    };

    fetchBaseUrl();
  }, []);

  // Function to load pokemons
  const loadPokemons = async () => {
    const savedPokemons = await AsyncStorage.getItem('myPokemons');
    if (savedPokemons) setPokemons(JSON.parse(savedPokemons));
  };

  useEffect(() => {
    loadPokemons();
  }, []);

  // Use useFocusEffect to reload data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPokemons();
    }, [])
  );

  const handleRelease = async (id: string, pokemonId: number) => {
    Alert.alert('Release Pokemon', 'Are you sure you want to release this Pokémon?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: async () => {
        setLoading(true); // Start loading
        try {
          const response = await fetch(`${baseUrl}/release`, { method: 'POST', body: JSON.stringify({ pokemonId: pokemonId }) });
          const result = await response.json();
          if (result.success) {
            const updatedPokemons = pokemons.filter(pokemon => pokemon.id !== id);
            setPokemons(updatedPokemons);
            await AsyncStorage.setItem('myPokemons', JSON.stringify(updatedPokemons));
          } else {
            Alert.alert('Error', 'Failed to release Pokémon');
          }
        } catch (error) {
          Alert.alert('Error', 'Something went wrong');
        } finally {
          setLoading(false); // End loading
        }
      } },
    ]);
  };

  const handleRename = async (id: string, currentNickname: string) => {
    setLoading(true); // Start loading for renaming
    setLoadingId(id); // Set the current Pokémon ID being renamed
    try {
      const response = await fetch(`${baseUrl}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: currentNickname }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const newName = result.newName;
  
        // Update Pokemon's nickname in the state
        const updatedPokemons = pokemons.map(pokemon => 
          pokemon.id === id ? { ...pokemon, nickname: newName } : pokemon
        );
        setPokemons(updatedPokemons);
  
        // Save updated pokemons to AsyncStorage
        await AsyncStorage.setItem('myPokemons', JSON.stringify(updatedPokemons));
      } else {
        Alert.alert('Error', 'Failed to rename Pokémon');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false); // End loading
      setLoadingId(null); // Reset the loading ID
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.pokemonId}.png`;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Nickname: {item.nickname}</Text>
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : null]}
            onPress={() => handleRelease(item.id, item.pokemonId)}
            disabled={loading} // Disable button when loading
          >
            <Text style={styles.buttonText}>{loading ? 'Releasing...' : 'Release'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, loading  ? styles.buttonDisabled : null]} // Disable button if renaming
            onPress={() => handleRename(item.id, item.namaAwal)}
            disabled={loading} // Disable button when loading except for current item
          >
            <Text style={styles.buttonText}>{loading  ? 'Renaming...' : 'Rename'}</Text>
          </TouchableOpacity>
        </View>
        {/* {loading  && <ActivityIndicator size="small" color="#007bff" style={styles.loader} />} */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {pokemons.length === 0 ? (
        <Text style={styles.noPokemonText}>You don't have any Pokémon</Text>
      ) : (
        <FlatList
          data={pokemons}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Use item.id instead of generateId
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  itemContainer: {
    alignItems: 'center', // Center items horizontally
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  pokemonImage: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginBottom: 8, // Add space between image and text
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8, // Add space between text and buttons
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9', // Disabled button color
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginTop: 8,
  },
  noPokemonText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default MyPokemonList;
