import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppStore } from "../../../shared/store/appStore";
import { pokemonDetailKey } from "../hooks/usePokemonDetail";
import { getPokemonDetail } from "../services/pokemonDetailService";

type Props = {
    id: number;
    name: string;
    onPress: () => void;
};

const blurhash = "|rF?hV%2WCj[ayj[ayay~qj[ayj[ayj[";

export const PokemonCard = memo(function PokemonCard({ id, name, onPress }: Props) {
    const queryClient = useQueryClient();
    const toggleFavorite = useAppStore((s) => s.toggleFavorite);
    const isFavorite = useAppStore((s) => s.isFavorite(id));

    const idOrName = String(id);

    const prefetch = useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: pokemonDetailKey(idOrName),
            queryFn: ({ signal }) => getPokemonDetail({ id: id.toString(), signal }),
            staleTime: 1000 * 60 * 10,
        });
    }, [idOrName, queryClient]);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={prefetch}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>
                        #{String(id).padStart(3, "0")} • {capitalize(name)}
                    </Text>

                    <View style={styles.actionsRow}>
                        <Text style={styles.subtitle}>Tap to view details</Text>

                        <Pressable
                            onPress={() => toggleFavorite(id)}
                            hitSlop={10}
                            style={({ pressed }) => [styles.favBtn, pressed && { opacity: 0.7 }]}
                        >
                            <Text style={styles.favText}>{isFavorite ? "★" : "☆"}</Text>
                        </Pressable>
                    </View>
                </View>

                <Image
                    source={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                    style={styles.image}
                    contentFit="contain"
                    transition={180}
                    placeholder={{ blurhash }}
                    cachePolicy="disk"
                />
            </View>
        </Pressable>
    );
});

function capitalize(s: string) {
    return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
    card: {
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#F2F2F2",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    pressed: { transform: [{ scale: 0.98 }], opacity: 0.8 },
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
    title: { fontSize: 16, fontWeight: "800", color: "#121212" },
    subtitle: { marginTop: 4, color: "#666666" },
    actionsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    favBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    favText: { fontSize: 18, fontWeight: "900", color: "#121212" },
    image: { width: 72, height: 72 },
});