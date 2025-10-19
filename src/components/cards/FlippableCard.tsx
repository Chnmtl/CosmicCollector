import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CosmicObject } from "../../models";
import {
  getRarityColors,
  getTypeBackground,
  CARD_DIMENSIONS,
} from "../../utils";
import CardFront from "./CardFront";
import CardBack from "./CardBack";

interface FlippableCardProps {
  object: CosmicObject;
  onClose?: () => void;
  initialSide?: "front" | "back";
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  object,
  onClose,
  initialSide = "front",
}) => {
  const [isFlipped, setIsFlipped] = useState(initialSide === "back");

  // Animated value for flip rotation (0 to 180 degrees)
  const flipAnimation = useRef(
    new Animated.Value(initialSide === "back" ? 180 : 0)
  ).current;

  const rarityColors = getRarityColors(object.rarity);
  const backgroundColor = getTypeBackground(object.type);

  // Handle flip animation
  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 180;

    Animated.spring(flipAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 10,
      friction: 8,
    }).start();

    setIsFlipped(!isFlipped);
  };

  // Interpolate rotation for front side (0 to 180 degrees)
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  // Interpolate rotation for back side (180 to 360 degrees)
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  // Interpolate opacity for smooth transition
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [0, 0, 1],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  return (
    <View style={styles.card}>
      {/* Outer gradient glow */}
      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
        style={styles.cardGradient}
      >
        {/* Rarity border */}
        <LinearGradient colors={rarityColors} style={styles.rarityBorder}>
          {/* Card inner container */}
          <View style={[styles.cardInner, { backgroundColor }]}>
            {/* Front side */}
            <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
              <Pressable style={styles.pressable} onPress={handleFlip}>
                <CardFront object={object} />
              </Pressable>
            </Animated.View>

            {/* Back side */}
            <Animated.View
              style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}
            >
              <Pressable style={styles.pressable} onPress={handleFlip}>
                <CardBack object={object} />
              </Pressable>
            </Animated.View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_DIMENSIONS.FULL.width,
    height: CARD_DIMENSIONS.FULL.height,
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
    position: "relative",
  },
  cardSide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
  },
  cardBack: {
    // Back side is positioned absolutely on top of front
  },
  pressable: {
    flex: 1,
  },
});

export default FlippableCard;
