import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { usePokemonDetail } from "../hooks/usePokemonDetail";

export function PokemonDetailScreen({ route }: any) {
    const { idOrName } = route.params as { idOrName: string };
    const { data, isLoading, isError, error } = usePokemonDetail(idOrName);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ opacity: 0.7 }}>Loading detail...</Text>
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Error loading Pokémon</Text>
                <Text style={{ opacity: 0.7 }}>
                    {error instanceof Error ? error.message : "Unknown error"}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                #{String(data.id).padStart(3, "0")} • {capitalize(data.name)}
            </Text>

            <Image
                source={data.artworkUrl ?? undefined}
                style={styles.hero}
                contentFit="contain"
                transition={220}
                cachePolicy="disk"
            />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Types</Text>
                <Text style={styles.muted}>{data.types.map((t) => t.name).join(" • ")}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stats</Text>
                {data.stats.slice(0, 6).map((s) => (
                    <Text key={s.name} style={styles.muted}>
                        {s.name}: {s.value}
                    </Text>
                ))}
            </View>
        </View>
    );
}

function capitalize(s: string) {
    return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 16 },
    title: { fontSize: 24, fontWeight: "900", marginBottom: 10 },
    hero: { width: "100%", height: 240, marginVertical: 8 },
    section: { marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.06)" },
    sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
    muted: { opacity: 0.8 },
    error: { fontSize: 16, fontWeight: "800" },
});