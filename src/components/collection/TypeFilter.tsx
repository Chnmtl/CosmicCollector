import React from "react";
import { View, StyleSheet } from "react-native";
import { CelestialObjectType } from "../../types";
import { calculateTypeStats, FILTER_OPTIONS } from "../../utils";
import { CelestialObject } from "../../types";
import ResponsiveStrip from "../common/ResponsiveStrip";
import TypeFilterItem from "./TypeFilterItem";

interface TypeFilterProps {
  objects: CelestialObject[];
  allObjects: CelestialObject[];
  selectedType: CelestialObjectType | "All";
  onSelectType: (type: CelestialObjectType | "All") => void;
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
              : typeStats[type as CelestialObjectType] || 0;

          return (
            <TypeFilterItem
              key={type}
              type={type}
              count={count}
              isActive={selectedType === type}
              onPress={() => onSelectType(type)}
            />
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
});

export default TypeFilter;
