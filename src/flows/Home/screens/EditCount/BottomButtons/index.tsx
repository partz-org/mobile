import React from "react";
import { FC } from "react";
import { View } from "react-native";
import Button from "../../../../../components/Button";
import { commonStyles } from "../../../../../theme";
import { colors } from "../../../../../theme/colors";

interface BottomButtonsProps {
  disableDelete: boolean;
  disableValidate: boolean;
  onPressValidate: () => void;
  onPressDelete: () => void;
}

const BottomButtons: FC<BottomButtonsProps> = ({
  disableDelete,
  disableValidate,
  onPressDelete,
  onPressValidate,
}) => {
  return (
    <View style={commonStyles.buttonContainer}>
      <Button
        disabled={disableValidate}
        icon="check"
        iconColor={colors.primary}
        onPress={onPressValidate}
        title="Edit count"
      />
      <Button
        disabled={disableDelete}
        icon="delete"
        iconColor={colors.red}
        onPress={onPressDelete}
        title="Delete count"
        type="danger"
      />
    </View>
  );
};

export default BottomButtons;
