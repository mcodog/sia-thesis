import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Chip, Button, PaperProvider } from 'react-native-paper';
import ElevatedButton from '../../../components/customs/ElevatedButton';
import theme from '../../../components/CustomTheme';

const HomeScreen = () => {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.header}>Resources</Text>
        <ElevatedButton text="Looking for Something?" search={true} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60 }}>
          <View style={styles.chipContainer}>
            <Chip icon="account-heart" onPress={() => console.log("Health Pressed")}>Health</Chip>
            <Chip icon="bag-personal" onPress={() => console.log("Academic Pressed")}>Academic</Chip>
            <Chip icon="account-supervisor-circle-outline" onPress={() => console.log("Family Pressed")}>Family</Chip>
            <Chip icon="account-hard-hat" onPress={() => console.log("Professional Pressed")}>Professional</Chip>
          </View>
        </ScrollView>
        
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Healthy-Eating-2.jpeg' }} style={styles.cardImage} />
            <Text style={styles.cardText}> healthy eating</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: 'https://example.com/temperature.jpg' }} style={styles.cardImage} />
            <Text style={styles.cardText}>What is Basal Body Temperature?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: 'https://example.com/conceive.jpg' }} style={styles.cardImage} />
            <Text style={styles.cardText}>Is Your Body Ready to Conceive?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: 'https://example.com/tests.jpg' }} style={styles.cardImage} />
            <Text style={styles.cardText}>Tests You Should Have Before TTC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PaperProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 11 },
  chipContainer: { flexDirection: 'row', marginBottom: 9, alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10 },
  cardImage: { width: '100%', height: 100, borderRadius: 10 },
  cardText: { marginTop: 5, fontSize: 14, fontWeight: 'bold' },
});
