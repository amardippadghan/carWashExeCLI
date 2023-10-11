import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#D8D8D8',
  },
  text: {
    fontFamily: "sans-serif",
    fontSize: 24,
    color: "#171A1FFF",
    marginBottom: 20,
  },
  text2: {
    fontFamily: "sans-serif",
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  inputContainer: {
    width: 339,
    height: 52,
    backgroundColor: "#FFFFFFFF",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#9095A0FF",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontFamily: "sans-serif",
    fontSize: 20,
    color: "#000000",
  },
  buttonContainer: {
    width: 339,
  },
  button: {
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    fontSize: 18,
    color: "#FFFFFFFF",
    backgroundColor: "#5B7586",
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: "sans-serif",
    fontSize: 18,
    color: "#FFFFFFFF",
  },
});

export default function Login2() {
  const [otp, setOtp] = useState("");
  const navigation = useNavigation();

  const handleVerify = async () => {
    // Here, you would typically verify the OTP with your backend.
    // For this example, let's assume the OTP is "123456".
    const correctOTP = "123456";

    if (otp === correctOTP) {
      // OTP is correct
      // You can store the user's authentication state here if needed
      // For example, set a flag in AsyncStorage to indicate the user is logged in

      // Redirect to the main screen (replace with your screen name)
      navigation.navigate("Home");
    } else {
      // OTP is incorrect
      alert("Incorrect OTP. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View>
        <Text style={styles.text}>Verify OTP</Text>
        <Text style={styles.text2}>OTP : 123456</Text>
        <Text style={styles.text2}>Enter OTP</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP (otp is = 123456)"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleVerify} style={styles.button}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
