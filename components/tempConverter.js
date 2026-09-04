import { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
const toCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

export default function TempConverter() {
  const [temp, setTemp] = useState("0.0");
  // false: Celsius to Fahrenheit; true: Fahrenheit to Celsius.
  const [unit, setUnit] = useState(false);
  const [tempInput, setTempInput] = useState("");

  const getUnit = () => (unit ? "°C" : "°F");

  const convertTemp = () => {
    const value = Number.parseFloat(tempInput);
    if (tempInput.trim() === "" || Number.isNaN(value)) {
      setTemp("0.0");
      return;
    }

    const converted = unit ? toCelsius(value) : toFahrenheit(value);
    setTemp(converted.toFixed(1));
  };

  const handleUnitChange = () => {
    setUnit((previousUnit) => !previousUnit);
    setTemp("0.0");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tempContainer}>
        <Text style={styles.tempText} accessibilityLiveRegion="polite">
          {temp} <Text style={styles.tempUnit}>{getUnit()}</Text>
        </Text>
      </View>

      <View style={styles.tempInputGroup}>
        <Text style={styles.tempInputLabel}>Enter Temperature</Text>
        <TextInput
          style={styles.tempInput}
          value={tempInput}
          onChangeText={setTempInput}
          placeholder="0"
          keyboardType="decimal-pad"
          maxLength={10}
          accessibilityLabel="Temperature to convert"
        />
      </View>

      <View style={styles.tempUnitChangeGroup}>
        <Text style={[styles.tempUnitLabel, !unit && styles.tempUnitLabelBlue]}>
          °C to °F
        </Text>
        <Switch
          value={unit}
          onValueChange={handleUnitChange}
          thumbColor={unit ? "orange" : "dodgerblue"}
          trackColor={{ false: "#b9d9ff", true: "#ffd2a6" }}
          style={styles.tempUnitSwitch}
          accessibilityLabel="Switch conversion direction"
        />
        <Text style={[styles.tempUnitLabel, unit && styles.tempUnitLabelOrange]}>
          °F to °C
        </Text>
      </View>

      <TouchableOpacity
        style={styles.convertButton}
        onPress={convertTemp}
        accessibilityRole="button"
        accessibilityLabel="Convert temperature"
      >
        <Text style={styles.convertBtnText}>Convert</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexDirection: "column",
    gap: 20,
  },
  tempContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    borderRadius: 100,
  },
  tempText: {
    fontSize: 60,
    fontWeight: "bold",
  },
  tempUnit: {
    fontSize: 30,
    fontWeight: "bold",
    color: "gray",
  },
  tempInputGroup: {
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
  },
  tempInputLabel: {
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },
  tempInput: {
    padding: 8,
    borderColor: "black",
    borderWidth: 1,
    height: 50,
    width: 200,
    borderRadius: 7,
    textAlign: "right",
    fontWeight: "bold",
  },
  tempUnitChangeGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  tempUnitLabel: {
    fontSize: 17,
    fontWeight: "bold",
  },
  tempUnitLabelBlue: {
    color: "blue",
  },
  tempUnitLabelOrange: {
    color: "orange",
  },
  tempUnitSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  convertButton: {
    backgroundColor: "dodgerblue",
    borderRadius: 7,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 50,
  },
  convertBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
