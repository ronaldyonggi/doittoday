import { View, Text } from "react-native";
import React from "react";
import { Todo } from "../types/Todo";

interface TodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  todo: Todo | null;
  editedText: string;
  onTextChange: (text: string) => void;
}

export default function TodoModal({ visible, onClose, onSubmit, todo, editedText, onTextChange }: TodoModalProps) {
  return (
    <View>
      <Text>TodoModal</Text>
    </View>
  );
}
