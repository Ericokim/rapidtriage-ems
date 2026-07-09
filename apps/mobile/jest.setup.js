/* Test environment setup for RapidTriage mobile. */

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
