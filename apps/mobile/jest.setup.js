/* Test environment setup for RapidTriage mobile. */

// Icon fonts and the gradient native view are not needed for logic/UI tests.
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const Icon = ({ name }) => React.createElement(Text, null, name);
  return { Ionicons: Icon, MaterialCommunityIcons: Icon };
});

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

// Silence the Reanimated / worklets warnings that are irrelevant to logic tests.
jest.mock("react-native-reanimated", () => ({}), { virtual: true });

// NetInfo is exercised indirectly; provide a light default mock.
jest.mock(
  "@react-native-community/netinfo",
  () => ({
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn(() =>
      Promise.resolve({ isConnected: true, isInternetReachable: true })
    ),
  }),
  { virtual: true }
);
