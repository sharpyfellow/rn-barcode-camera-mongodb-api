import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ScannerScreen from "./ScannerScreen";
import BookListScreen from "./BookListScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="BookList" component={BookListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
