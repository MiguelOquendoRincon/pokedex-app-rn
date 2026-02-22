import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { usePokemonList } from "../hooks/usePokemonList";

// Pantalla principal de la Pokédex
export const PokedexScreen = () => {
    // Hook para obtener una lista infinita de pokemons
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = usePokemonList();
    // Combinamos todas las páginas en una sola lista
    const items = useMemo(() => {
        return data?.pages.flatMap((p) => p.results) ?? [];
    }, [data]);

    // Si está cargando, mostramos un indicador de carga
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={styles.muted}>Loading Pokédex...</Text>
            </View>
        )
    }

    // Si hay un error, mostramos un mensaje de error
    if (isError) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Error al cargar los pokemons</Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </Pressable>
            </View>
        )
    }

    // Renderizamos la lista de pokemons
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokédex</Text>

            <FlatList
                data={items}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            #{String(item.id).padStart(3, "0")} • {capitalize(item.name)}
                        </Text>
                    </View>
                )}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.4}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View style={styles.footer}>
                            <ActivityIndicator />
                            <Text style={styles.muted}>Loading more...</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

// Función para capitalizar el nombre del pokemon
function capitalize(s: string) {
    return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        margin: 16,
    },
    list: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },
    muted: {
        color: "#666",
        marginLeft: 8,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        color: "#d63031",
        fontSize: 16,
    },
    retryButton: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#007bff",
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});

