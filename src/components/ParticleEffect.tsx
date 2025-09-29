import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

interface ParticleEffectProps {
  show: boolean;
  rarity: string;
  duration?: number;
}

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ 
  show, 
  rarity, 
  duration = 2000 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Rare': return '#2196F3';
      case 'Epic': return '#9C27B0';
      case 'Legendary': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const getParticleCount = (rarity: string) => {
    switch (rarity) {
      case 'Rare': return 15;
      case 'Epic': return 25;
      case 'Legendary': return 40;
      default: return 10;
    }
  };

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    const particleCount = getParticleCount(rarity);
    const color = getRarityColor(rarity);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        id: i,
        x: new Animated.Value(screenWidth / 2),
        y: new Animated.Value(screenHeight / 2),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(0),
        color,
      };

      newParticles.push(particle);

      // Animate particle
      const randomX = Math.random() * screenWidth;
      const randomY = Math.random() * screenHeight;
      const delay = Math.random() * 200;

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(particle.scale, {
            toValue: Math.random() * 1.5 + 0.5,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(particle.x, {
            toValue: randomX,
            duration: duration * 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: randomY,
            duration: duration * 0.8,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(duration * 0.6),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    }

    setParticles(newParticles);

    // Clean up after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timeout);
  }, [show, rarity, duration, screenWidth, screenHeight]);

  if (!show || particles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});

export default ParticleEffect;