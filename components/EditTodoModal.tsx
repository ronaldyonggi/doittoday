import {
  View,
  Text,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Todo } from "../types/Todo";

interface EditTodoModalProps {
  visible: boolean;
  todo: Todo | null;
  onSave: (id: string, newText: string) => void;
  onCancel: () => void;
}

export default function EditTodoModal({
  visible,
  todo,
  onSave,
  onCancel,
}: EditTodoModalProps) {
  const [editedText, setEditedText] = useState("");
  const textInputRef = useRef<TextInput>(null);

  /**
   * This useEffect hook handles 2 main tasks:
   * - When modal opens: prefills the input field with current todo text and automatically focuses the input
   * - When modal closes: Clears the input field
   */
  useEffect(() => {
    /**
     * Todo here is the todo object being edited when the modal opens. When the modal closes, todo is set to null.
     * This also runs on the initial render, but during that time todo will likely be null.
     */
    if (todo) {
      /**
       * Set the editedText state to the text of the todo being edited. This populates the TextInput with
       * the existing text, so user can edit it.
       */
      setEditedText(todo.text);

      /**
       * textInputRef.current holds a reference to the TextInput component. This check is important because ref
       * might not be set immediately on first render.
       */
      if (textInputRef.current) {
        /**
         * If ref is available, call focus() method on the TextInput so it makes the keyboard appear and places
         * the cursor inside the TextInput. This way user can start typing immediately.
         */
        textInputRef.current.focus();
      }
    } else {
      /**
       * If todo is null (e.g. modal is closing or hasn't been opened yet), reset editedText to empty string.
       * This clears the TextInput when modal closes, so it's empty the next time it opens.
       */
      setEditedText("");
    }
  }, [todo, visible]); // Dependency array: Effect runs when 'todo' or 'visible' changes.

  const handleSave = () => {
    /**
     * We don't use if (editedText) because it would consider other falsy values (e.g. null, undefined, 0) as empty as well.
     * We also don't want (editedText.length === 0) either because this still accepts user enters whitespace only for todo
     */
    if (editedText.trim() === "") {
      Alert.alert("Error", "Todo text cannot be empty.");
      return;
    }

    if (todo) {
      onSave(todo.id, editedText);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.modalInput}
            value={editedText}
            onChangeText={setEditedText}
            placeholder="Edit todo"
            ref={textInputRef}
            maxLength={20}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onCancel} color="red" />
            <Button title="Save" onPress={handleSave} color={"green"} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    gap: 30,
  },
});
