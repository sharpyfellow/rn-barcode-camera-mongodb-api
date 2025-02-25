import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    alert(`Scanned: ${data} (Type: ${type})`);
  };

  const saveBarcodeToDatabase = async () => {
    if (!barcodeData) {
      Alert.alert("No barcode scanned", "Please scan a barcode first.");
      return;
    }

    try {
      const response = await fetch("http://192.168.3.161:4000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: barcodeData }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert(
          "Book Saved!",
          `Title: ${result.book.title}\nAuthor: ${result.book.authors.join(
            ", "
          )}`
        );
      } else {
        Alert.alert("Error", "Failed to save barcode.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }

    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "upc_a", "code128"],
        }}
        style={styles.camera}
      />

      {scanned && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveBarcodeToDatabase}
          >
            <Text style={styles.buttonText}>Save Barcode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.viewBooksButton}
        onPress={() => navigation.navigate("BookList")}
      >
        <Text style={styles.buttonText}>View Scanned Books</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 3 },
  buttonContainer: {
    position: "absolute",
    bottom: 200,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  scanAgainButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  viewBooksButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "purple",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
