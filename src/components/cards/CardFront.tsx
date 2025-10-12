import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CelestialObject } from "../../types";
import {
  getTypeIcon,
  getTypePanelOverlay,
  getCardTextColor,
  getFrontCardStats,
  getCardFlavorText,
} from "../../utils";

interface CardFrontProps {
  object: CelestialObject;
}

const CardFront: React.FC<CardFrontProps> = ({ object }) => {
  const typeIcon = getTypeIcon(object.type);
  const panelColor = getTypePanelOverlay(object.type);
  const textColor = getCardTextColor(object.type);
  const frontStats = getFrontCardStats(object);
  const flavorText = getCardFlavorText(object);

  return (
    <View style={styles.container}>
      {/* Header Row - Full Width */}
      <View style={[styles.headerContainer, { backgroundColor: panelColor }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
            {object.name}
          </Text>
          <Text style={[styles.type, { color: textColor }]}>
            {typeIcon} {object.type}
          </Text>
        </View>
      </View>

      {/* Large Image Container */}
      <View style={[styles.imageContainer, { backgroundColor: panelColor }]}>
        <Text style={styles.emoji}>{object.image}</Text>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Flavor Text */}
      <View style={[styles.flavorContainer, { backgroundColor: panelColor }]}>
        <Text
          style={[styles.flavorText, { color: textColor }]}
          numberOfLines={3}
        >
          {flavorText}
        </Text>
      </View>

      {/* Key Stats */}
      <View style={[styles.statsContainer, { backgroundColor: panelColor }]}>
        {frontStats.length === 0 ? (
          <Text style={[styles.noStats, { color: textColor }]}>
            No stats available
          </Text>
        ) : (
          frontStats.map((stat) => (
            <View key={stat.key} style={styles.statRow}>
              <Text style={[styles.statKey, { color: textColor }]}>
                {stat.displayKey}
              </Text>
              <Text style={[styles.statValue, { color: textColor }]}>
                {stat.value}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Flip Hint */}
      <Text style={[styles.flipHint, { color: textColor }]}>Tap to flip</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerContainer: {
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
  },
  imageContainer: {
    width: "88%",
    height: "42%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 80,
  },
  flavorContainer: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  flavorText: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statKey: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  noStats: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.7,
  },
  flipHint: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
  },
});

export default CardFront;
