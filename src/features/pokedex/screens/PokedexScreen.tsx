import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../../shared/store/appStore";
import { useDebouncedValue } from "../../../shared/utils/useDebouncedValue";
import { PokemonCard } from "../components/PokemonCard";
import { usePokemonList } from "../hooks/usePokemonList";
import { usePokemonByType, useTypes } from "../hooks/useTypes";

/**
 * PokedexScreen Component
 * 
 * The primary screen of the application that displays a list of Pokémon.
 * It features:
 * - Infinite scrolling for the complete list.
 * - Filtering by Pokémon type.
 * - Search by name or ID.
 * - Responsive UI for light/dark modes (controlled via global state).
 */
export const PokedexScreen = () => {
    // Hooks for navigation and theme
    const navigation = useNavigation<any>();
    const theme = useAppStore((s) => s.theme);

    // State for searching with a debounce to optimize performance
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebouncedValue(search, 300);

    // State for filtering by type
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Queries from React Query for types and type-specific Pokémon
    const typesQuery = useTypes();
    const byTypeQuery = usePokemonByType(selectedType);

    /**
     * Main query for the infinite scroll list.
     * Uses @tanstack/react-query to handle pagination and cache state.
     */
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = usePokemonList();

    /**
     * Memoized list of items based on whether a type filter is active.
     * If a type is selected, we use the static list from the type query.
     * Otherwise, we flatten the pages from the infinite scroll data.
     */
    const listItems = useMemo(() => {
        if (selectedType) return byTypeQuery.data ?? [];
        return data?.pages.flatMap((p) => p.results) ?? [];
    }, [selectedType, byTypeQuery.data, data]);

    /**
     * Final filtered list based on the search input.
     * Filters by both Pokémon name and ID.
     */
    const filtered = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase();
        if (!q) return listItems;
        return listItems.filter((x) => x.name.toLowerCase().includes(q) || String(x.id).includes(q));
    }, [listItems, debouncedSearch]);

    // Loading State
    if (isLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator color="#FF1C1C" size="large" />
                <Text style={styles.loadingText}>Loading Pokédex...</Text>
            </SafeAreaView>
        );
    }

    // Error State with retry functionality
    if (isError) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.errorText}>Oops! Something went wrong</Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Pokédex</Text>
                <Text style={styles.subtitle}>Search for Pokémon by name or ID</Text>
            </View>

            {/* Search Input Section */}
            <View style={styles.searchContainer}>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search Pokémon..."
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    style={styles.input}
                />
                {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")} style={styles.clearBtn}>
                        <Text style={styles.clearText}>✕</Text>
                    </Pressable>
                )}
            </View>

            {/* Horizontal Type Filter Section */}
            <View style={styles.typesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                >
                    <Pressable
                        onPress={() => setSelectedType(null)}
                        style={[styles.chip, !selectedType && styles.chipActive]}
                    >
                        <Text style={[styles.chipText, !selectedType && styles.chipTextActive]}>All</Text>
                    </Pressable>

                    {typesQuery.data?.map((t) => (
                        <Pressable
                            key={t.name}
                            onPress={() => setSelectedType(t.name)}
                            style={[styles.chip, selectedType === t.name && styles.chipActive]}
                        >
                            <Text style={[styles.chipText, selectedType === t.name && styles.chipTextActive]}>
                                {capitalize(t.name)}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Main Pokémon List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                renderItem={({ item }) => (
                    <PokemonCard
                        id={item.id}
                        name={item.name}
                        onPress={() => navigation.navigate("PokemonDetail", { idOrName: String(item.id) })}
                    />
                )}
                onEndReached={() => {
                    // Pagination only applies to the multi-type main list
                    if (selectedType) return;
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No Pokémon found matching your search.</Text>
                    </View>
                }
                ListFooterComponent={
                    !selectedType && isFetchingNextPage ? (
                        <View style={styles.footer}>
                            <ActivityIndicator color="#FF1C1C" />
                            <Text style={styles.footerText}>Catching more Pokémon...</Text>
                        </View>
                    ) : <View style={{ height: 20 }} />
                }
            />
        </SafeAreaView>
    );
};

function capitalize(s: string) {
    return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    title: {
        fontSize: 34,
        fontWeight: "900",
        color: "#121212",
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: "#666666",
        marginTop: 4,
    },
    searchContainer: {
        marginHorizontal: 20,
        marginBottom: 15,
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        paddingHorizontal: 16,
        borderRadius: 15,
        backgroundColor: "#F2F2F2",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        color: "#121212",
        fontSize: 16,
    },
    clearBtn: {
        position: 'absolute',
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.1)',
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearText: {
        color: '#121212',
        fontSize: 12,
        fontWeight: 'bold',
    },
    typesContainer: {
        marginBottom: 10,
    },
    chipsScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: "#F2F2F2",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    chipActive: {
        backgroundColor: "#FF1C1C",
        borderColor: "#FF1C1C",
    },
    chipText: {
        color: "#666666",
        fontWeight: "700",
        fontSize: 14,
    },
    chipTextActive: {
        color: "white",
    },
    list: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    emptyContainer: {
        paddingTop: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        color: "#999999",
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 40,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
    },
    footerText: {
        color: "#999999",
        marginLeft: 10,
        fontSize: 14,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        marginTop: 15,
        color: "#666666",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "#FF5252",
        fontSize: 18,
        fontWeight: "700",
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: "#FF1C1C",
        borderRadius: 12,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
});

