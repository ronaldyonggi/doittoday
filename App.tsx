import { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Todo } from "./types/Todo";
import TodoItem from "./components/TodoItem";
import uuid from "react-native-uuid";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  // initialize reset timeout
  let resetTimeOut: NodeJS.Timeout | null = null;

  // Reset todos to empty
  const resetTodos = async () => {
    try {
      setTodos([]); // Clear current rendered todos
      await AsyncStorage.removeItem("todos"); // Clear todos from storage
      await AsyncStorage.setItem("lastReset", new Date().getTime().toString()); // Store current timestamp
      scheduleNextReset();
    } catch (error) {
      console.error("Error resetting todos:", error);
      Alert.alert("Error", "Failed to reset todos");
    }
  };

  // Schedule next reset
  const scheduleNextReset = async () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight tomorrow

    const timeUntilTomorrow = tomorrow.getTime() - now.getTime();

    // Clear any existing timeout
    if (resetTimeOut) {
      clearTimeout(resetTimeOut);
    }

    // Set the reset time out
    resetTimeOut = setTimeout(() => {
      resetTodos();
    }, timeUntilTomorrow);
  };

  // Add todo
  const addTodo = () => {
    // Can't add todo if todo is full (max is 10)
    if (todos.length >= 10) {
      Alert.alert("Error", "You can't add more than 10 todos");
      return;
    }
    // Can't put empty todo
    else if (newTodoText === "") {
      Alert.alert("Error", "Please enter a todo");
    } else {
      const newTodo: Todo = {
        id: uuid.v4(),
        text: newTodoText,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setNewTodoText("");
    }
  };

  // Toggle todo
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (todo: Todo) => {
    Alert.alert("Confirm Delete", `Delete todo "${todo.text}"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTodos(todos.filter((t) => t.id !== todo.id));
        },
      },
    ]);
  };

  // Initial load todos data and check for reset
  useEffect(() => {
    const loadTodosAndCheckReset = async () => {
      try {
        const lastResetString = await AsyncStorage.getItem("lastReset");
        const storedTodos = await AsyncStorage.getItem("todos");

        if (lastResetString) {
          const lastReset = new Date(parseInt(lastResetString)); // Get last reset date
          const now = new Date(); // Get current date

          // If now and lastReset on different day, reset!
          if (now.toDateString() !== lastReset.toDateString()) {
            await resetTodos();
          }

          // Otherwise it's still the same day. Load todos from storedTodos
          else {
            if (storedTodos) {
              setTodos(JSON.parse(storedTodos));
            }
            /**
             * IMPORTANT!
             * Schedule next reset after loading todos. If we don't do this, todo list wouldn't reset at midnight
             */
            scheduleNextReset();
          }
        } else {
          // Case it's first run (no reset string set)
          await resetTodos();
        }
      } catch (error) {
        console.error("Failed to load or reset todos.", error);
        Alert.alert("Error", "Failed to load or reset todos.");
      }
    };

    loadTodosAndCheckReset();

    // Handle app state changes
    const handleAppStateChange = (nextAppState: string) => {
      /**
       * When app becomes active, call the same function we use upon app load:
       * - check if a day has passed since the last reset
       * - reset todo list if necessary
       * - or load to do list if it hasn't been reset
       * - rescheudle setTimeOut for next midnight reset
       */
      if (nextAppState == "active") {
        loadTodosAndCheckReset();
      }
    };

    /**
     * Subscribes the handleAppStateChange function to be called whenever app state changes.
     */
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup function to prevent memory leaks
    return () => {
      if (resetTimeOut) {
        clearTimeout(resetTimeOut); // Clear timeout on unmount
      }

      appStateSubscription.remove();
    };
  }, []);

  // Saving data to async storage
  useEffect(() => {
    const saveTodos = async () => {
      try {
        if (todos) {
          await AsyncStorage.setItem("todos", JSON.stringify(todos));
        }
      } catch (error) {
        console.error("Error saving todos:", error);
        Alert.alert("Error", "Failed to save todos");
      }
    };

    saveTodos();
  }, [todos]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Add a new todo"
            onChangeText={setNewTodoText}
            value={newTodoText}
          />
          <TouchableOpacity onPress={addTodo} style={styles.addButton}>
            <FontAwesome name="plus-circle" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
  },
  input: {
    padding: 10,
    width: "80%",
  },
  inputContainer: {
    flex: 0.2,
    alignItems: "center",
    width: 350,
  },
  todoList: {
    marginTop: 90,
  },
  addButton: {
    padding: 10,
  },
});
