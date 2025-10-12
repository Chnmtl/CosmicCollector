import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { CelestialObjectType } from "../../types";
import { getTypeIcon } from "../../utils";

interface TypeFilterItemProps {
  type: CelestialObjectType | "All";
  count: number;
  isActive: boolean;
  onPress: () => void;
}

const TypeFilterItem: React.FC<TypeFilterItemProps> = ({
  type,
  count,
  isActive,
  onPress,
}) => {
  const icon = type === "All" ? "🌌" : getTypeIcon(type);

  return (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.activeFilterButton]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${type}`}
    >
      <Text style={styles.filterIcon}>{icon}</Text>
      <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
        {type}
      </Text>
      <Text style={styles.filterCount}>{count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    minWidth: 80,
  },
  activeFilterButton: {
    backgroundColor: "rgba(0, 212, 255, 0.2)",
  },
  filterIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  filterText: {
    fontSize: 13,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 4,
  },
  activeFilterText: {
    color: "#00d4ff",
    fontWeight: "bold",
  },
  filterCount: {
    fontSize: 11,
    color: "#ccc",
    marginTop: 2,
  },
});

export default TypeFilterItem;
