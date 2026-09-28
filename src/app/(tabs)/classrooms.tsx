import { View, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { FlaskConical, BookMarked, Inbox, AlertCircle } from "lucide-react-native";
import "../../../global.css";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  ScheduleItem,
  Text,
} from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

function StatusBadge({ isAvailable }: { isAvailable: boolean }) {
  const { colors, darkMode } = useAppTheme();

  if (isAvailable) {
    return (
      <View
        className="flex-row items-center px-2 py-1 rounded-full"
        style={{ backgroundColor: darkMode ? "#064e3b" : "#dcfce7" }}
      >
        <View
          className="w-2 h-2 rounded-full mr-1.5"
          style={{ backgroundColor: "#10b981" }}
        />
        <Text style={{ color: "#10b981", fontSize: 12, fontWeight: "600" }}>
          Livre
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-row items-center px-2 py-1 rounded-full"
      style={{ backgroundColor: colors.dangerSoft }}
    >
      <View
        className="w-2 h-2 rounded-full mr-1.5"
        style={{ backgroundColor: colors.danger }}
      />
      <Text style={{ color: colors.danger, fontSize: 12, fontWeight: "600" }}>
        Em utilização
      </Text>
    </View>
  );
}

export default function Classrooms() {
  const { colors, darkMode } = useAppTheme();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("success");

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

      {status === "success" && (
        <View>

      <Card className="mt-5 w-full rounded-xl bg-background border-gray-300">
        <CardHeader className="mb-1 w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <FlaskConical size={20} color={colors.text} />
              <Text
                variant="subheading"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Lab 01
              </Text>
            </View>
            <StatusBadge isAvailable={false} />
          </View>
        </CardHeader>

        <CardContent
          className="rounded-2xl p-2 w-full flex-1"
          style={{
            backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6",
          }}
        >
          <View className="w-full h-20">
            <ScheduleItem
              startTime="15:00h"
              endTime="16:50h"
              subject="Banco de Dados"
              teacher="Renato"
              location="Lab. 01"
              accentColor="#067f95"
            />
          </View>
        </CardContent>
      </Card>

      <Card className="mt-5 w-full rounded-xl bg-background border-gray-300">
        <CardHeader className="mb-1 w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <BookMarked size={20} color={colors.text} />
              <Text
                variant="subheading"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Sala 02
              </Text>
            </View>
            <StatusBadge isAvailable={false} />
          </View>
        </CardHeader>

        <CardContent
          className="rounded-2xl p-2 w-full flex-1"
          style={{
            backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6",
          }}
        >
          <View className="w-full h-20">
            <ScheduleItem
              startTime="15:00h"
              endTime="16:50h"
              subject="Banco de Dados"
              teacher="Renato"
              location="Sala. 02"
              accentColor="#067f95"
            />
          </View>
        </CardContent>
      </Card>

      {/* card menorzzinho */}
      <Card className="mt-5 w-full rounded-xl bg-background border-gray-300 h-15">
        <CardHeader className="mb-1 w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <FlaskConical size={20} color={colors.text} />
              <Text
                variant="subheading"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Lab 03
              </Text>
            </View>
            <StatusBadge isAvailable={true} />
          </View>
        </CardHeader>

        <CardContent
          className="rounded-2xl p-2 w-full flex-1"
          style={{
            backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6",
          }}
        >
          <View className="w-full h-20"></View>
        </CardContent>
      </Card>
      {/* card menorzzinho */}

            {/* card menorzzinho */}
      <Card className="mt-5 w-full rounded-xl bg-background border-gray-300 h-15">
        <CardHeader className="mb-1 w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <FlaskConical size={20} color={colors.text} />
              <Text
                variant="subheading"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Lab 03
              </Text>
            </View>
            <StatusBadge isAvailable={true} />
          </View>
        </CardHeader>

        <CardContent
          className="rounded-2xl p-2 w-full flex-1"
          style={{
            backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6",
          }}
        >
          <View className="w-full h-20"></View>
        </CardContent>
      </Card>
      {/* card menorzzinho */}


      <Card className="mt-5 w-full rounded-xl bg-background border-gray-300">
        <CardHeader className="mb-1 w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <BookMarked size={20} color={colors.text} />
              <Text
                variant="subheading"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Sala 02
              </Text>
            </View>
            <StatusBadge isAvailable={false} />
          </View>
        </CardHeader>

        <CardContent
          className="rounded-2xl p-2 w-full flex-1"
          style={{
            backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6",
          }}
        >
          <View className="w-full h-20">
            <ScheduleItem
              startTime="15:00h"
              endTime="16:50h"
              subject="Banco de Dados"
              teacher="Renato"
              location="Sala. 02"
              accentColor="#067f95"
            />
          </View>
        </CardContent>
      </Card>

        {/* card menorzzinho */}
      <Card className="mt-5 w-full rounded-xl bg-background border-gray-300 h-15">
        <CardHeader className="mb-1 w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <BookMarked size={20} color={colors.text} />
              <Text
                variant="subheading"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Sala 11
              </Text>
            </View>
            <StatusBadge isAvailable={true} />
          </View>
        </CardHeader>

        <CardContent
          className="rounded-2xl p-2 w-full flex-1"
          style={{
            backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6",
          }}
        >
          <View className="w-full h-20"></View>
        </CardContent>
      </Card>
      {/* card menorzzinho */}

        </View>
      )}
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
