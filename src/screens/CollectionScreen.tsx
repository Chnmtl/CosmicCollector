import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { CelestialObject, CelestialObjectType } from '../types';
import CelestialCard from '../components/CelestialCard';

const CollectionScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<CelestialObjectType | 'All'>('All');
  const [selectedCard, setSelectedCard] = useState<CelestialObject | null>(null);

  const { discoveredObjects, userProgress } = useGameStore();

  const filters: (CelestialObjectType | 'All')[] = [
    'All', 'Star', 'Planet', 'Galaxy', 'Exoplanet', 'Nebula', 'BlackHole'
  ];

  const getFilterIcon = (filter: CelestialObjectType | 'All') => {
    switch (filter) {
      case 'All': return '🌌';
      case 'Star': return '⭐';
      case 'Planet': return '🪐';
      case 'Galaxy': return '🌌';
      case 'Exoplanet': return '🌎';
      case 'Nebula': return '☁️';
      case 'BlackHole': return '⚫';
      default: return '✨';
    }
  };

  const filteredObjects = selectedFilter === 'All' 
    ? discoveredObjects 
    : discoveredObjects.filter(obj => obj.type === selectedFilter);

  const getRarityStats = () => {
    const stats = { Common: 0, Rare: 0, Epic: 0, Legendary: 0 };
    discoveredObjects.forEach(obj => {
      stats[obj.rarity]++;
    });
    return stats;
  };

  const getTypeStats = () => {
    return userProgress.discoveredByType;
  };

  const renderCard = ({ item }: { item: CelestialObject }) => (
    <TouchableOpacity 
      style={styles.cardWrapper}
      onPress={() => setSelectedCard(item)}
    >
      <CelestialCard object={item} compact={true} />
    </TouchableOpacity>
  );

  const renderFilter = (filter: CelestialObjectType | 'All') => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={styles.filterIcon}>{getFilterIcon(filter)}</Text>
      <Text style={[
        styles.filterText,
        selectedFilter === filter && styles.activeFilterText,
      ]}>
        {filter}
      </Text>
      {filter !== 'All' && (
        <Text style={styles.filterCount}>
          {filter === 'All' ? discoveredObjects.length : getTypeStats()[filter]}
        </Text>
      )}
    </TouchableOpacity>
  );

  const rarityStats = getRarityStats();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📱 Collection</Text>
        <Text style={styles.subtitle}>
          {discoveredObjects.length} objects discovered
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{rarityStats.Common}</Text>
            <Text style={styles.statLabel}>Common</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#2196F3' }]}>{rarityStats.Rare}</Text>
            <Text style={styles.statLabel}>Rare</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#9C27B0' }]}>{rarityStats.Epic}</Text>
            <Text style={styles.statLabel}>Epic</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FF9800' }]}>{rarityStats.Legendary}</Text>
            <Text style={styles.statLabel}>Legendary</Text>
          </View>
        </ScrollView>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map(renderFilter)}
      </ScrollView>

      {/* Collection Grid */}
      <View style={styles.collectionContainer}>
        {discoveredObjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚀</Text>
            <Text style={styles.emptyTitle}>Start Your Journey</Text>
            <Text style={styles.emptyText}>
              Explore the universe to discover celestial objects and build your collection!
            </Text>
          </View>
        ) : filteredObjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{getFilterIcon(selectedFilter)}</Text>
            <Text style={styles.emptyTitle}>No {selectedFilter} Objects</Text>
            <Text style={styles.emptyText}>
              Keep exploring to discover more {selectedFilter.toLowerCase()} objects!
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredObjects}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>

      {/* Selected Card Modal */}
      {selectedCard && (
        <View style={styles.cardModal}>
          <View style={styles.modalBackground}>
            <CelestialCard 
              object={selectedCard} 
              showBack={true}
              onClose={() => setSelectedCard(null)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  statsSection: {
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    minWidth: 70,
  },
  activeFilterButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
  },
  filterIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  filterText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#00d4ff',
    fontWeight: 'bold',
  },
  filterCount: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  collectionContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 5,
  },
  cardWrapper: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackground: {
    alignItems: 'center',
  },
});

export default CollectionScreen;