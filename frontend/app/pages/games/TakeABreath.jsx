import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Animated, View, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";

const TakeABreath = () => {
  const [breathingStage, setBreathingStage] = useState(0);
  const [breathAnimation, setBreathAnimation] = useState(new Animated.Value(1));
  const [isBreathing, setIsBreathing] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timing = 0;

    if (!isBreathing) {
      Animated.timing(breathAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (breathingStage === 0) {
      if (countdown > 0) {
        const countdownTimer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(countdownTimer);
      } else {
        Animated.timing(breathAnimation, {
          toValue: 1.5,
          duration: 6000,
          useNativeDriver: true,
        }).start();
        timing = 6000;
      }
    } else if (breathingStage === 1) {
      timing = 7000;
    } else if (breathingStage === 2) {
      Animated.timing(breathAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }).start();
      timing = 8000;
    }

    const timer = setTimeout(() => {
      setBreathingStage((prevStage) => (prevStage + 1) % 3);
      if (breathingStage === 2) {
        setCycleCount((prevCount) => prevCount + 1);
      }
    }, timing);

    if (cycleCount >= 2) {
      setIsBreathing(false);
    }

    return () => clearTimeout(timer);
  }, [breathingStage, isBreathing, countdown, cycleCount]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingStage(0);
    setCycleCount(0);
    setCountdown(3);
  };

  const stageText = () => {
    if (!isBreathing) return '';
    if (countdown > 0) return `Get ready... ${countdown}`;
    const text = ['Inhale...', 'Hold...', 'Exhale...'][breathingStage] || '';
    
    // Set text color for Inhale and Exhale
    const textColor = breathingStage === 0 || breathingStage === 2 ? 'black' : 'green';
    
    return <Text style={[styles.instruction, { color: textColor }]}>{text}</Text>;
  };

    const router = useRouter();
  return (
    <LinearGradient colors={['#d4edda', '#a8e6cf', '#81c784']} style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => router.back()}>
        <MaterialIcons name='arrow-back' size={30} color='gray' />
      </TouchableOpacity>
      <Animated.View style={[styles.circle, { transform: [{ scale: breathAnimation }] }]} />
      <Text style={styles.instruction}>{stageText()}</Text>
      {!isBreathing && (
        <TouchableOpacity style={styles.startButton} onPress={startBreathing}>
          <Text style={styles.startButtonText}>Start Breathing</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    color: '#3b5998',
    fontWeight: 'bold',
  },
});

export default TakeABreath;
