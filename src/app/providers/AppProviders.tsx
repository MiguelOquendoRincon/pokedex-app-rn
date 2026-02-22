import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Configuración global de React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
        },
    },
});

// Envolvemos la app en los providers necesarios
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};