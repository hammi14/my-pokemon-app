import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PokemonList from '../screens/PokemonList';
import PokemonDetail from '../screens/PokemonDetail';
import MyPokemonList from '../screens/MyPokemonList';
import RenamePokemon from '../screens/RenamePokemon';
import SettingScreen from '../screens/SettingScreen';
import { RootStackParamList, RootTabParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Tab Navigator
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      
    >
      <Tab.Screen name="PokemonList" component={PokemonList} options={{ title: 'Pokemon List' }} />
      <Tab.Screen name="MyPokemonList" component={MyPokemonList} options={{ title: 'My Pokemon' }} />
      <Tab.Screen name="SettingScreen" component={SettingScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

// Main Navigation
const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="PokemonDetail" component={PokemonDetail} />
        <Stack.Screen name="RenamePokemon" component={RenamePokemon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
