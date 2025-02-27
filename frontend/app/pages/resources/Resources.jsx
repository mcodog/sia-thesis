import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Chip, PaperProvider } from "react-native-paper";
import ElevatedButton from "../../../components/customs/ElevatedButton";
import theme from "../../../components/CustomTheme";
import { useNavigation } from "@react-navigation/native";

const Resources = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const resources = [
    { 
      id: 1, 
      category: "Health", 
      title: "Take Care of Your Mind", 
      image: "https://lafayettefamilyymca.org/wp-content/uploads/2022/01/155210504_m.jpg", 
      navigateTo: "MentalHealth" 
    },
    { 
      id: 2, 
      category: "Health", 
      title: "Healthy mind, healthy life", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC6PUWWn6900b4PQZjIhmWcOi8HpfhnxLBiw&s", 
      navigateTo: "slider2" 
    },
    { 
      id: 3, 
      category: "Professional", 
      title: "PATHFINDER", 
      image: "https://media.istockphoto.com/id/1383880527/vector/psychologist-counseling-a-sad-african-young-woman.jpg?s=612x612&w=0&k=20&c=d4j_RyvvfxrB3B4L0rOgF747htnfTxBD-PDLF0agopI=", 
      navigateTo: "slider3" 
    },
    { 
      id: 4, 
      category: "Academic", 
      title: "Education saves lives by breaking the silence and building hope.", 
      image: "https://img.freepik.com/premium-photo/globe-world-education-logo-children-save-school-taking-care-hands-books-kids-icon_1029469-88679.jpg", 
      navigateTo: "slider4" 
    },
  ];

  const categories = ["All", "Health", "Academic", "Family", "Professional"];

  // Filter Resources based on selected category
  const filteredResources = selectedCategory === "All"
    ? resources
    : resources.filter((item) => item.category === selectedCategory);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.header}>Resources</Text>
        <ElevatedButton text="Looking for Something?" search={true} />
        
        {/* Chips for Filtering */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60 }}>
          <View style={styles.chipContainer}>
            {categories.map((category) => (
              <Chip
                key={category}
                icon={category === "All" ? "view-grid" :
                      category === "Health" ? "account-heart" :
                      category === "Academic" ? "bag-personal" :
                      category === "Family" ? "account-supervisor-circle-outline" :
                      category === "Professional" ? "account-hard-hat" : "book"}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              >
                {category}
              </Chip>
            ))}
          </View>
        </ScrollView>

        {/* Display Resources Based on Selection */}
        <View style={styles.cardContainer}>
          {filteredResources.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card} 
              onPress={() => navigation.navigate(item.navigateTo)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </PaperProvider>
  );
};

export default Resources;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 11 },
  chipContainer: { flexDirection: "row", marginBottom: 9, alignItems: "center", gap: 10 },
  cardContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: "#f9f9f9", padding: 10, borderRadius: 10, marginBottom: 10 },
  cardImage: { width: "100%", height: 100, borderRadius: 10 },
  cardText: { marginTop: 5, fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
