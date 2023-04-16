import { SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import {
  setDoc,
  collection,
  onSnapshot,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";

export default function Chat({ navigation }) {
  const [userData, setuserData] = useState([]);
  const msgColRef = collection(db, "messages");
  const [data, setData] = useState([]);
  const [msgValue, setMsgValue] = useState("");
  useEffect(() => {
    const colRef = collection(db, "messages");
    const q = query(colRef, orderBy("date", "asc"));
    onSnapshot(q, (snapshot) => {
      let messages = [];
      snapshot.docs.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setData(messages);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
        navigation.navigate("Login");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (auth.currentUser !== null) {
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef).then((doc) => {
        setuserData(doc.data());
      });
    }
  }, [auth]);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {data.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.areaContainer,
                {
                  alignItems:
                    msg.sentBy == auth.currentUser.uid
                      ? "flex-end"
                      : "flex-start",
                },
              ]}
            >
              <View style={styles.textContainer}>
                <Text style={{ color: "whitesmoke", textAlign: "center" }}>
                  {msg.sentByName}
                </Text>
                <Text style={styles.text}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={msgValue}
            onChangeText={(msgValue) => setMsgValue(msgValue)}
            placeholder="MESAJINIZI YAZINIZ"
          />
          <TouchableOpacity
            onPress={() => {
              setDoc(doc(msgColRef), {
                text: msgValue,
                date: new Date(),
                sentBy: auth.currentUser.uid,
                sentByName: userData.name,
              })
                .then((x) => {
                  console.log(x);
                })
                .catch((error) =>
                  console.error("Error writing document: ", error)
                );
              setMsgValue("");
            }}
            style={{
              borderWidth: 2,
              borderRadius: 50,
              width: 60,
              height: 60,
              backgroundColor: "#2E4F4F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#CBE4DE",
                fontSize: 30,
              }}
            >
              {">"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#2C3333",
    justifyContent: "space-between",
  },
  areaContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: 15,
  },
  textContainer: {
    backgroundColor: "#2E4F4F",
    borderRadius: 15,
    maxWidth: 250,
  },
  text: {
    color: "#CBE4DE",
    minWidth: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    lineHeight: 20,
    marginTop: 5,
    minHeight: 50,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
  },
  input: {
    width: 250,
    height: 50,
    borderColor: "#CBE4DE",
    borderWidth: 2,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#CBE4DE",
  },
});
