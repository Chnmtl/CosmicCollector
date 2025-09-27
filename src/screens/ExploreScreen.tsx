import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { CelestialObject } from '../types';
import CelestialCard from '../components/CelestialCard';
import ProgressBar from '../components/ProgressBar';

const ExploreScreen: React.FC = () => {
  const [discoveredCard, setDiscoveredCard] = useState<CelestialObject | null>(null);
  const [showCard, setShowCard] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  const {
    userProgress,
    isExploring,
    exploreUniverse,
    canExplore,
    refillEnergy,
  } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      refillEnergy();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [refillEnergy]);

  useEffect(() => {
    if (discoveredCard) {
      setShowCard(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [discoveredCard]);

  const handleExplore = async () => {
    if (!canExplore()) {
      if (userProgress.energy <= 0) {
        Alert.alert(
          'No Energy',
          'You need energy to explore! Energy refills automatically over time.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    const card = await exploreUniverse();
    if (card) {
      setDiscoveredCard(card);
    } else {
      Alert.alert(
        'Exploration Complete',
        'You have discovered all available celestial objects!',
        [{ text: 'Amazing!' }]
      );
    }
  };

  const handleCloseCard = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCard(false);
      setDiscoveredCard(null);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return '#4CAF50';
      case 'Rare': return '#2196F3';
      case 'Epic': return '#9C27B0';
      case 'Legendary': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌌 Cosmic Explorer</Text>
        <Text style={styles.subtitle}>Discover the wonders of the universe</Text>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {userProgress.level}</Text>
          <Text style={styles.xpText}>{userProgress.xp}/{userProgress.xpToNextLevel} XP</Text>
        </View>
        <ProgressBar 
          current={userProgress.xp} 
          max={userProgress.xpToNextLevel} 
          color="#00d4ff"
        />
      </View>

      {/* Energy Section */}
      <View style={styles.energySection}>
        <Text style={styles.energyTitle}>⚡ Energy</Text>
        <View style={styles.energyContainer}>
          {Array.from({ length: userProgress.maxEnergy }, (_, i) => (
            <View
              key={i}
              style={[
                styles.energyOrb,
                i < userProgress.energy ? styles.energyOrbFilled : styles.energyOrbEmpty,
              ]}
            />
          ))}
        </View>
        <Text style={styles.energyText}>
          {userProgress.energy}/{userProgress.maxEnergy}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProgress.totalDiscovered}</Text>
          <Text style={styles.statLabel}>Discovered</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Object.values(userProgress.discoveredByType).reduce((a, b) => a + b, 0)}</Text>
          <Text style={styles.statLabel}>Total Objects</Text>
        </View>
      </View>

      {/* Explore Section */}
      <View style={styles.exploreSection}>
        <TouchableOpacity
          style={[
            styles.exploreButton,
            !canExplore() && styles.exploreButtonDisabled,
          ]}
          onPress={handleExplore}
          disabled={!canExplore()}
        >
          <LinearGradient
            colors={
              canExplore()
                ? ['#00d4ff', '#0099cc']
                : ['#666', '#444']
            }
            style={styles.exploreButtonGradient}
          >
            <Text style={styles.exploreButtonText}>
              {isExploring ? '🔍 Exploring...' : '🚀 Explore Universe'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {!canExplore() && userProgress.energy <= 0 && (
          <Text style={styles.cooldownText}>
            Energy will refill automatically over time
          </Text>
        )}
      </View>

      {/* Discovered Card Modal */}
      {showCard && discoveredCard && (
        <Animated.View
          style={[
            styles.cardModal,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.cardContainer}>
            <CelestialCard 
              object={discoveredCard} 
              showBack={true}
              onClose={handleCloseCard}
            />
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(discoveredCard.rarity) }]}>
              <Text style={styles.rarityText}>{discoveredCard.rarity}</Text>
            </View>
          </View>
        </Animated.View>
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
    marginBottom: 30,
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
  progressSection: {
    marginBottom: 25,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  xpText: {
    fontSize: 14,
    color: '#aaa',
  },
  energySection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  energyTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  energyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  energyOrb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 3,
  },
  energyOrbFilled: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  energyOrbEmpty: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  energyText: {
    fontSize: 12,
    color: '#aaa',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  exploreSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreButton: {
    width: '80%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 15,
  },
  exploreButtonDisabled: {
    opacity: 0.5,
  },
  exploreButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cooldownText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
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
  cardContainer: {
    position: 'relative',
  },
  rarityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ExploreScreen;