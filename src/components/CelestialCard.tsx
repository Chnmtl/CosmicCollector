import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CelestialObject } from '../types';

interface CelestialCardProps {
  object: CelestialObject;
  showBack?: boolean;
  onClose?: () => void;
  compact?: boolean;
}

const CelestialCard: React.FC<CelestialCardProps> = ({ 
  object, 
  showBack = false, 
  onClose,
  compact = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(showBack);

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return ['#4CAF50', '#2E7D32'];
      case 'Rare':
        return ['#2196F3', '#1565C0'];
      case 'Epic':
        return ['#9C27B0', '#6A1B9A'];
      case 'Legendary':
        return ['#FF9800', '#E65100'];
      default:
        return ['#4CAF50', '#2E7D32'];
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Star': return '⭐';
      case 'Planet': return '🪐';
      case 'Galaxy': return '🌌';
      case 'Exoplanet': return '🌎';
      case 'Nebula': return '☁️';
      case 'BlackHole': return '⚫';
      default: return '✨';
    }
  };

  const handleFlip = () => {
    if (!compact) {
      setIsFlipped(!isFlipped);
    }
  };

  const renderFront = () => (
    <View style={styles.cardContent}>
      <Text style={styles.objectIcon}>{object.image}</Text>
      <Text style={styles.objectName}>{object.name}</Text>
      <Text style={styles.objectType}>{getTypeIcon(object.type)} {object.type}</Text>
      {!compact && (
        <Text style={styles.flipHint}>Tap to flip</Text>
      )}
    </View>
  );

  const renderBack = () => (
    <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.objectIcon}>{object.image}</Text>
      <Text style={styles.objectNameBack}>{object.name}</Text>
      
      <View style={styles.xpContainer}>
        <Text style={styles.xpText}>+{object.xp} XP</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Stats</Text>
        {Object.entries(object.stats).map(([key, value]) => (
          value && (
            <View key={key} style={styles.statRow}>
              <Text style={styles.statKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          )
        ))}
      </View>

      {object.loot.length > 0 && (
        <View style={styles.lootSection}>
          <Text style={styles.sectionTitle}>💎 Loot</Text>
          <View style={styles.lootContainer}>
            {object.loot.map((item, index) => (
              <View key={index} style={styles.lootItem}>
                <Text style={styles.lootText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.loreSection}>
        <Text style={styles.sectionTitle}>📖 Lore</Text>
        <Text style={styles.loreText}>{object.lore}</Text>
      </View>

      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const cardSize = compact ? styles.compactCard : styles.fullCard;
  const rarityColors = getRarityColors(object.rarity);

  return (
    <TouchableOpacity
      style={[styles.card, cardSize]}
      onPress={handleFlip}
      activeOpacity={compact ? 1 : 0.8}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.cardGradient}
      >
        <LinearGradient
          colors={rarityColors as [string, string]}
          style={styles.rarityBorder}
        >
          <View style={styles.cardInner}>
            {isFlipped ? renderBack() : renderFront()}
          </View>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  fullCard: {
    width: 300,
    height: 450,
  },
  compactCard: {
    width: 150,
    height: 200,
  },
  cardGradient: {
    flex: 1,
    padding: 2,
  },
  rarityBorder: {
    flex: 1,
    borderRadius: 13,
    padding: 2,
  },
  cardInner: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 26, 0.95)',
    borderRadius: 11,
    padding: 15,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
  },
  objectIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  objectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  objectNameBack: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  objectType: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 20,
  },
  flipHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 10,
  },
  xpContainer: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  xpText: {
    color: '#00d4ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsSection: {
    width: '100%',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statKey: {
    fontSize: 12,
    color: '#aaa',
    flex: 1,
  },
  statValue: {
    fontSize: 12,
    color: '#fff',
    flex: 2,
    textAlign: 'right',
  },
  lootSection: {
    width: '100%',
    marginBottom: 15,
  },
  lootContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  lootItem: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lootText: {
    fontSize: 11,
    color: '#9C27B0',
    fontWeight: '500',
  },
  loreSection: {
    width: '100%',
    marginBottom: 20,
  },
  loreText: {
    fontSize: 12,
    color: '#ccc',
    lineHeight: 16,
    textAlign: 'justify',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#00d4ff',
    fontWeight: 'bold',
  },
});

export default CelestialCard;