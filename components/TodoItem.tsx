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
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(todo.id)}
    >
      <View style={styles.itemContainer}>
        <View style={styles.textAndCheckContainer}>
          <FontAwesome
            name={todo.completed ? "check-circle-o" : "circle-o"}
            size={18}
            onPress={() => onToggle(todo.id)}
            color={todo.completed ? "green" : "gray"}
          />
          <Text style={[styles.text, todo.completed && styles.completedText]}>
            {todo.text}
          </Text>
        </View>
        <View style={styles.iconsContainer}>
          <FontAwesome
            name="edit"
            size={18}
            color="gray"
            onPress={() => onEdit(todo)}
          />
          <FontAwesome
            name="trash-o"
            size={18}
            onPress={() => onDelete(todo)}
            color="red"
          />
        </View>
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
    paddingLeft: 8
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 350,
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  textAndCheckContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
