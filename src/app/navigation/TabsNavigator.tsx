import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { FavoritesScreen } from '../../features/favorites/screens/FavoritesScreen';
import { PokedexScreen } from '../../features/pokedex/screens/PokedexScreen';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';

// Definimos los parámetros de cada pantalla
export type TabsParamList = {
    Pokedex: undefined;
    Favorites: undefined;
    Settings: undefined;
}

// Creamos el navegador de pestañas
const Tab = createBottomTabNavigator<TabsParamList>();

// Definimos las pantallas
export const TabsNavigator = () => {
    return (
        // screenOptions={{ headerShown: false }} para ocultar el header de las pantallas
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Pokedex" component={PokedexScreen} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};
