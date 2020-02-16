import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './pages/CameraScreen';
import VideoListScreen from './pages/VideoListScreen';

  const Stack = createStackNavigator();

  function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="List" component={VideoListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
export default App;
