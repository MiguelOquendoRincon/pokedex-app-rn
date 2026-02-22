import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { pokemonDetailKey } from "../hooks/usePokemonDetail";
import { getPokemonDetail } from "../services/pokemonDetailService";

type Props = {
    id: number;
    name: string;
    onPress: () => void;
};

const blurhash =
    "|rF?hV%2WCj[ayj[ayay~qj[ayj[ayj["; // placeholder simple

export const PokemonCard = memo(function PokemonCard({ id, name, onPress }: Props) {
    const queryClient = useQueryClient();

    const idOrName = String(id);

    const prefetch = useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: pokemonDetailKey(idOrName),
            queryFn: ({ signal }) => getPokemonDetail({ id: id.toString(), signal }),
            staleTime: 1000 * 60 * 10,
        });
    }, [id, queryClient]);

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
                    <Text style={styles.subtitle}>Tap to view details</Text>
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
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    pressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
    title: { fontSize: 16, fontWeight: "800" },
    subtitle: { marginTop: 4, opacity: 0.7 },
    image: { width: 72, height: 72 },
});