export default {
  expo: {
    owner: "partz",
    name: "Partz",
    jsEngine: "hermes",
    slug: "Partz",
    version: "1.0.7",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.partz.app",
      googleServicesFile: "./config/google-services.json",
      versionCode: 7,
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.partz.app",
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    description: "",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
