import { Image } from "react-native";

const LOGO = require("../../../assets/images/rapidtriage-logo.png");

/** RapidTriage EMS horizontal logo (star-of-life + wordmark + "Emergency intake"). */
export function Brand({ height = 38 }: { height?: number; subtitle?: string }) {
  // Logo asset aspect ratio ≈ 1941 / 371.
  return (
    <Image
      source={LOGO}
      resizeMode="contain"
      style={{ height, width: height * (1941 / 371) }}
      accessibilityLabel="RapidTriage EMS"
    />
  );
}
