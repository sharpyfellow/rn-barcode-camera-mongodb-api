import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.3.161:4000/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.listTitle}>📚 Scanned Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookTitle}>
                {item.title || "Unknown Title"}
              </Text>
              <Text style={styles.bookAuthor}>
                Author: {item.authors?.join(", ") || "Unknown Author"}
              </Text>
              <Text style={styles.bookBarcode}>📖 ISBN: {item.barcode}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Scanner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  listTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  bookItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  bookTitle: { fontSize: 16, fontWeight: "bold" },
  bookAuthor: { fontSize: 14, color: "gray" },
  bookBarcode: { fontSize: 12, color: "blue" },
  backButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
