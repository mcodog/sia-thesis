import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const icons = ["🐰", "🐻", "🦊", "🐼", "🐱", "🐶", "🐵", "🐸", "🐯", "🐹"];

const quotes = [
  "You're pawsome! 🐾 Keep going! ✨",
  "Cuteness overload! You're amazing! 💖",
  "Wow! You have the heart of a panda! 🐼💪",
  "You’re as clever as a fox! 🦊 Keep it up! 🚀",
  "Great job! You're on fire! 🔥 Keep pushing! 🏆",
];

const generateCards = (level) => {
  const numPairs = 2 + (level - 1) * 2; // Increase pairs per level
  const selectedIcons = icons.slice(0, numPairs);
  const cards = [...selectedIcons, ...selectedIcons].map((content, index) => ({
    id: index + 1,
    content,
    matched: false,
    flipped: false,
  }));
  return shuffleCards(cards);
};

const shuffleCards = (cards) => {
  return [...cards].sort(() => Math.random() - 0.5);
};

const Card = ({ card, onClick }) => {
  return (
    <TouchableOpacity
      style={[styles.card, (card.matched || card.flipped) && styles.flippedCard]}
      onPress={() => onClick(card)}
      disabled={card.matched}
    >
      <Text style={styles.cardText}>
        {card.matched || card.flipped ? card.content : "❓"}
      </Text>
    </TouchableOpacity>
  );
};

const ClipCardGame = () => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState(generateCards(level));
  const [selectedCards, setSelectedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [motivationQuote, setMotivationQuote] = useState("");

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      if (first.content === second.content) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.content === first.content ? { ...card, matched: true } : card
          )
        );
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 1000);
      }
      setSelectedCards([]);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      setGameOver(true);
      setMotivationQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [cards]);

  const handleCardClick = (card) => {
    if (!gameOver && selectedCards.length < 2 && !card.flipped && !card.matched) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === card.id ? { ...c, flipped: true } : c
        )
      );
      setSelectedCards([...selectedCards, card]);
    }
  };

  const nextLevel = () => {
    if (level < 5) {
      setLevel(level + 1);
      setCards(generateCards(level + 1));
      setSelectedCards([]);
      setGameOver(false);
      setMotivationQuote("");
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    setLevel(1);
    setCards(generateCards(1));
    setSelectedCards([]);
    setGameOver(false);
    setMotivationQuote("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clip Card Game 🐰✨</Text>
      <Text style={styles.level}>Level {level} 🔥</Text>

      {gameOver ? (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>{motivationQuote}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={nextLevel}>
            <Text style={styles.nextButtonText}>
              {level < 5 ? "Next Level 🚀" : "Restart Game 🔄"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E7D32",
  },
  level: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4500",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 70,
    height: 70,
    backgroundColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    shadowColor: "#1B5E20",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  flippedCard: {
    backgroundColor: "#2E7D32",
  },
  cardText: {
    fontSize: 24,
    color: "#fff",
  },
  motivationContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  motivationText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nextButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  dataTable: { backgroundColor: "#C8E6C9", borderRadius: 10 },
  dataTableHeader: { backgroundColor: "#A5D6A7" },
  dataTableRow: { backgroundColor: "#E8F5E9", borderBottomWidth: 1, borderBottomColor: "#C8E6C9" },
});

export default ClipCardGame;
