import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokemonDetail } from "../hooks/usePokemonDetail";

/**
 * PokemonDetailScreen Component
 * 
 * Displays detailed information about a specific Pokémon.
 * Uses `@tanstack/react-query` to fetch and cache Pokémon details based on the ID or name.
 */
export function PokemonDetailScreen({ route }: any) {
    const { idOrName } = route.params as { idOrName: string };
    const { data, isLoading, isError, error, refetch } = usePokemonDetail(idOrName);
    const navigation = useNavigation();

    // Loading State
    if (isLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator color="#FF1C1C" size="large" />
                <Text style={styles.loadingText}>Loading detail...</Text>
            </SafeAreaView>
        );
    }

    // Error State
    if (isError || !data) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.errorText}>Error loading Pokémon</Text>
                <Text style={styles.errorDesc}>
                    {error instanceof Error ? error.message : "Unknown error"}
                </Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        #{String(data.id).padStart(3, "0")} • {capitalize(data.name)}
                    </Text>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={data.artworkUrl ?? undefined}
                        style={styles.hero}
                        contentFit="contain"
                        transition={220}
                        cachePolicy="disk"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Types</Text>
                    <View style={styles.typesRow}>
                        {data.types.map((t) => (
                            <View key={t.name} style={styles.typeBadge}>
                                <Text style={styles.typeText}>{capitalize(t.name)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Stats</Text>
                    {data.stats.slice(0, 6).map((s) => (
                        <View key={s.name} style={styles.statRow}>
                            <Text style={styles.statName}>{s.name.toUpperCase()}</Text>
                            <View style={styles.statBarContainer}>
                                <View style={[styles.statBar, { width: `${Math.min(s.value, 100)}%` }]} />
                            </View>
                            <Text style={styles.statValue}>{s.value}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/**
 * Helper to capitalize a string
 */
function capitalize(s: string) {
    return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        paddingVertical: 8,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#121212",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        marginTop: 15,
        color: "#666666",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#FF5252",
    },
    errorDesc: {
        color: "#666666",
        marginTop: 8,
        textAlign: "center",
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
    titleContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "#121212",
        textAlign: "center"
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F2F2F2",
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    hero: {
        width: 200,
        height: 200,
    },
    section: {
        marginBottom: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#F8F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 12,
        color: "#121212"
    },
    typesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    typeBadge: {
        backgroundColor: "#E0E0E0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    typeText: {
        fontWeight: "700",
        color: "#121212",
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    statName: {
        width: 80,
        fontSize: 12,
        fontWeight: "700",
        color: "#666666",
    },
    statBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        marginHorizontal: 10,
        overflow: "hidden",
    },
    statBar: {
        height: "100%",
        backgroundColor: "#FF1C1C",
        borderRadius: 4,
    },
    statValue: {
        width: 30,
        fontSize: 14,
        fontWeight: "800",
        textAlign: "right",
        color: "#121212",
    },
});