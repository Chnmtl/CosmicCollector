import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CosmicObject } from "../../models";
import { Moon } from "../../models/Moon";
import { getTypeIcon } from "../../utils";

interface CardHeaderProps {
  object: CosmicObject;
  textColor: string;
  backgroundColor: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  object,
  textColor,
  backgroundColor,
}) => {
  const typeIcon = getTypeIcon(object.type);

  // Get parent planet name for moons
  const parentPlanetName =
    object.type === "Moon" && "moonData" in object
      ? (object as Moon).moonData.parentPlanetName
      : undefined;

  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <View style={styles.headerRow}>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
            {object.name}
            {parentPlanetName && (
              <Text style={[styles.parentPlanet, { color: textColor }]}>
                {" "}
                · moon of {parentPlanetName}
              </Text>
            )}
          </Text>
        </View>
        <Text style={[styles.type, { color: textColor }]}>
          {typeIcon} {object.type}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  parentPlanet: {
    fontSize: 11,
    fontWeight: "500",
    opacity: 0.7,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CardHeader;
