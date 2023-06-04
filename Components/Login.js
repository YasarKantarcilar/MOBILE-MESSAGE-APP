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
  const [isLogged, setIsLogged] = useState();
  const [text, setText] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleLogin() {
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((cred) => console.log("KULLANICI GIRIS YAPTI"))
      .catch((err) => setText("KULLANICI ADI VEYA ŞİFRE HATALI"));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
        navigation.navigate("Chat");
      } else {
        setIsLogged(false);
        console.log("User is signed out.");
      }
    });

    return () => unsubscribe();
  }, [auth]);
  return isLogged ? (
    <View
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text onPress={() => navigation.navigate("Chat")} style={styles.button}>
          CHATE GIT
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
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
      <Text>{text}</Text>
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
