import { View, Text, ScrollView, StyleSheet, Pressable, Linking, Platform } from "react-native";
import { useAppColors } from "../lib/ThemeContext";

export default function SnackTestPage() {
  const appColors = useAppColors();

  const openSnack = () => {
    if (Platform.OS === 'web') {
      window.open('https://snack.expo.dev/', '_blank');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: appColors.chromeBg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: appColors.chromeText }]}>
          Expo Snack Embed Test
        </Text>
        <Text style={[styles.description, { color: appColors.chromeTextMuted }]}>
          Testing embedded Expo Snack for live native component previews
        </Text>

        {/* Embedded Snack - Web Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appColors.chromeText }]}>
            1. Web Preview (Default Snack)
          </Text>
          <View style={[styles.snackContainer, { borderColor: appColors.chromeBorder }]}>
            {Platform.OS === 'web' && (
              <iframe
                src="https://snack.expo.dev/embedded?platform=web&theme=dark&preview=true"
                style={{
                  width: "100%",
                  height: 500,
                  border: "none",
                  borderRadius: 12,
                }}
              />
            )}
          </View>
        </View>

        {/* Embedded Snack - iOS Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appColors.chromeText }]}>
            2. iOS Simulator Preview
          </Text>
          <Text style={[styles.sectionHint, { color: appColors.chromeTextMuted }]}>
            Shows iOS simulator running in browser (may take time to load)
          </Text>
          <View style={[styles.snackContainer, { borderColor: appColors.chromeBorder }]}>
            {Platform.OS === 'web' && (
              <iframe
                src="https://snack.expo.dev/embedded?platform=ios&theme=dark&preview=true"
                style={{
                  width: "100%",
                  height: 700,
                  border: "none",
                  borderRadius: 12,
                }}
              />
            )}
          </View>
        </View>

        {/* Link option */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appColors.chromeText }]}>
            3. Alternative: External Link
          </Text>
          <Pressable
            onPress={openSnack}
            style={[styles.linkButton, { backgroundColor: appColors.primaryDefault }]}
          >
            <Text style={styles.linkButtonText}>▶ Open in Expo Snack</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    maxWidth: 1000,
    marginHorizontal: "auto",
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    marginBottom: 40,
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 14,
    marginBottom: 16,
  },
  snackContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  linkButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});





