import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Todo } from "./types/Todo";
import { initialTodos } from "./data";
import TodoItem from "./components/TodoItem";
import uuid from "react-native-uuid";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  // initialize reset timeout
  let resetTimeOut: NodeJS.Timeout | null = null;

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

  // Initial load todos data
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Error loading todos:", error);
        Alert.alert("Error", "Failed to load todos");
      }
    };

    loadTodos();
  }, []);

  // Saving data to async storage
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem("todos", JSON.stringify(todos));
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
            <AntDesign name="plus" size={24} color="blue" />
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
    height: 40,
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
