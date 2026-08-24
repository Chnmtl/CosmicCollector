import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CosmicObjectType, CosmicObject } from "../../models";
import { calculateTypeStats, FILTER_OPTIONS, getTypeIcon } from "../../utils";
import ResponsiveStrip from "../common/ResponsiveStrip";

interface TypeFilterProps {
  objects: CosmicObject[];
  allObjects: CosmicObject[];
  selectedType: CosmicObjectType | "All";
  onSelectType: (type: CosmicObjectType | "All") => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({
  objects,
  allObjects,
  selectedType,
  onSelectType,
}) => {
  const typeStats = calculateTypeStats(allObjects);

  return (
    <View style={styles.container}>
      <ResponsiveStrip
        centerStyle={styles.centerContent}
        scrollStyle={styles.scrollContent}
      >
        {FILTER_OPTIONS.map((type) => {
          const count =
            type === "All"
              ? objects.length
              : typeStats[type as CosmicObjectType] || 0;
          const isActive = selectedType === type;
          const icon = type === "All" ? "🌌" : getTypeIcon(type);

          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                isActive && styles.activeFilterButton,
              ]}
              onPress={() => onSelectType(type)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${type}`}
            >
              <Text style={styles.filterIcon}>{icon}</Text>
              <Text
                style={[styles.filterText, isActive && styles.activeFilterText]}
              >
                {type}
              </Text>
              <Text style={styles.filterCount}>{count}</Text>
            </TouchableOpacity>
          );
        })}
      </ResponsiveStrip>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 4,
    maxHeight: 80,
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
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

export default TypeFilter;
