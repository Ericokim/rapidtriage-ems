import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppButton } from "@/src/components/ui/AppButton";
import { setOnboardingComplete } from "@/src/lib/prefs";
import { colors } from "@/src/theme/tokens";

const AMBULANCE = require("@/assets/images/onboard-ambulance.png");
const CLOUD = require("@/assets/images/cloud-sync.png");
const CHECK = require("@/assets/images/check-circle.png");
const CLIPBOARD = require("@/assets/images/onboard-clipboard.png");

interface Slide {
  illustration: React.ReactNode;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    illustration: <Image source={AMBULANCE} resizeMode="contain" style={{ width: 260, height: 180 }} />,
    title: "Capture critical triage data instantly",
    body: "Designed for paramedics. Works offline. Syncs when you’re back online.",
  },
  {
    illustration: (
      <View style={{ width: 220, height: 180, alignItems: "center", justifyContent: "center" }}>
        <Image source={CLOUD} resizeMode="contain" style={{ width: 150, height: 150 }} />
        <Image source={CHECK} resizeMode="contain" style={{ width: 56, height: 56, position: "absolute", bottom: 8, right: 20 }} />
      </View>
    ),
    title: "Never lose a record",
    body: "Records are saved locally on your device first, so you can focus on what matters.",
  },
  {
    illustration: (
      <View style={{ width: 220, height: 180, alignItems: "center", justifyContent: "center" }}>
        <Image source={CLIPBOARD} resizeMode="contain" style={{ width: 130, height: 165 }} />
        <View style={{ position: "absolute", right: 24, bottom: 18, width: 54, height: 54, borderRadius: 27, backgroundColor: colors.red600, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="lock-closed" size={26} color={colors.white} />
        </View>
      </View>
    ),
    title: "Secure & compliant",
    body: "Your data is encrypted locally and transmitted securely when connected.",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index]!;

  const finish = async () => {
    await setOnboardingComplete(true);
    router.replace("/home");
  };
  const next = () => (isLast ? finish() : setIndex((i) => i + 1));

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, paddingTop: insets.top, paddingBottom: insets.bottom + 12, paddingHorizontal: 24 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 28 }}>
        <View style={{ height: 200, justifyContent: "center" }}>{slide.illustration}</View>

        <View style={{ gap: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 26, fontWeight: "800", color: colors.navy950, textAlign: "center", lineHeight: 32 }}>
            {slide.title}
          </Text>
          <Text style={{ fontSize: 16, color: colors.slate500, textAlign: "center", lineHeight: 24, paddingHorizontal: 8 }}>
            {slide.body}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                height: 8,
                width: i === index ? 22 : 8,
                borderRadius: 4,
                backgroundColor: i === index ? colors.navy950 : colors.slate200,
              }}
            />
          ))}
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <AppButton
          variant="navy"
          label={isLast ? "Get Started" : "Next"}
          onPress={next}
        />
        {!isLast ? (
          <Pressable accessibilityRole="button" onPress={finish} className="items-center py-2">
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.navy950 }}>Skip</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
