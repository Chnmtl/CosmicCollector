import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CollectionHeaderProps {
  totalObjects: number;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  totalObjects,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>📱 Collection</Text>
      <Text style={styles.subtitle}>
        {totalObjects} {totalObjects === 1 ? "object" : "objects"} discovered
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
  },
});

export default CollectionHeader;
