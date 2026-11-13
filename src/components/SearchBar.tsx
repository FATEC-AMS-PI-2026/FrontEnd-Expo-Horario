import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilterPress?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar",
  showFilter = false,
  onFilterPress,
}: SearchBarProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center mb-6">
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        className="flex-1"
      >
        <Feather name="search" size={20} color={colors.textMuted} />
        <View
          style={[styles.separator, { backgroundColor: colors.border }]}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text } as any]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          underlineColorAndroid="transparent"
        />
      </View>

      {showFilter && (
        <TouchableOpacity onPress={onFilterPress} className="ml-4">
          <Feather name="filter" size={24} color={colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    // Token de borda do tema: colors.border (--color-border)
    borderColor: "#DADADA",
    // Token de raio --radius-lg (0.5rem = 8px)
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  separator: {
    width: 1,
    height: 20,
    marginHorizontal: 10,
    backgroundColor: "#DADADA",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    outlineStyle: "none",
  } as any,
});
