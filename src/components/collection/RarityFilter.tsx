import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Rarity, CosmicObject } from "../../models";
import {
  calculateRarityStats,
  RARITY_OPTIONS,
  getRarityAccentColor,
} from "../../utils";
import ResponsiveStrip from "../common/ResponsiveStrip";

interface RarityFilterProps {
  objects: CosmicObject[];
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
        {RARITY_OPTIONS.filter((r) => r !== "All").map((rarity) => {
          const isActive = selectedRarity === rarity;
          const accentColor = getRarityAccentColor(rarity as Rarity);
          const count = rarityStats[rarity as Rarity];

          return (
            <TouchableOpacity
              key={rarity}
              style={[styles.statCard, isActive && styles.activeStatCard]}
              onPress={() => handlePress(rarity as Rarity)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${rarity}: ${count} discovered`}
            >
              <Text style={[styles.statNumber, { color: accentColor }]}>
                {count}
              </Text>
              <Text style={styles.statLabel}>{rarity}</Text>
            </TouchableOpacity>
          );
        })}
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
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
    minWidth: 76,
  },
  activeStatCard: {
    backgroundColor: "rgba(0,212,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.3)",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
});

export default RarityFilter;
