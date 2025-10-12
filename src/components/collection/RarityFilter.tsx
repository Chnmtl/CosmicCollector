import React from "react";
import { View, StyleSheet } from "react-native";
import { Rarity } from "../../types";
import { calculateRarityStats, RARITY_OPTIONS } from "../../utils";
import { CelestialObject } from "../../types";
import ResponsiveStrip from "../common/ResponsiveStrip";
import RarityFilterItem from "./RarityFilterItem";

interface RarityFilterProps {
  objects: CelestialObject[];
  selectedRarity: Rarity | "All";
  onSelectRarity: (rarity: Rarity | "All") => void;
}

const RarityFilter: React.FC<RarityFilterProps> = ({
  objects,
  selectedRarity,
  onSelectRarity,
}) => {
  const rarityStats = calculateRarityStats(objects);

  const handlePress = (rarity: Rarity) => {
    onSelectRarity(selectedRarity === rarity ? "All" : rarity);
  };

  return (
    <View style={styles.container}>
      <ResponsiveStrip
        centerStyle={styles.centerContent}
        scrollStyle={styles.scrollContent}
      >
        {RARITY_OPTIONS.filter((r) => r !== "All").map((rarity) => (
          <RarityFilterItem
            key={rarity}
            rarity={rarity as Rarity}
            count={rarityStats[rarity as Rarity]}
            isActive={selectedRarity === rarity}
            onPress={() => handlePress(rarity as Rarity)}
          />
        ))}
      </ResponsiveStrip>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
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

export default RarityFilter;
