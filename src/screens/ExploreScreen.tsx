import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { CelestialObject } from '../types';
import CelestialCard from '../components/CelestialCard';
import ProgressBar from '../components/ProgressBar';
import ParticleEffect from '../components/ParticleEffect';

const ExploreScreen: React.FC = () => {
  const [discoveredCard, setDiscoveredCard] = useState<CelestialObject | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  const {
    userProgress,
    isExploring,
    exploreUniverse,
    canExplore,
    refillEnergy,
    availableObjects,
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
      
      // Show particles for rare cards
      if (discoveredCard.rarity !== 'Common') {
        setShowParticles(true);
      }

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
    setShowParticles(false);
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
      {/* Header bar */}
      <LinearGradient colors={["#061226", "#071029"]} style={styles.headerBar}>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 20 }}>🪐</Text>
        </View>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Cosmic Explorer</Text>
          <Text style={styles.subtitle}>Discover the wonders of the universe</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Badges row */}
      <View style={styles.badgesRow}>
        <View style={styles.badgeCard}>
          <Text style={styles.badgeLabel}>Energy</Text>
          <Text style={styles.badgeValue}>⚡ {userProgress.energy}/{userProgress.maxEnergy}</Text>
        </View>
        <View style={styles.badgeCard}>
          <Text style={styles.badgeLabel}>Discovered</Text>
          <Text style={styles.badgeValue}>⭐ {userProgress.totalDiscovered} / {availableObjects.length}</Text>
        </View>
      </View>

      {/* Compact Progress / Level */}
      <View style={styles.topCard}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {userProgress.level}</Text>
          <Text style={styles.xpText}>{userProgress.xp}/{userProgress.xpToNextLevel} XP</Text>
        </View>
        <ProgressBar 
          current={userProgress.xp} 
          max={userProgress.xpToNextLevel} 
          color="#00d4ff"
          height={8}
        />
      </View>

      {/* Decorative space scene with Explore button */}
      <View style={styles.spaceScene}>
        <LinearGradient
          colors={["#071029", "#0a0a1a"]}
          style={styles.spaceGradient}
        />
        {/* small star dots */}
        <View style={styles.starsContainer} pointerEvents="none">
          {Array.from({ length: 18 }).map((_, i) => (
            <View key={i} style={[styles.star, { top: (i * 37) % 200 + 10, left: (i * 73) % 320 + 10, opacity: (i % 3) / 3 + 0.4 }]} />
          ))}
        </View>

        <View style={styles.exploreInner}>
          <View style={styles.exploreGlow}>
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
                    ? ['#7CEAFF', '#0066FF']
                    : ['#444', '#222']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.exploreButtonGradient}
              >
                <Text style={styles.exploreButtonText}>
                  {isExploring ? '🔍 Exploring...' : 'Explore'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {!canExplore() && userProgress.energy <= 0 && (
            <Text style={styles.cooldownText}>
              Energy will refill automatically over time
            </Text>
          )}
        </View>
      </View>

      {/* Particle Effect */}
      <ParticleEffect 
        show={showParticles} 
        rarity={discoveredCard?.rarity || 'Common'} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // reduced top padding so header sits closer to top (removes unnecessary empty spot)
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  topHeader: {
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
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
    width: 220,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    // button bottom spacing handled by parent container now
    marginBottom: 0,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
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
    color: '#001018',
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
  /* New styles for updated layout */
  headerBar: {
    height: 84,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  badgeLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  badgeValue: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 6,
  },
  energyBadge: {
    // kept for backward compatibility if used elsewhere
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  energyBadgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  topCard: {
    marginBottom: 18,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  statSummary: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statLabelSmall: {
    color: '#aaa',
    fontSize: 12,
  },
  statNumberLarge: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  exploreHint: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  discoveredBadge: {
    // kept for backward compatibility if used elsewhere
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  discoveredBadgeText: {
    color: '#fff',
    fontWeight: '700',
  },
  spaceScene: {
    flex: 1,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    // keep relative positioning so absolutely positioned children are anchored to this box
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#071029',
  },
  spaceGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  exploreInner: {
    // anchor the button container to the bottom of the spaceScene
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  exploreGlow: {
    shadowColor: '#7CEAFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    borderRadius: 34,
  },
});

export default ExploreScreen;