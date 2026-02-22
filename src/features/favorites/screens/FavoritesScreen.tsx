import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppStore } from "../../../shared/store/appStore";
import { useDebouncedValue } from "../../../shared/utils/useDebouncedValue";
import { PokemonCard } from "../../pokedex/components/PokemonCard";

export function FavoritesScreen() {
    const navigation = useNavigation<any>();
    const favoritesIds = useAppStore((s) => s.favoritesIds);

    const [q, setQ] = useState("");
    const dq = useDebouncedValue(q, 250);

    const items = useMemo(() => {
        const ids = Object.keys(favoritesIds).map(Number).sort((a, b) => a - b);
        const mapped = ids.map((id) => ({ id, name: `pokemon-${id}` })); // nombre real lo traeremos luego con cache detail
        if (!dq.trim()) return mapped;
        return mapped.filter((x) => String(x.id).includes(dq.trim()));
    }, [favoritesIds, dq]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorites</Text>

            <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search by id..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
            />

            <FlatList
                data={items}
                keyExtractor={(it) => String(it.id)}
                contentContainerStyle={{ padding: 16, gap: 10 }}
                renderItem={({ item }) => (
                    <PokemonCard
                        id={item.id}
                        name={String(item.id)} // el card capitaliza; aquí no importa
                        onPress={() => navigation.navigate("PokemonDetail", { idOrName: String(item.id) })}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={{ opacity: 0.8 }}>No favorites yet. Star some Pokémon ⭐</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 16 },
    title: { fontSize: 28, fontWeight: "900", paddingHorizontal: 16, marginBottom: 10 },
    input: {
        marginHorizontal: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        marginBottom: 8,
        color: "white",
    },
    empty: { padding: 20, alignItems: "center" },
});