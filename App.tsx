import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from './src/store/gameStore';
import ExploreScreen from './src/screens/ExploreScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import TabBar from './src/components/TabBar';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'collection'>('explore');
  const loadProgress = useGameStore(state => state.loadProgress);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreScreen />;
      case 'collection':
        return <CollectionScreen />;
      default:
        return <ExploreScreen />;
    }
  };

  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 50, // Status bar padding
  },
});
