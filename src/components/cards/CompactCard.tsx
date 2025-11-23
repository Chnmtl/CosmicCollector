import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CosmicObject } from "../../models";
import {
  getRarityColors,
  getTypeIcon,
  getTypeBackground,
  getTypePanelOverlay,
  getCardTextColor,
  CARD_DIMENSIONS,
} from "../../utils";

interface CompactCardProps {
  object: CosmicObject;
  onPress?: () => void;
}

const CompactCard: React.FC<CompactCardProps> = ({ object, onPress }) => {
  const rarityColors = getRarityColors(object.rarity);
  const typeIcon = getTypeIcon(object.type);
  const backgroundColor = getTypeBackground(object.type);
  const panelColor = getTypePanelOverlay(object.type);
  const textColor = getCardTextColor(object.type);

  // Create dynamic styles based on object type
  const dynamicStyles = StyleSheet.create({
    cardInnerWithBackground: {
      backgroundColor: backgroundColor,
    },
    panelWithBackground: {
      backgroundColor: panelColor,
    },
    textWithColor: {
      color: textColor,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Outer gradient glow */}
        <LinearGradient
          colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
          style={styles.cardGradient}
        >
          {/* Rarity border */}
          <LinearGradient colors={rarityColors} style={styles.rarityBorder}>
            {/* Card inner content */}
            <View
              style={[styles.cardInner, dynamicStyles.cardInnerWithBackground]}
            >
              {/* Image/Icon container */}
              <View
                style={[
                  styles.imageContainer,
                  dynamicStyles.panelWithBackground,
                ]}
              >
                {object.imageUrl ? (
                  <Image
                    source={
                      typeof object.imageUrl === "string"
                        ? { uri: object.imageUrl }
                        : object.imageUrl
                    }
                    style={styles.planetImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.emoji}>{typeIcon}</Text>
                )}
              </View>

              {/* Name and type container */}
              <View
                style={[
                  styles.infoContainer,
                  dynamicStyles.panelWithBackground,
                ]}
              >
                <Text
                  style={[styles.name, dynamicStyles.textWithColor]}
                  numberOfLines={2}
                >
                  {object.name}
                </Text>
                <Text style={[styles.type, dynamicStyles.textWithColor]}>
                  {typeIcon} {object.type}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // No styles needed, container handles layout
  },
  card: {
    width: CARD_DIMENSIONS.COMPACT.width,
    height: CARD_DIMENSIONS.COMPACT.height,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardGradient: {
    flex: 1,
    padding: 4,
  },
  rarityBorder: {
    flex: 1,
    borderRadius: 12,
    padding: 6,
  },
  cardInner: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
  },
  imageContainer: {
    width: 92,
    height: 92,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  planetImage: {
    width: "100%",
    height: "100%",
  },
  emoji: {
    fontSize: 56,
  },
  infoContainer: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default CompactCard;
