import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { Todo } from "../types/Todo";
import AntDesign from "@expo/vector-icons/AntDesign";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(todo.id)}
    >
      <View style={styles.itemContainer}>
        <Text style={[styles.text, todo.completed && styles.completedText]}>
          {todo.text}
        </Text>
        <AntDesign name="delete" size={18} onPress={() => onDelete(todo)} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
