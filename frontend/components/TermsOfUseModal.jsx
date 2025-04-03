import { View, Modal, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { default as Text } from "./CustomText";
import { Button } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";

const TermsOfUseModal = ({ visible, onAccept, onDecline }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDecline}
    >
      <View style={styles.centeredView}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.modalView}>
          <Text style={styles.title}>Terms of Use</Text>

          <Text style={styles.content}>
            Before we begin, just a quick reminder: This AI is here to listen
            and provide a safe space for conversation, but it's not a
            replacement for professional therapy. For your privacy,
            conversations are recorded and analyzed to improve support, and
            admins or psychologists may review summaries. If you ever need
            urgent help, please reach out to a professional or emergency
            services. Let's talk—what's on your mind?
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDecline}
              style={styles.outlineButton}
              labelStyle={styles.outlineButtonLabel}
            >
              Opt Out
            </Button>

            <Button
              mode="contained"
              onPress={onAccept}
              style={styles.containedButton}
              labelStyle={styles.containedButtonLabel}
            >
              I Understand
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 24,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  outlineButton: {
    flex: 1,
    marginRight: 8,
    borderColor: "#6B7280",
    borderRadius: 12,
  },
  outlineButtonLabel: {
    color: "#6B7280",
    fontWeight: "600",
    padding: 2,
  },
  containedButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#0cdfc6",
    borderRadius: 12,
  },
  containedButtonLabel: {
    color: "white",
    fontWeight: "600",
    padding: 2,
  },
});

export default TermsOfUseModal;
