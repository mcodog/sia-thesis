import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, PanResponder , Image} from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const basketImage = require('../../../assets/images/basket.png');

const words = ["React", "Expo", "Game", "Basket", "Catch", "Fun", "Code", "Play", "Skill", "Speed"];

const Fallinggame = () => {
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(width / 2 - 40);
  const [items, setItems] = useState([]);
  const [level, setLevel] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setItems(prevItems => {
        if (level === 'Easy' && prevItems.length >= 2) return prevItems;
        return [
          ...prevItems,
          { x: Math.random() * (width - 60), y: 0, speed: getSpeed(), word: words[Math.floor(Math.random() * words.length)] }
        ];
      });
    }, level === 'Easy' ? 1500 : level === 'Medium' ? 1000 : 700);

    return () => clearInterval(interval);
  }, [level, gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setItems(prevItems => prevItems.map(item => ({ ...item, y: item.y + item.speed })));
    }, 50);
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    setItems(prevItems => prevItems.filter(item => {
      if (
        item.y + 20 >= height - 100 &&
        item.x + 50 >= basketX &&
        item.x <= basketX + 80
      ) {
        setScore(prevScore => prevScore + 1);
        return false;
      }
      if (item.y >= height) {
        setGameOver(true);
        Alert.alert("Game Over", `Final Score: ${score}`, [{ text: "OK", onPress: () => resetGame() }]);
        return false;
      }
      return true;
    }));
  }, [basketX, score]);

  useEffect(() => {
    if (score >= 0 && score <= 29) setLevel('Easy');
    else if (score >= 30 && score <= 50) setLevel('Medium');
    else if (score >= 51) setLevel('Hard');
  }, [score]);

  const getSpeed = () => {
    if (level === 'Easy') return 2 + Math.random() * 2;
    if (level === 'Medium') return 3 + Math.random() * 3;
    return 4 + Math.random() * 4;
  };

  const resetGame = () => {
    setScore(0);
    setItems([]);
    setBasketX(width / 2 - 40);
    setGameStarted(false);
    setGameOver(false);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setBasketX(Math.max(0, Math.min(width - 80, gestureState.moveX)));
    }
  });

  const startGame = () => {
    setShowHint(true);
    setTimeout(() => {
      setShowHint(false);
      setGameStarted(true);
    }, 2000);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.level}>Level: {level}</Text>
      </View>
      {!gameStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      ) : (
        <Svg height={height} width={width} style={styles.canvas}>
          {!gameOver && items.map((item, index) => (
            <Text key={index} style={{ position: 'absolute', top: item.y, left: item.x, fontSize: 16, fontWeight: 'bold', color: 'red' }}>
              {item.word}
            </Text>
          ))}
          {/* <Rect x={basketX} y={height - 100} width={80} height={50} fill="brown" /> */}
        </Svg>
      )}
       {gameStarted && <Image source={basketImage} style={[styles.basket, { left: basketX }]} />}
      {showHint && (
        <Text style={styles.hintText}>Slide the basket to catch the word!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cce7ff' },
  header: { position: 'absolute', top: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  score: { fontSize: 24, fontWeight: 'bold' },
  level: { fontSize: 20, fontWeight: 'bold', color: 'blue' },
  canvas: { position: 'absolute', top: 0, left: 0 },
  startButton: { padding: 20, backgroundColor: 'green', borderRadius: 10 },
  startButtonText: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  basket: { position: 'absolute', bottom: 50, width: 90, height: 100, resizeMode: 'contain' },
  hintText: { position: 'absolute', top: height / 2, fontSize: 18, fontWeight: 'bold', color: 'black', backgroundColor: 'yellow', padding: 10, borderRadius: 5 }
});

export default Fallinggame;