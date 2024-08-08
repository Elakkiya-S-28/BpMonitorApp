import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../Context';
import MainScreen  from '../Container/MainScreen';
import { ROUTES } from '../Routes';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={ROUTES.MainScreen} component={MainScreen} options={{ headerShown: false }} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
