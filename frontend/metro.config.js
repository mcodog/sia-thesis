const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

let config = getDefaultConfig(__dirname);

// Apply the reanimated metro config
config = wrapWithReanimatedMetroConfig(config);

// Apply the NativeWind metro config
config = withNativeWind(config, { input: "./global.css" });

module.exports = config;
