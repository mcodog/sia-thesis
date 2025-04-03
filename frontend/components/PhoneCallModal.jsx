import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { default as Text } from "./CustomText";
import { Button } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PhoneCallModal = ({ visible, onClose, onSubmit, id }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    // Basic phone validation - must start with + and have at least 10 digits
    const phoneRegex = /^\+[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Please enter a valid phone number (e.g. +631234567890)");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        assistantId: "d98095b5-6bf0-4bb0-9631-214660006c3c",
        phoneNumberId: "ae6cd2d0-a71a-4b6b-89b9-99c677d1f1ba",
        customer: {
          number: phoneNumber,
          name: name,
          // id: id,
        },
        assistantOverrides: {
          variableValues: {
            customerID: id,
          },
        },
      });

      // Reset form fields
      setName("");
      setPhoneNumber("");
      setNameError("");
      setPhoneError("");
    }
  };

  const handleClose = () => {
    // Reset form fields and errors
    setName("");
    setPhoneNumber("");
    setNameError("");
    setPhoneError("");
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.centeredView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <Animated.View
              entering={FadeIn.duration(400)}
              style={styles.modalView}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Schedule a Call</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons name="close" size={22} color="#555" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={name}
                  onChangeText={(text) => setName(text)}
                  style={[styles.input, nameError ? styles.inputError : null]}
                  placeholder="Enter your name"
                />
                {nameError ? (
                  <Text style={styles.errorText}>{nameError}</Text>
                ) : null}

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text)}
                  style={[styles.input, phoneError ? styles.inputError : null]}
                  placeholder="+631234567890"
                  keyboardType="phone-pad"
                />
                {phoneError ? (
                  <Text style={styles.errorText}>{phoneError}</Text>
                ) : null}
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={handleClose}
                  style={styles.outlineButton}
                  labelStyle={styles.outlineButtonLabel}
                >
                  Cancel
                </Button>

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.containedButton}
                  labelStyle={styles.containedButtonLabel}
                >
                  Make Call
                </Button>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
  keyboardAvoidingView: {
    width: "100%",
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 12,
    marginTop: -12,
    marginLeft: 4,
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

export default PhoneCallModal;
