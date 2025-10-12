import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { CelestialObject } from "../../types";
import {
  getTypeIcon,
  getTypePanelOverlay,
  getCardTextColor,
  getBackCardStats,
  getCardDescription,
} from "../../utils";

interface CardBackProps {
  object: CelestialObject;
}

const CardBack: React.FC<CardBackProps> = ({ object }) => {
  const typeIcon = getTypeIcon(object.type);
  const panelColor = getTypePanelOverlay(object.type);
  const textColor = getCardTextColor(object.type);
  const backStats = getBackCardStats(object);
  const description = getCardDescription(object);

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Small Image */}
      <View
        style={[styles.smallImageContainer, { backgroundColor: panelColor }]}
      >
        <Text style={styles.smallEmoji}>{object.image}</Text>
      </View>

      {/* Description */}
      <View
        style={[styles.descriptionContainer, { backgroundColor: panelColor }]}
      >
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Description
        </Text>
        <ScrollView
          style={styles.scrollContent}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.descriptionText, { color: textColor }]}>
            {description}
          </Text>
        </ScrollView>
      </View>

      {/* Additional Stats */}
      {backStats.length > 0 && (
        <View style={[styles.statsContainer, { backgroundColor: panelColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Additional Stats
          </Text>
          <ScrollView
            style={styles.scrollContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {backStats.map((stat) => (
              <View key={stat.key} style={styles.statRow}>
                <Text style={[styles.statKey, { color: textColor }]}>
                  {stat.displayKey}
                </Text>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Loot */}
      {object.loot && object.loot.length > 0 && (
        <View style={[styles.lootContainer, { backgroundColor: panelColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Loot</Text>
          <ScrollView
            style={styles.scrollContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {object.loot.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.lootItem,
                  { backgroundColor: "rgba(255,255,255,0.08)" },
                ]}
              >
                <Text style={[styles.lootText, { color: textColor }]}>
                  • {item}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Flip Hint */}
      <Text style={[styles.flipHint, { color: textColor }]}>Tap to flip</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 8,
  },
  headerContainer: {
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
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
  smallImageContainer: {
    width: "60%",
    height: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  smallEmoji: {
    fontSize: 48,
  },
  descriptionContainer: {
    width: "100%",
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  scrollContent: {
    maxHeight: 70,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsContainer: {
    width: "100%",
    maxHeight: 110,
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
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  lootContainer: {
    width: "100%",
    maxHeight: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  lootItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  lootText: {
    fontSize: 12,
    fontWeight: "600",
  },
  flipHint: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
    alignSelf: "center",
  },
});

export default CardBack;
