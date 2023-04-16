import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Chat from "./Components/Chat";
export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={"Login"} component={Login} />
          <Stack.Screen name={"Register"} component={Register} />
          <Stack.Screen
            name={"Chat"}
            options={{ headerShown: false }}
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
