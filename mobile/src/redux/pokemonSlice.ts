import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  moves: { move: { name: string } }[];
}

interface PokemonState {
  pokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  loading: boolean;
  hasMore: boolean;
  offset: number;
  searchQuery: string;
}

const initialState: PokemonState = {
  pokemons: [],
  filteredPokemons: [],
  loading: false,
  hasMore: true,
  offset: 0,
  searchQuery: '',
};

// Async thunk to fetch Pokémon data from API
export const fetchPokemons = createAsyncThunk(
  'pokemon/fetchPokemons',
  async (limit: number, { getState }) => {
    const { offset } = (getState() as { pokemon: PokemonState }).pokemon;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return { results: data.results, nextOffset: offset + limit };
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.filteredPokemons = state.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.pokemons = [...state.pokemons, ...action.payload.results];
        state.filteredPokemons = state.pokemons.filter(pokemon =>
          pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
        state.offset = action.payload.nextOffset;
        state.hasMore = action.payload.results.length > 0;
        state.loading = false;
      })
      .addCase(fetchPokemons.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSearchQuery } = pokemonSlice.actions;
export default pokemonSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface PokemonState {
//   pokemons: any[];
//   filteredPokemons: any[];
//   loading: boolean;
//   hasMore: boolean;
//   offset: number;
//   searchQuery: string;
// }

// const initialState: PokemonState = {
//   pokemons: [],
//   filteredPokemons: [],
//   loading: false,
//   hasMore: true,
//   offset: 0,
//   searchQuery: '',
// };


// export const fetchPokemons = createAsyncThunk(
//   'pokemon/fetchPokemons',
//   async (limit: number, { getState }) => {
//     const { offset } = (getState() as any).pokemon;
//     const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
//     const data = await response.json();
//     return { results: data.results, nextOffset: offset + limit };
//   }
// );

// const pokemonSlice = createSlice({
//   name: 'pokemon',
//   initialState,
//   reducers: {
//     setSearchQuery(state, action) {
//       state.searchQuery = action.payload;
//       state.filteredPokemons = state.pokemons.filter(pokemon =>
//         pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())
//       );
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPokemons.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchPokemons.fulfilled, (state, action) => {
//         state.pokemons = [...state.pokemons, ...action.payload.results];
//         state.filteredPokemons = state.pokemons.filter(pokemon =>
//           pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())
//         );
//         state.offset = action.payload.nextOffset;
//         state.hasMore = action.payload.results.length > 0;
//         state.loading = false;
//       })
//       .addCase(fetchPokemons.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export const { setSearchQuery } = pokemonSlice.actions;
// export default pokemonSlice.reducer;
