import { useRouter } from "expo-router";
import { AlertCircle, BookMarked, FlaskConical, Inbox } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../../global.css";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  ScheduleItem,
  SearchBar,
  Text,
} from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

function StatusBadge({ isAvailable }: { isAvailable: boolean }) {
  const { colors, darkMode } = useAppTheme();

  if (isAvailable) {
    return (
      <View
        className="flex-row items-center px-2 h-8 py-1 rounded-full"
        style={{
          backgroundColor: darkMode ? "#064e3b" : "#dcfce7",
          borderWidth: 1,
          borderColor: "#10b981",
        }}
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
      style={{
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: colors.danger,
      }}
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
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("success");

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: darkMode ? colors.backgroundAlt : colors.background,
        flex: 1,
      }}
    >
      <View className="px-5 flex-1">
        {/* Título */}
        <View className="flex-row items-center justify-center mb-6 mt-2">
          <Text
            className="text-lg font-bold"
            style={{ color: colors.text }}
          >
            Salas e Laboratórios
          </Text>

          <View style={{ width: 24 }} />
        </View>
        <SearchBar value={busca} onChangeText={setBusca} placeholder="Buscar" />

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Pressable onPress={() => router.push("/classdetails/ClassDetails")}>
              <Card borderColor={colors.border} className="mb-4 w-full rounded-xl bg-background border border-border">
                <CardHeader className="mb-0 w-full">
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
                  className="rounded-xl p-2 w-full flex-1"
                  style={{
                    backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6",
                  }}
                >
                  <View className="w-full">
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
            </Pressable>

            <Card borderColor={colors.border} className="mb-4 w-full rounded-xl bg-background border border-border">
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
                className="rounded-xl p-2 w-full flex-1"
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
            <Card borderColor={colors.border} className="mb-4 w-full rounded-xl bg-background border border-border">
              <CardHeader className="mb-0 w-full">
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
            </Card>
            {/* card menorzzinho */}

            {/* card menorzzinho */}
            <Card borderColor={colors.border} className="mb-4 w-full rounded-xl bg-background border border-border">
              <CardHeader className="mb-0 w-full">
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
            </Card>
            {/* card menorzzinho */}


            <Card borderColor={colors.border} className="mb-4 w-full rounded-xl bg-background border border-border">
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
                className="rounded-xl p-2 w-full flex-1"
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
            <Card borderColor={colors.border} className="mb-4 w-full rounded-xl bg-background border border-border">
              <CardHeader className="mb-0 w-full">
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
            </Card>
            {/* card menorzzinho */}

          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
