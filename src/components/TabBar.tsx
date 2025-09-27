import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TabBarProps {
  activeTab: 'explore' | 'collection';
  onTabChange: (tab: 'explore' | 'collection') => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <LinearGradient
      colors={['rgba(26, 26, 46, 0.95)', 'rgba(16, 33, 62, 0.95)']}
      style={styles.container}
    >
      <TouchableOpacity
        style={[styles.tab, activeTab === 'explore' && styles.activeTab]}
        onPress={() => onTabChange('explore')}
      >
        <Text style={styles.tabIcon}>🚀</Text>
        <Text style={[styles.tabText, activeTab === 'explore' && styles.activeTabText]}>
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'collection' && styles.activeTab]}
        onPress={() => onTabChange('collection')}
      >
        <Text style={styles.tabIcon}>📱</Text>
        <Text style={[styles.tabText, activeTab === 'collection' && styles.activeTabText]}>
          Collection
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00d4ff',
  },
});

export default TabBar;