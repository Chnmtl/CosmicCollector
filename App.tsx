import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePlayerStore } from "./src/store/playerStore";
import { useCollectionStore } from "./src/store/collectionStore";
import { useInventoryStore } from "./src/store/inventoryStore";
import ExploreScreen from "./src/screens/ExploreScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import MissionsScreen from "./src/screens/MissionsScreen";
import TabBar from "./src/components/TabBar";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "explore" | "collection" | "missions"
  >("explore");

  // New stores
  const loadProgress = usePlayerStore((state) => state.loadProgress);
  const loadCollection = useCollectionStore((state) => state.loadCollection);
  const loadInventory = useInventoryStore((state) => state.loadInventory);
  const loadCatalog = useCollectionStore((state) => state.loadCatalog);

  useEffect(() => {
    const initializeApp = async () => {
      console.log("🚀 Initializing Cosmic Collector...");

      // Load all stores
      await Promise.all([loadProgress(), loadCollection(), loadInventory()]);

      // Load catalog (planets, moons, etc. from API)
      await loadCatalog();

      console.log("✅ App initialized!");
    };

    initializeApp();
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case "explore":
        return <ExploreScreen />;
      case "collection":
        return <CollectionScreen />;
      case "missions":
        return <MissionsScreen />;
      default:
        return <ExploreScreen />;
    }
  };

  return (
    <LinearGradient
      colors={["#0a0a1a", "#1a1a2e", "#16213e"]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.content}>{renderScreen()}</View>
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
