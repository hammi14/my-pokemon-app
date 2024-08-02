import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchPokemons, setSearchQuery } from '../redux/pokemonSlice';

type Props = {
  navigation: any;
};

const PokemonList: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredPokemons, loading, hasMore, searchQuery } = useSelector((state: RootState) => state.pokemon);

  useEffect(() => {
    dispatch(fetchPokemons(10));
  }, [dispatch]);

  const handlePress = (name: string) => {
    navigation.navigate('PokemonDetail', { id: name });
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      dispatch(fetchPokemons(10));
    }
  }, [hasMore, loading, dispatch]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const renderItem = ({ item }: { item: any }) => {
    const pokemonId = item.url.split('/').filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item.name)}>
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Pokémon"
        placeholderTextColor="#000" // Set placeholder color to black
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredPokemons}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    alignItems: 'center',
    paddingVertical: 16,
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
    marginBottom: 8,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    alignItems: 'center',
  },
});

export default PokemonList;

// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
// import { StackScreenProps } from '@react-navigation/stack';
// import { RootStackParamList } from '../navigation/types';

// type Props = StackScreenProps<RootStackParamList, 'PokemonList'>;

// const PokemonList: React.FC<Props> = ({ navigation }) => {
//   const [pokemons, setPokemons] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [offset, setOffset] = useState<number>(0);

//   const fetchPokemons = async (limit: number = 10) => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
//       const data = await response.json();
//       setPokemons(prevPokemons => [...prevPokemons, ...data.results]);
//       setOffset(prevOffset => prevOffset + limit);
//       setHasMore(data.results.length > 0);
//     } catch (error) {
//       console.error('Error fetching pokemons:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPokemons();
//   }, []);

//   const handlePress = (name: string) => {
//     navigation.navigate('PokemonDetail', { id: name });
//   };

//   const handleLoadMore = useCallback(() => {
//     if (hasMore && !loading) {
//       fetchPokemons();
//     }
//   }, [hasMore, loading]);

//   const renderItem = ({ item }: { item: any }) => {
//     const pokemonId = item.url.split('/').filter(Boolean).pop(); // Extract Pokémon ID from URL
//     const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

//     return (
//       <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item.name)}>
//         <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
//         <Text style={styles.itemText}>{item.name}</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderFooter = () => {
//     if (!loading) return null;
//     return (
//       <View style={styles.footer}>
//         <ActivityIndicator size="large" color="#007bff" />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={pokemons}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.name}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={renderFooter}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f7f7f7',
//   },
//   itemContainer: {
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   pokemonImage: {
//     width: 100, // Adjust width as needed
//     height: 100, // Adjust height as needed
//     marginBottom: 8,
//   },
//   itemText: {
//     fontSize: 18,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   footer: {
//     paddingVertical: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#eaeaea',
//     alignItems: 'center',
//   },
// });

// export default PokemonList;
