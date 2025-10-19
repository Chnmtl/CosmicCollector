import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useCollectionStore } from "../store/collectionStore";
import { CosmicObject, CosmicObjectType, Rarity } from "../models";
import { CompactCard, FlippableCard } from "../components/cards";
import {
  CollectionHeader,
  RarityFilter,
  TypeFilter,
  EmptyState,
} from "../components/collection";
import { filterObjects, GRID_CONFIG } from "../utils";

const CollectionScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<CosmicObjectType | "All">(
    "All"
  );
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "All">("All");
  const [selectedCard, setSelectedCard] = useState<CosmicObject | null>(null);

  const { getDiscoveredObjects } = useCollectionStore();
  const { width: windowWidth } = useWindowDimensions();

  // Get discovered objects as CosmicObject array
  const discoveredCosmicObjects = getDiscoveredObjects();

  // Filter objects using utility function (works with CosmicObject)
  const filteredObjects = useMemo(
    () => filterObjects(discoveredCosmicObjects, selectedType, selectedRarity),
    [discoveredCosmicObjects, selectedType, selectedRarity]
  );

  // Calculate responsive columns for grid
  const numColumns = useMemo(() => {
    const availableWidth = Math.max(
      0,
      windowWidth - GRID_CONFIG.HORIZONTAL_PADDING
    );
    const computedColumns = Math.max(
      1,
      Math.min(
        GRID_CONFIG.MAX_COLUMNS,
        Math.floor(availableWidth / GRID_CONFIG.CARD_TARGET_WIDTH)
      )
    );
    return Math.max(GRID_CONFIG.MIN_COLUMNS, computedColumns);
  }, [windowWidth]);

  // Render card item for FlatList
  const renderCard = ({ item }: { item: any }) => (
    <View style={styles.cardWrapper}>
      <CompactCard object={item} onPress={() => setSelectedCard(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <CollectionHeader totalObjects={discoveredCosmicObjects.length} />

      {/* Rarity Filter */}
      <RarityFilter
        objects={discoveredCosmicObjects}
        selectedRarity={selectedRarity}
        onSelectRarity={setSelectedRarity}
      />

      {/* Type Filter */}
      <TypeFilter
        objects={discoveredCosmicObjects}
        allObjects={discoveredCosmicObjects}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      {/* Collection Grid */}
      <View style={styles.collectionContainer}>
        {discoveredCosmicObjects.length === 0 ? (
          <EmptyState
            icon="🚀"
            title="Start Your Journey"
            message="Explore the universe to discover celestial objects and build your collection!"
          />
        ) : filteredObjects.length === 0 ? (
          <EmptyState
            icon={selectedType === "All" ? "🌌" : "✨"}
            title={`No ${
              selectedType === "All" ? "Objects" : selectedType
            } Found`}
            message={`Keep exploring to discover more ${
              selectedType === "All" ? "" : selectedType.toLowerCase()
            } objects!`}
          />
        ) : (
          <FlatList
            key={`grid-${numColumns}`}
            data={filteredObjects}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>

      {/* Detailed Card Modal */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCard(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedCard(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View>
                {selectedCard && (
                  <FlippableCard
                    object={selectedCard}
                    onClose={() => setSelectedCard(null)}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  collectionContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 6,
  },
  cardWrapper: {
    flex: 1,
    margin: 6,
    alignItems: "center",
    minHeight: 200,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CollectionScreen;
