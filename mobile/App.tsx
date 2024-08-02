// App.tsx

import React from 'react';
import Navigation from './src/navigation/Navigation';
import { Provider } from 'react-redux';

import store from './src/redux/store';
const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
};

export default App;
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { enableScreens } from 'react-native-screens';
// import Navigation from './src/navigation/Navigation';

// // Enable screens for better performance
// enableScreens();

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Navigation />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
