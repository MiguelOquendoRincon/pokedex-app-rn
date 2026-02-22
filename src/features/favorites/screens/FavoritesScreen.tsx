import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const FavoritesScreen = () => {
    return (
        <View style={styles.container}>
            <Text>FavoritesScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})