import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { CosmicObject } from "../../models";
import {
  getTypeIcon,
  getTypePanelOverlay,
  getCardTextColor,
  getRarityAccentColor,
} from "../../utils";

interface CardFrontProps {
  object: CosmicObject;
}

const CardFront: React.FC<CardFrontProps> = ({ object }) => {
  const typeIcon = getTypeIcon(object.type);
  const panelColor = getTypePanelOverlay(object.type);
  const textColor = getCardTextColor(object.type);
  const rarityColor = getRarityAccentColor(object.rarity);

  // Create dynamic styles based on object type
  const dynamicStyles = StyleSheet.create({
    panelWithBackground: {
      backgroundColor: panelColor,
    },
    textWithColor: {
      color: textColor,
    },
    rarityTextWithColor: {
      color: rarityColor,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header Row - Name and Type */}
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

      {/* Rarity Badge */}
      <View style={[styles.rarityContainer, dynamicStyles.panelWithBackground]}>
        <Text style={[styles.rarityText, dynamicStyles.rarityTextWithColor]}>
          ★ {object.rarity}
        </Text>
      </View>

      {/* Large Image Container */}
      <View style={[styles.imageContainer, dynamicStyles.panelWithBackground]}>
        {object.imageUrl ? (
          <Image
            source={{ uri: object.imageUrl }}
            style={styles.planetImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.emoji}>{typeIcon}</Text>
        )}
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

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
  rarityContainer: {
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    alignItems: "center",
  },
  rarityText: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  imageContainer: {
    width: "88%",
    height: "60%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  planetImage: {
    width: "100%",
    height: "100%",
  },
  emoji: {
    fontSize: 100,
  },
  flipHint: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
  },
  spacer: {
    flex: 1,
  },
});

export default CardFront;
