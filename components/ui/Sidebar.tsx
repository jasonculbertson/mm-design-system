import { View, Text, ScrollView, Pressable, useWindowDimensions, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router";
import { componentRegistry } from "../../registry/components";
import { useAppColors } from "../../lib/ThemeContext";
import MetaMaskLogo from "../../assets/MetaMask-logo-black.svg";

export function Sidebar() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const appColors = useAppColors();
  const isCompact = width < 1024;

  if (isCompact) {
    return null;
  }

  const components = componentRegistry.filter((c) => c.category === "components");
  const primitives = componentRegistry.filter((c) => c.category === "primitives");

  return (
    <View style={{
      width: 224,
      borderRightWidth: 1,
      backgroundColor: appColors.chromeBg,
      borderRightColor: appColors.chromeBorder,
    }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Link href="/" asChild>
            <Pressable>
              <MetaMaskLogo 
                width={120} 
                height={60} 
                fill={appColors.chromeText}
              />
            </Pressable>
          </Link>
        </View>

        {/* Navigation Sections */}
        <View style={styles.navSections}>
          {/* Tools */}
          <View style={styles.section}>
            <View style={styles.navList}>
              <NavItem href="/tokens" label="Tokens" isActive={pathname === "/tokens" || pathname === "/"} />
              <NavItem href="/canvas" label="Canvas" isActive={pathname === "/canvas"} />
              <NavItem href="/snack-test" label="🧪 Snack Test" isActive={pathname === "/snack-test"} />
            </View>
          </View>

          {/* Our Components */}
          <View style={styles.section}>
            <Text style={{ fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, color: appColors.chromeTextMuted }}>
              Our components
            </Text>
            <View style={styles.navList}>
              {components.map((component) => {
                const isActive = pathname === `/components/${component.slug}`;
                return (
                  <NavItem
                    key={component.slug}
                    href={`/components/${component.slug}`}
                    label={component.name}
                    isActive={isActive}
                  />
                );
              })}
            </View>
          </View>

          {/* Primitives */}
          <View style={styles.section}>
            <Text style={{ fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, color: appColors.chromeTextMuted }}>
              Primitives
            </Text>
            <View style={styles.navList}>
              {primitives.map((component) => {
                const isActive = pathname === `/components/${component.slug}`;
                return (
                  <NavItem
                    key={component.slug}
                    href={`/components/${component.slug}`}
                    label={component.name}
                    isActive={isActive}
                  />
                );
              })}
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function NavItem({ 
  href, 
  label, 
  isActive, 
}: { 
  href: string; 
  label: string; 
  isActive: boolean;
}) {
  const appColors = useAppColors();
  
  return (
    <Link href={href as any} asChild>
      <Pressable 
        style={{
          paddingVertical: 4,
          paddingHorizontal: isActive ? 8 : 0,
          marginLeft: isActive ? -8 : 0,
          borderRadius: 6,
          backgroundColor: isActive ? appColors.chromeBgSubtle : "transparent",
        }}
      >
        <Text 
          style={{
            fontSize: 13,
            fontWeight: "500",
            color: isActive ? appColors.chromeText : appColors.chromeTextMuted,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    minHeight: "100%",
  },
  logoContainer: {
    marginBottom: 32,
  },
  navSections: {
    flex: 1,
    gap: 32,
  },
  section: {
    gap: 4,
  },
  navList: {
    gap: 2,
  },
});
