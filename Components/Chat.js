import { db, auth } from "../firebase";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Clipboard,
} from "react-native";
import {
  setDoc,
  collection,
  onSnapshot,
  doc,
  orderBy,
  query,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Chat({ navigation }) {
  const [isSending, setIsSending] = useState(false);
  const [userData, setuserData] = useState([]);
  const msgColRef = collection(db, "messages");
  const [data, setData] = useState([]);
  const [msgValue, setMsgValue] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toUTCString());
  const minDate = new Date()
    .toISOString()
    .split("T")[1]
    .split(".")[0]
    .split(":")[0];
  const hour = parseInt(minDate) + 3;
  const minute = new Date()
    .toISOString()
    .split("T")[1]
    .split(".")[0]
    .split(":")[1];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toUTCString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
        console.log("KULLANICI GIRISI BASARILI");
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

  const scrollViewRef = useRef();
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
          style={styles.scrollView}
        >
          {data.map((msg, idx) =>
            msg.sentBy == auth.currentUser.uid ? (
              <TouchableOpacity
                onLongPress={() => {
                  setIsSending(true);
                  const docRef = doc(db, "messages", msg.id);

                  deleteDoc(docRef)
                    .then(() => {
                      setIsSending(false);
                    })
                    .catch((error) => {
                      console.error("Error deleting document:", error);
                    });
                }}
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
                  <Text
                    style={{
                      color: "gray",
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                  >
                    {msg.sentByName}
                  </Text>

                  <Text style={styles.text}>{msg.text}</Text>
                  <Text
                    style={[
                      styles.time,
                      {
                        right: 0,
                      },
                    ]}
                  >
                    {msg.sendTime}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onLongPress={() => {
                  Clipboard.setString(`${msg.text}`);
                }}
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
                  <Text
                    style={{
                      color: "gray",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    {msg.sentByName}
                  </Text>

                  <Text style={styles.text}>{msg.text}</Text>
                  <Text
                    style={[
                      styles.time,
                      {
                        left: 0,
                      },
                    ]}
                  >
                    {msg.sendTime}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
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
              setIsSending(true);
              setDoc(doc(msgColRef), {
                text: msgValue,
                date: new Date(),
                sentBy: auth.currentUser.uid,
                sentByName: userData.name,
                sendTime: hour + ":" + minute,
              })
                .then((x) => {
                  setIsSending(false);
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
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              display: isSending ? "none" : "flex",
            }}
          >
            <Text
              style={{
                color: "black",
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
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 20,
    maxWidth: 250,
    position: "relative",
    paddingBottom: 15,
  },
  text: {
    color: "#CBE4DE",
    minWidth: 50,
    paddingHorizontal: 30,
    lineHeight: 20,
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
    backgroundColor: "white",
  },
  scrollView: {
    marginTop: 30,
    paddingBottom: 30,
  },
  time: {
    color: "gray",
    position: "absolute",
    bottom: 0,
  },
});
