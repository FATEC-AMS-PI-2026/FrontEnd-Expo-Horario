import { useFocusEffect, useRouter } from "expo-router";
import { AlertCircle, BookMarked, FlaskConical, Inbox } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../../global.css";
import { Badge, Button, Card, CardHeader, SearchBar, Text } from "../../components";
import {
  loadClassrooms,
  loadOccupiedClassroomIds,
  type Classroom,
} from "../../services/classrooms";
import { loadUserProfile, type UserProfile } from "../../services/userProfile";
import { useAppTheme } from "../../theme/ThemeContext";

export default function Classrooms() {
  const { colors, darkMode } = useAppTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [occupiedClassroomIds, setOccupiedClassroomIds] = useState<Set<number>>(() => new Set());
  const [profile, setProfile] = useState<UserProfile>("aluno");
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      async function load() {
        setStatus("loading");
        setErrorMessage(null);

        try {
          const [result, occupiedIds, userProfile] = await Promise.all([
            loadClassrooms(controller.signal),
            loadOccupiedClassroomIds(controller.signal),
            loadUserProfile(),
          ]);
          if (controller.signal.aborted) return;
          setClassrooms(result);
          setOccupiedClassroomIds(occupiedIds);
          setProfile(userProfile ?? "aluno");
          setStatus("success");
        } catch (error) {
          if (controller.signal.aborted) return;
          console.error("Erro ao carregar salas:", error, { tentativa: attempt });
          setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar as salas.");
          setStatus("error");
        }
      }

      void load();
      return () => controller.abort();
    }, [attempt]),
  );

  const filteredClassrooms = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return classrooms;

    return classrooms.filter((classroom) =>
      `${classroom.codigo} ${classroom.tipoSala?.nome ?? ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(query),
    );
  }, [classrooms, search]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: darkMode ? colors.backgroundAlt : colors.background,
        flex: 1,
      }}
    >
      <View className="px-5 flex-1">
        <View className="flex-row items-center justify-center mb-6 mt-2">
          <Text className="text-lg font-bold" style={{ color: colors.text }}>
            Salas e Laboratórios
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar" />

        {status === "loading" && (
          <View className="flex-1 items-center justify-center pt-20">
            <ActivityIndicator size="large" color={colors.accent} />
            <Text variant="body" className="mt-4" style={{ color: colors.textMuted }}>
              Carregando salas...
            </Text>
          </View>
        )}

        {status === "error" && (
          <View className="flex-1 items-center justify-center pt-20">
            <AlertCircle size={48} color={colors.danger} />
            <Text variant="subheading" className="mt-4 text-center" style={{ color: colors.text }}>
              {errorMessage ?? "Ocorreu um erro ao carregar as salas."}
            </Text>
            <Button variant="outline" className="mt-4" onPress={() => setAttempt((value) => value + 1)}>
              Tentar novamente
            </Button>
          </View>
        )}

        {status === "success" && filteredClassrooms.length === 0 && (
          <View className="flex-1 items-center justify-center pt-20">
            <Inbox size={48} color={colors.textMuted} />
            <Text variant="subheading" className="mt-4 text-center" style={{ color: colors.textMuted }}>
              {classrooms.length === 0 ? "Nenhuma sala encontrada" : "Nenhuma sala corresponde à busca"}
            </Text>
          </View>
        )}

        {status === "success" && filteredClassrooms.length > 0 && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {filteredClassrooms.map((classroom) => {
              const isLaboratory = classroom.tipoSala?.nome.toLocaleLowerCase("pt-BR").includes("lab");
              const isOccupied = occupiedClassroomIds.has(classroom.id);
              const RoomIcon = isLaboratory ? FlaskConical : BookMarked;

              return (
                <Pressable
                  key={classroom.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir detalhes da sala ${classroom.codigo}${isOccupied ? ", Em utilização" : ""}`}
                  onPress={() =>
                    router.push({
                      pathname: "/classdetails/ClassDetails",
                      params: { id: String(classroom.id), perfil: profile },
                    })
                  }
                >
                  <Card
                    borderColor={colors.border}
                    className="mb-4 w-full rounded-xl bg-background border border-border"
                  >
                    <CardHeader className="mb-2 w-full">
                      <View className="flex-row items-center gap-2">
                        <RoomIcon size={20} color={colors.text} />
                        <Text variant="subheading" style={{ color: colors.text, fontWeight: "bold" }}>
                          {classroom.codigo}
                        </Text>
                        {isOccupied && <Badge variant="warning">Em utilização</Badge>}
                      </View>
                    </CardHeader>
                    <View className="gap-1">
                      <Text variant="caption" style={{ color: colors.textMuted }}>
                        Capacidade: {classroom.capacidade} pessoas
                      </Text>
                      <Text variant="caption" style={{ color: colors.textMuted }}>
                        Tipo de Sala: {classroom.tipoSala?.nome ?? "Não informado"}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
