import { View, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { db, auth } from "../firebase";
import { setDoc, collection, doc } from "firebase/firestore";
const Register = ({ navigation }) => {
  const colRef = collection(db, "users");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errText, setErrText] = useState("");

  function handleRegister() {
    if (form.email !== "" && form.password !== "" && form.name !== "") {
      createUserWithEmailAndPassword(auth, form.email, form.password)
        .then((userCred) => {
          const userId = userCred.user.uid;
          setDoc(doc(colRef, userId), {
            name: form.name.substring(0, 10).replace(/\s/g, ""),
            mail: form.email,
            password: form.password,
            uid: userId,
            isAdmin: false,
            createDate: new Date(),
          })
            .then(() => {
              navigation.navigate("Chat");
            })
            .catch((error) => console.error("Error writing document: ", error));
        })
        .catch((error) => console.log(error.message));
    } else {
      setErrText("LUTFEN BILGILERI EKSIKSIZ DOLDURUNUZ");
    }
  }

  console.log(form.name.substring(0, 10).replace(/\s/g, ""));
  console.log(form.password);
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(value) => setForm({ ...form, name: value })}
        placeholder="ISIM"
        style={styles.input}
      />
      <TextInput
        onChangeText={(value) => setForm({ ...form, email: value })}
        placeholder="EPOSTA"
        style={styles.input}
      />
      <TextInput
        onChangeText={(value) => setForm({ ...form, password: value })}
        placeholder="SIFRE"
        style={styles.input}
      />
      <TouchableOpacity onPress={() => handleRegister()} style={styles.button}>
        <Text style={styles.text}>KAYIT OL</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
          HESABIN VAR MI ?
        </Text>
      </TouchableOpacity>
      <Text>{errText}</Text>
    </View>
  );
};

export default Register;

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
