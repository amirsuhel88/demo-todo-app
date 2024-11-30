import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './src/screens/Home';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store/store';
import NewTodo from './src/screens/NewTodo';
import EditTodo from './src/screens/EditTodo';
import {PersistGate} from 'redux-persist/integration/react';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="NewTodo" component={NewTodo} />
      <Stack.Screen name="EditTodo" component={EditTodo} />
    </Stack.Navigator>
  );
};

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
export default App;
