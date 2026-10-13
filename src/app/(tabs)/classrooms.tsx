import { View, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Inbox, AlertCircle } from "lucide-react-native";
import "../../../global.css";
import { Button, Text } from "../../components";
import { RoomCard, type RoomCardProps } from "../../components/RoomCard";
import { useAppTheme } from "../../theme/ThemeContext";

// Dados das salas (depois você troca pelo retorno da API)
const ROOMS: (RoomCardProps & { id: string })[] = [
  {
    id: "lab01",
    name: "Lab 01",
    type: "lab",
    currentClass: {
      startTime: "15:00h",
      endTime: "16:50h",
      subject: "Banco de Dados",
      teacher: "Renato",
    },
  },
  {
    id: "sala02",
    name: "Sala 02",
    type: "sala",
    currentClass: {
      startTime: "15:00h",
      endTime: "16:50h",
      subject: "Banco de Dados",
      teacher: "Renato",
    },
  },
  { id: "lab03", name: "Lab 03", type: "lab" },
  { id: "sala11", name: "Sala 11", type: "sala" },
];

export default function Classrooms() {
  const { colors, darkMode } = useAppTheme();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("success");

  const salasFiltradas = ROOMS.filter((r) =>
    r.name.toLowerCase().includes(busca.trim().toLowerCase())
  );

  return (
    <ScrollView
      className="flex-1 px-3 pt-14"
      contentContainerStyle={{ paddingBottom: 96 }}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: darkMode ? colors.backgroundAlt : colors.background,
      }}
    >
      <View style={styles.searchContainer}>
        <Feather name="search" size={24} color="#333" />
        <View style={styles.separator} />
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.text, outlineStyle: "none" } as any,
          ]}
          placeholder="Buscar"
          placeholderTextColor={colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Botões para simular os estados 
      <View className="flex-row gap-2 mb-2 flex-wrap justify-center">
        <TouchableOpacity onPress={() => setStatus('success')} style={[styles.badge, { backgroundColor: status === 'success' ? colors.accent : colors.surfaceAlt }]}><Text style={{fontSize: 12, color: status === 'success' ? '#fff' : colors.text}}>Sucesso</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setStatus('loading')} style={[styles.badge, { backgroundColor: status === 'loading' ? colors.accent : colors.surfaceAlt }]}><Text style={{fontSize: 12, color: status === 'loading' ? '#fff' : colors.text}}>Loading</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setStatus('empty')} style={[styles.badge, { backgroundColor: status === 'empty' ? colors.accent : colors.surfaceAlt }]}><Text style={{fontSize: 12, color: status === 'empty' ? '#fff' : colors.text}}>Vazio</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setStatus('error')} style={[styles.badge, { backgroundColor: status === 'error' ? colors.accent : colors.surfaceAlt }]}><Text style={{fontSize: 12, color: status === 'error' ? '#fff' : colors.text}}>Erro</Text></TouchableOpacity>
      </View>
*/}
      {status === "loading" && (
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" color={colors.accent} />
          <Text variant="body" className="mt-4" style={{ color: colors.textMuted }}>
            Carregando salas...
          </Text>
        </View>
      )}

      {status === "empty" && (
        <View className="flex-1 items-center justify-center pt-20">
          <Inbox size={48} color={colors.textMuted} />
          <Text variant="subheading" className="mt-4" style={{ color: colors.textMuted }}>
            Nenhuma sala encontrada
          </Text>
        </View>
      )}

      {status === "error" && (
        <View className="flex-1 items-center justify-center pt-20">
          <AlertCircle size={48} color={colors.danger} />
          <Text variant="subheading" className="mt-4 text-center" style={{ color: colors.text }}>
            Ocorreu um erro ao carregar as salas.
          </Text>
          <Button variant="outline" className="mt-4" onPress={() => setStatus("loading")}>
            Tentar novamente
          </Button>
        </View>
      )}

      {status === "success" &&
        (salasFiltradas.length === 0 ? (
          <View className="flex-1 items-center justify-center pt-20">
            <Inbox size={48} color={colors.textMuted} />
            <Text variant="subheading" className="mt-4" style={{ color: colors.textMuted }}>
              Nenhuma sala encontrada
            </Text>
          </View>
        ) : (
          <View>
            {salasFiltradas.map(({ id, ...room }) => (
              <RoomCard key={id} {...room} />
            ))}
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
  },
  separator: {
    width: 1,
    height: 20,
    marginHorizontal: 10,
    backgroundColor: "#ccc",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});