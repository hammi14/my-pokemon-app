// types.ts

export type RootStackParamList = {
    TabNavigator: undefined;
    PokemonList: undefined;
    PokemonDetail: { id: string }; // or whatever params you need
    MyPokemonList: undefined;
    RenamePokemon: { id: string; currentNickname: string ,type:string};
    SettingScreen: undefined;
  };
  
  export type RootTabParamList = {
    PokemonList: undefined;
    MyPokemonList: undefined;
    SettingScreen: undefined;
  };
  

// export type RootStackParamList = {
//   PokemonList: undefined; // No parameters
//   PokemonDetail: { id: string }; // Example parameter
//   MyPokemonList: undefined; // No parameters
//   RenamePokemon: { id: string; currentNickname: string }; // Example parameters
//   SettingScreen: undefined; // Add this line
// };
