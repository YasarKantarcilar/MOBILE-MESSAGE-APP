import { View, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { auth } from "../firebase";
import { useEffect } from "react";

const Login = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleLogin() {
    signInWithEmailAndPassword(auth, form.email, form.password).then((cred) =>
      console.log(cred)
    );
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        navigation.navigate("Chat");
      } else {
        console.log("User is signed out.");
      }
    });

    return () => unsubscribe();
  }, [auth]);
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(value) => setForm({ ...form, email: value })}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        onChangeText={(value) => setForm({ ...form, password: value })}
        placeholder="Password"
        style={styles.input}
      />
      <TouchableOpacity onPress={() => handleLogin()} style={styles.button}>
        <Text style={styles.text}>GIRIS YAP</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.link}>KAYIT OL</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    width: 200,
    height: 50,
    borderColor: "black",
    borderWidth: 2,
    textAlign: "center",
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "orange",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
    color: "white",
  },
  link: {
    color: "orange",
  },
});
