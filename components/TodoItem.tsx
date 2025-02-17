import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { Todo } from "../types/Todo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
        <FontAwesome
          name="trash-o"
          size={18}
          onPress={() => onDelete(todo)}
          color="red"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 23,
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
