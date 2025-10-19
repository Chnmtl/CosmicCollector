import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePlayerStore, useCollectionStore } from "../store";
import { defaultMissions } from "../data/missions";
import ProgressBar from "../components/ProgressBar";

const MissionsScreen: React.FC = () => {
  const { progress } = usePlayerStore();
  const { getDiscoveredObjects, resetCollection } = useCollectionStore();

  // Get discovered objects
  const discoveredObjects = getDiscoveredObjects();

  const getMissionProgress = (mission: any) => {
    switch (mission.type) {
      case "discover":
        if (mission.targetType) {
          return discoveredObjects.filter(
            (obj) => obj.type === mission.targetType
          ).length;
        } else {
          return discoveredObjects.length;
        }
      case "level":
        return progress.level;
      case "collect":
        if (mission.id === "rare-hunter") {
          return discoveredObjects.filter((obj) =>
            ["Rare", "Epic", "Legendary"].includes(obj.rarity)
          ).length;
        } else if (mission.id === "legendary-seeker") {
          return discoveredObjects.filter((obj) => obj.rarity === "Legendary")
            .length;
        }
        return 0;
      default:
        return 0;
    }
  };

  const getCompletionPercentage = (mission: any) => {
    const current = getMissionProgress(mission);
    return Math.min((current / mission.target) * 100, 100);
  };

  const isCompleted = (mission: any) => {
    return getMissionProgress(mission) >= mission.target;
  };

  const getRewardText = (mission: any) => {
    const xpText = `${mission.reward.xp} XP`;
    const lootText = mission.reward.loot ? mission.reward.loot.join(", ") : "";
    return lootText ? `${xpText} + ${lootText}` : xpText;
  };

  const getMissionIcon = (mission: any) => {
    switch (mission.type) {
      case "discover":
        if (mission.targetType === "Star") return "⭐";
        if (mission.targetType === "Planet") return "🪐";
        if (mission.targetType === "Moon") return "🌕";
        if (mission.targetType === "Galaxy") return "🌌";
        return "🔍";
      case "level":
        return "📈";
      case "collect":
        return "💎";
      default:
        return "🎯";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Missions</Text>
        <Text style={styles.subtitle}>Complete challenges to earn rewards</Text>
      </View>

      {/* Missions List */}
      <ScrollView
        style={styles.missionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {defaultMissions.map((mission) => {
          const current = getMissionProgress(mission);
          const completed = isCompleted(mission);
          const percentage = getCompletionPercentage(mission);

          return (
            <View
              key={mission.id}
              style={[
                styles.missionCard,
                completed && styles.completedMissionCard,
              ]}
            >
              <LinearGradient
                colors={
                  completed
                    ? ["rgba(76, 175, 80, 0.2)", "rgba(76, 175, 80, 0.1)"]
                    : ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
                }
                style={styles.missionGradient}
              >
                <View style={styles.missionHeader}>
                  <Text style={styles.missionIcon}>
                    {getMissionIcon(mission)}
                  </Text>
                  <View style={styles.missionInfo}>
                    <Text
                      style={[
                        styles.missionTitle,
                        completed && styles.completedText,
                      ]}
                    >
                      {mission.title}
                    </Text>
                    <Text style={styles.missionDescription}>
                      {mission.description}
                    </Text>
                  </View>
                  {completed && <Text style={styles.completedBadge}>✅</Text>}
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>
                      {current}/{mission.target}
                    </Text>
                    <Text style={styles.percentageText}>
                      {Math.round(percentage)}%
                    </Text>
                  </View>
                  <ProgressBar
                    current={current}
                    max={mission.target}
                    color={completed ? "#4CAF50" : "#00d4ff"}
                    height={6}
                  />
                </View>

                {completed && (
                  <View style={styles.rewardContainer}>
                    <Text style={styles.rewardLabel}>🎁 Reward:</Text>
                    <Text style={styles.rewardText}>
                      {getRewardText(mission)}
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </View>
          );
        })}

        {/* DEBUG: Clear Progress Button */}
        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>🛠️ Debug Tools</Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => resetCollection()}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>
              🧹 Clear All Discovered Objects
            </Text>
          </TouchableOpacity>
          <Text style={styles.debugInfo}>
            Use this to reset and test object discovery from scratch
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
  },
  missionsContainer: {
    flex: 1,
  },
  missionCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  completedMissionCard: {
    opacity: 0.8,
  },
  missionGradient: {
    padding: 15,
  },
  missionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  missionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  completedText: {
    color: "#4CAF50",
  },
  missionDescription: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 18,
  },
  completedBadge: {
    fontSize: 20,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  percentageText: {
    fontSize: 12,
    color: "#aaa",
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  rewardLabel: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
    marginRight: 8,
  },
  rewardText: {
    fontSize: 14,
    color: "#aaa",
    flex: 1,
  },
  debugSection: {
    marginTop: 30,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 152, 0, 0.3)",
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9800",
    marginBottom: 15,
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "rgba(244, 67, 54, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  debugInfo: {
    fontSize: 12,
    color: "#FF9800",
    textAlign: "center",
    opacity: 0.8,
  },
});

export default MissionsScreen;
