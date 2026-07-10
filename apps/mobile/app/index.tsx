import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { isOnboardingComplete } from "@/src/lib/prefs";
import { colors } from "@/src/theme/tokens";

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(async () => {
      const done = await isOnboardingComplete();
      router.replace(done ? "/home" : "/onboarding");
    }, 1900);
    return () => clearTimeout(timer);
  }, [progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.navy950, alignItems: "center", justifyContent: "center", padding: 32 }}>
      <View style={{ alignItems: "center", gap: 18 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <FontAwesome5 name="star-of-life" size={76} color={colors.white} />
          <View style={{ position: "absolute", height: 3, width: 96, backgroundColor: colors.red500, borderRadius: 2 }} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 34, fontWeight: "800", color: colors.white, letterSpacing: 0.5 }}>
            Rapid<Text style={{ color: colors.red500 }}>Triage</Text>
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.white, letterSpacing: 4 }}>
            EMS
          </Text>
        </View>
        <Text style={{ fontSize: 15, color: "#93A4C7" }}>Fast. Reliable. Offline. Always.</Text>
      </View>

      <View style={{ position: "absolute", bottom: 60, alignItems: "center", gap: 18, width: "100%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24 }}>
          <Ionicons name="shield-checkmark" size={16} color="#93A4C7" />
          <Text style={{ color: "#93A4C7", fontSize: 13, textAlign: "center" }}>
            Your data is secure and stored locally when offline.
          </Text>
        </View>
        <View style={{ width: 190, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
          <Animated.View style={{ height: 5, borderRadius: 3, backgroundColor: colors.red500, width }} />
        </View>
      </View>
    </View>
  );
}
