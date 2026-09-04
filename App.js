import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import TempConverter from "./components/tempConverter";
import Topbar from "./components/topbar";

export default function App() {
  return (
    <View style={styles.app}>
      <StatusBar hidden />
      <Topbar title="TempConverter" />
      <TempConverter />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "white",
  },
});
