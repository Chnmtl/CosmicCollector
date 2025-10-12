import React, { useState } from "react";
import { View, ScrollView, StyleSheet, ViewStyle } from "react-native";

interface ResponsiveStripProps {
  children: React.ReactNode;
  centerStyle?: ViewStyle;
  scrollStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  horizontal?: boolean;
}

const ResponsiveStrip: React.FC<ResponsiveStripProps> = ({
  children,
  centerStyle,
  scrollStyle,
  containerStyle,
  horizontal = true,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const handleLayout = (e: any) => {
    const w = e.nativeEvent.layout.width || 0;
    setContainerWidth(w);
  };

  const handleContentSizeChange = (w: number, h: number) => {
    if (typeof w === "number") setContentWidth(w);
  };

  const shouldCenter =
    contentWidth > 0 && containerWidth > 0 && contentWidth <= containerWidth;

  return (
    <View style={containerStyle} onLayout={handleLayout}>
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={shouldCenter ? centerStyle : scrollStyle}
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default ResponsiveStrip;
