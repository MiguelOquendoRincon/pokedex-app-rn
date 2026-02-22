import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TabsNavigator } from './TabsNavigator';

// Definimos los parámetros de cada pantalla
export type RootStackParamList = {
    Tabs: undefined;
    PokemonDetail: { id: string };
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
            {/* <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    );
};