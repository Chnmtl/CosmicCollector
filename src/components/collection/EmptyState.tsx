import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default EmptyState;
