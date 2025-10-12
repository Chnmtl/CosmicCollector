import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Rarity } from "../../types";
import { getRarityAccentColor } from "../../utils";

interface RarityFilterItemProps {
  rarity: Rarity;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

const RarityFilterItem: React.FC<RarityFilterItemProps> = ({
  rarity,
  count,
  isActive,
  onPress,
}) => {
  const accentColor = getRarityAccentColor(rarity);

  return (
    <TouchableOpacity
      style={[styles.statCard, isActive && styles.activeStatCard]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${rarity}: ${count} discovered`}
    >
      <Text style={[styles.statNumber, { color: accentColor }]}>{count}</Text>
      <Text style={styles.statLabel}>{rarity}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default RarityFilterItem;
