import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CosmicObject } from "../../models";
import {
  getTypeIcon,
  getTypePanelOverlay,
  getCardTextColor,
  getObjectStats,
} from "../../utils";

interface CardBackProps {
  object: CosmicObject;
}

const CardBack: React.FC<CardBackProps> = ({ object }) => {
  const typeIcon = getTypeIcon(object.type);
  const panelColor = getTypePanelOverlay(object.type);
  const textColor = getCardTextColor(object.type);
  const stats = getObjectStats(object);

  // Create dynamic styles based on object type
  const dynamicStyles = StyleSheet.create({
    panelWithBackground: {
      backgroundColor: panelColor,
    },
    textWithColor: {
      color: textColor,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header - Name and Type */}
      <View style={[styles.headerContainer, dynamicStyles.panelWithBackground]}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.name, dynamicStyles.textWithColor]}
            numberOfLines={1}
          >
            {object.name}
          </Text>
          <Text style={[styles.type, dynamicStyles.textWithColor]}>
            {typeIcon} {object.type}
          </Text>
        </View>
      </View>

      {/* Lore/Description Section - More lines for better readability */}
      <View style={[styles.loreContainer, dynamicStyles.panelWithBackground]}>
        <Text style={[styles.sectionTitle, dynamicStyles.textWithColor]}>
          Lore
        </Text>
        <Text
          style={[styles.loreText, dynamicStyles.textWithColor]}
          numberOfLines={5}
        >
          {object.description || "A mysterious celestial object."}
        </Text>
      </View>

      {/* Stats Section - Show all stats */}
      {Object.keys(stats).length > 0 && (
        <View
          style={[styles.statsContainer, dynamicStyles.panelWithBackground]}
        >
          <Text style={[styles.sectionTitle, dynamicStyles.textWithColor]}>
            Stats
          </Text>
          <View style={styles.statsGrid}>
            {Object.entries(stats).map(([key, value]) => (
              <View key={key} style={styles.statRow}>
                <Text
                  style={[styles.statKey, dynamicStyles.textWithColor]}
                  numberOfLines={1}
                >
                  {key}
                </Text>
                <Text
                  style={[styles.statValue, dynamicStyles.textWithColor]}
                  numberOfLines={1}
                >
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : String(value)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Flip Hint */}
      <Text style={[styles.flipHint, dynamicStyles.textWithColor]}>
        Tap to flip
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 6,
  },
  headerContainer: {
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  type: {
    fontSize: 13,
    fontWeight: "600",
  },
  loreContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  loreText: {
    fontSize: 11,
    lineHeight: 14,
  },
  statsContainer: {
    width: "100%",
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  statsGrid: {
    flex: 1,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
    paddingVertical: 1,
  },
  statKey: {
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
    marginRight: 6,
  },
  statValue: {
    fontSize: 11,
    fontWeight: "700",
    flex: 1.2,
    textAlign: "right",
  },
  flipHint: {
    fontSize: 9,
    opacity: 0.6,
    marginTop: 2,
    alignSelf: "center",
  },
});

export default CardBack;
