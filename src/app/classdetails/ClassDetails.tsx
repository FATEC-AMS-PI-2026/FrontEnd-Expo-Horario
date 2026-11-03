import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookMarked, Cable, MapPin, Users } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, CardContent, CardHeader, ScheduleItem, Text } from "../../components";
import {
  loadClassroomDetails,
  type ClassroomDetails as ClassroomDetailsData,
} from "../../services/classrooms";
import { loadUserProfile, type UserProfile } from "../../services/userProfile";
import { useAppTheme } from "../../theme/ThemeContext";

const WEEKDAY_NAMES: Record<string, string> = {
  DOMINGO: "Domingo",
  SEGUNDA: "Segunda-feira",
  TERCA: "Terça-feira",
  QUARTA: "Quarta-feira",
  QUINTA: "Quinta-feira",
  SEXTA: "Sexta-feira",
  SABADO: "Sábado",
};

function formatTime(time: string) {
  return `${time.slice(0, 5)}h`;
}

export default function ClassDetails() {
  const router = useRouter();
  const { colors, darkMode } = useAppTheme();
  const { id, perfil } = useLocalSearchParams<{ id?: string | string[]; perfil?: string | string[] }>();
  const classroomId = Number(Array.isArray(id) ? id[0] : id);
  const profileParam = Array.isArray(perfil) ? perfil[0] : perfil;
  const [details, setDetails] = useState<ClassroomDetailsData | null>(null);
  const [profile, setProfile] = useState<UserProfile>("aluno");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      async function load() {
        setLoading(true);
        setError(null);
        setDetails(null);

        try {
          if (!Number.isSafeInteger(classroomId) || classroomId <= 0) {
            throw new Error("Sala não identificada. Volte à lista e selecione uma sala.");
          }

          const storedProfile = await loadUserProfile();
          const userProfile = profileParam === "aluno" || profileParam === "professor"
            ? profileParam
            : storedProfile;
          const result = await loadClassroomDetails(
            classroomId,
            controller.signal,
            userProfile === "professor",
          );
          if (controller.signal.aborted) return;
          setProfile(userProfile ?? "aluno");
          setDetails(result);
        } catch (loadError) {
          if (controller.signal.aborted) return;
          console.error("Erro ao carregar detalhes da sala:", loadError, { tentativa: attempt });
          setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os dados da sala.");
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      }

      void load();
      return () => controller.abort();
    }, [attempt, classroomId, profileParam]),
  );

  const allocationDays = details
    ? Array.from(new Set(details.allocations.map((allocation) => allocation.diaSemana)))
    : [];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: darkMode ? colors.backgroundAlt : colors.background }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
      >
        <View className="flex-row items-center h-12">
          <Pressable
            onPress={() => router.back()}
            className="w-9 h-9 items-center justify-center rounded-full"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Voltar para salas"
          >
            <ArrowLeft size={20} color={colors.text} strokeWidth={2} />
          </Pressable>
          <Text variant="caption" className="ml-3" style={{ color: colors.textMuted }}>
            Salas /{" "}
            <Text variant="caption" style={{ color: colors.text }}>
              {details?.classroom.codigo ?? "Detalhes"}
            </Text>
          </Text>
        </View>

        {loading ? (
          <View className="items-center justify-center pt-20">
            <ActivityIndicator size="large" color={colors.accent} />
            <Text className="mt-4" style={{ color: colors.textMuted }}>
              Carregando dados da sala...
            </Text>
          </View>
        ) : error ? (
          <View className="items-center pt-16">
            <Text accessibilityRole="alert" className="text-center" style={{ color: colors.danger }}>
              {error}
            </Text>
            <Button variant="outline" className="mt-4" onPress={() => setAttempt((value) => value + 1)}>
              Tentar novamente
            </Button>
          </View>
        ) : details ? (
          <>
            <Text variant="heading" className="mb-3" style={{ color: colors.text }}>
              {details.classroom.codigo}
            </Text>

            <View className="mb-3 flex-row gap-2">
              <View
                className="flex-1 rounded-xl border p-3"
                style={{
                  backgroundColor: darkMode ? "#00333D" : "#E0F7FA",
                  borderColor: darkMode ? "#0E7490" : "#67E8F9",
                }}
              >
                <View className="mb-1 flex-row items-center gap-2">
                  <Users size={16} color={darkMode ? "#67E8F9" : "#005C6E"} />
                  <Text variant="label" style={{ color: darkMode ? "#67E8F9" : "#005C6E" }}>
                    Capacidade
                  </Text>
                </View>
                <Text
                  variant="body"
                  className="font-semibold"
                  style={{ color: darkMode ? "#ECFEFF" : "#164E63" }}
                >
                  {details.classroom.capacidade} pessoas
                </Text>
              </View>

              <View
                className="flex-1 rounded-xl border p-3"
                style={{ backgroundColor: colors.dangerSoft, borderColor: colors.danger }}
              >
                <View className="mb-1 flex-row items-center gap-2">
                  <MapPin size={16} color={colors.danger} />
                  <Text variant="label" style={{ color: colors.danger }}>Local</Text>
                </View>
                <Text variant="body" className="font-semibold" style={{ color: colors.danger }}>
                  {details.classroom.codigo}
                </Text>
              </View>
            </View>

            <View className="mb-3 rounded-xl p-3" style={{ backgroundColor: colors.surfaceAlt }}>
              <Text variant="label" className="mb-1" style={{ color: colors.textMuted }}>
                Tipo de Sala
              </Text>
              <Text variant="body" className="font-semibold" style={{ color: colors.text }}>
                {details.classroom.tipoSala?.nome ?? "Não informado"}
              </Text>
            </View>

            {profile === "professor" && (
              <View className="mb-3 rounded-xl p-3" style={{ backgroundColor: colors.surfaceAlt }}>
                <View className="mb-3 flex-row items-center">
                  <Cable size={16} color={colors.text} strokeWidth={2} />
                  <Text variant="body" className="ml-2 font-semibold" style={{ color: colors.text }}>
                    Recursos disponíveis
                  </Text>
                </View>
                {details.resources.length === 0 ? (
                  <Text variant="caption" style={{ color: colors.textMuted }}>
                    Nenhum recurso informado.
                  </Text>
                ) : (
                  <View className="gap-2">
                    {details.resources.map((resource) => (
                      <View
                        key={resource.id}
                        className="flex-row items-center justify-between rounded-lg border px-2 py-2"
                        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                      >
                        <Text variant="label" style={{ color: colors.text }}>
                          {resource.recurso.nome}
                        </Text>
                        <Text variant="caption" style={{ color: colors.textMuted }}>
                          {resource.quantidade}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View className="mb-2">
              <View className="mb-3 flex-row items-center gap-2">
                <BookMarked size={18} color={colors.text} />
                <Text variant="subheading" style={{ color: colors.text }}>
                  Alocação
                </Text>
              </View>

              {!details.allocations.length ? (
                <Text variant="caption" style={{ color: colors.textMuted }}>
                  Nenhuma aula alocada nesta sala no período atual.
                </Text>
              ) : (
                allocationDays.map((day) => (
                  <Card key={day} borderColor={colors.border} className="mb-3 w-full rounded-xl border">
                    <CardHeader className="mb-1 w-full">
                      <Text variant="label" className="font-semibold" style={{ color: colors.text }}>
                        {WEEKDAY_NAMES[day] ?? day}
                      </Text>
                    </CardHeader>
                    <CardContent className="w-full">
                      <View className="gap-2">
                        {details.allocations
                          .filter((allocation) => allocation.diaSemana === day)
                          .map((allocation) => (
                            <View key={allocation.id}>
                              <ScheduleItem
                                startTime={formatTime(allocation.blocoHorario.horaInicio)}
                                endTime={formatTime(allocation.blocoHorario.horaFim)}
                                subject={allocation.disciplina.nome}
                                teacher={allocation.professor?.nome ?? "Professor não informado"}
                                location={`Turma ${allocation.turma.codigo}`}
                                accentColor={allocation.disciplina.cor ?? colors.accent}
                                hideMore
                              />
                            </View>
                          ))}
                      </View>
                    </CardContent>
                  </Card>
                ))
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
