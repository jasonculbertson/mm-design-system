import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ThemeProvider, useTheme, useAppColors } from "../lib/ThemeContext";
import { Sidebar } from "../components/ui/Sidebar";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const appColors = useAppColors();

  return (
    <Pressable 
      onPress={toggleTheme} 
      style={{
        position: "absolute",
        top: 16,
        right: 20,
        zIndex: 100,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: appColors.chromeBgSubtle,
        borderWidth: 1,
        borderColor: appColors.chromeBorder,
      }}
    >
      <Text style={{ fontSize: 14 }}>
        {theme === "dark" ? "☀️" : "🌙"}
      </Text>
      <Text style={{ fontSize: 13, fontWeight: "500", color: appColors.chromeTextMuted }}>
        {theme === "dark" ? "Light" : "Dark"}
      </Text>
    </Pressable>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const appColors = useAppColors();

  return (
    <View style={[styles.container, { backgroundColor: appColors.chromeBg }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Sidebar />
      <View style={styles.mainWrapper}>
        <ThemeToggle />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    minHeight: "100%",
  },
  mainWrapper: {
    flex: 1,
    minHeight: "100%",
  },
});
