import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  max, 
  color = '#00d4ff',
  height = 8 
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.background} />
      <LinearGradient
        colors={[color, `${color}80`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.fill,
          { 
            width: `${percentage}%`,
            height,
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  fill: {
    borderRadius: 10,
    shadowColor: 'rgba(0, 212, 255, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});

export default ProgressBar;