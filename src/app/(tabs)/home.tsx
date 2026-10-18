import { useRouter } from "expo-router";
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../../global.css";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  ScheduleItem,
  Text,
} from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

interface DayOption {
  id: number;
  label: string;
  dayNum: string;
  isToday?: boolean;
}

const DAYS_OF_WEEK: DayOption[] = [
  { id: 1, label: "Seg", dayNum: "13", isToday: true },
  { id: 2, label: "Ter", dayNum: "14" },
  { id: 3, label: "Qua", dayNum: "15" },
  { id: 4, label: "Qui", dayNum: "16" },
  { id: 5, label: "Sex", dayNum: "17" },
  { id: 6, label: "Sáb", dayNum: "18" },
];

export default function Home() {
  const { colors, darkMode } = useAppTheme();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Paleta com contraste WCAG 2.1 AA garantido para fundo escuro (#1f2937 / #0f172a) e claro
  const disciplineAccents = useMemo(() => {
    return {
      primary: darkMode ? "#67e8f9" : "#005C6E", // cyan-300 no dark (contraste > 8:1)
      secondary: darkMode ? "#38bdf8" : "#0891b2", // sky-400 no dark (contraste > 6.5:1)
      purple: darkMode ? "#c084fc" : "#7c3aed", // purple-400 no dark (contraste > 6.5:1)
    };
  }, [darkMode]);

  // Aulas para o dia selecionado com cores adaptadas ao modo escuro e acessibilidade
  const scheduleData = useMemo(() => {
    if (selectedDay === 1) {
      return [
        {
          id: "1",
          startTime: "13:20h",
          endTime: "15:00h",
          subject: "Projeto Integrador I",
          teacher: "Glauco Todesco",
          location: "Lab. 03",
          accentColor: disciplineAccents.primary,
        },
        {
          id: "2",
          startTime: "15:00h",
          endTime: "16:50h",
          subject: "Banco de Dados",
          teacher: "Renato Cardoso",
          location: "Lab. 03",
          accentColor: disciplineAccents.secondary,
        },
        {
          id: "3",
          startTime: "17:10h",
          endTime: "18:50h",
          subject: "Engenharia de Software",
          teacher: "Lilian Simão",
          location: "Sala 12",
          accentColor: disciplineAccents.purple,
        },
      ];
    }
    if (selectedDay === 2) {
      return [
        {
          id: "4",
          startTime: "13:20h",
          endTime: "15:00h",
          subject: "Técnicas de Programação Web",
          teacher: "Glauco Todesco",
          location: "Lab. 01",
          accentColor: disciplineAccents.primary,
        },
        {
          id: "5",
          startTime: "15:00h",
          endTime: "16:50h",
          subject: "Sistemas Operacionais",
          teacher: "Melky Duenas",
          location: "Lab. 02",
          accentColor: disciplineAccents.secondary,
        },
      ];
    }
    return [
      {
        id: "empty",
        startTime: "--:--",
        endTime: "--:--",
        subject: "Sem aulas registradas",
        teacher: "Dia livre",
        location: "-",
        accentColor: colors.textMuted,
      },
    ];
  }, [selectedDay, disciplineAccents, colors.textMuted]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: darkMode ? colors.backgroundAlt : colors.background }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1 px-4"
      >
        {/* Header Superior: Saudação, Perfil e Notificações */}
        <View className="flex-row items-center justify-between pt-3 pb-4">
          <View className="flex-row items-center gap-3">
            <View>
              <View className="flex-row items-center gap-1.5">
                <Text variant="caption" className="text-xs" style={{ color: colors.textMuted }}>
                  Bem-vindo de volta
                </Text>
              </View>
              <Text variant="heading" style={{ color: colors.text, fontSize: 20 }}>
                Carlos Mattei
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{
              backgroundColor: darkMode ? colors.surface : colors.surfaceAlt,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            accessibilityRole="button"
            accessibilityLabel="Notificações"
            activeOpacity={0.7}
          >
            <Bell size={20} color={colors.text} />
            <View
              className="w-2.5 h-2.5 rounded-full absolute top-2.5 right-2.5"
              style={{ backgroundColor: colors.danger }}
            />
          </TouchableOpacity>
        </View>

        {/* Hero Card: Próxima Aula / Em Andamento */}
        <View
          className="rounded-2xl p-4 mt-2 overflow-hidden"
          style={{
            backgroundColor: darkMode ? "#0f2e35" : "#005C6E",
            borderWidth: 1,
            borderColor: darkMode ? "#164e63" : "transparent",
          }}
        >
          {/* Header do Hero */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text
                variant="label"
                className="font-semibold uppercase tracking-wider text-xs"
                style={{ color: "#E2E8F0" }}
              >
                Próxima Aula • Em 25 min
              </Text>
            </View>
            <View
              className="px-2.5 py-1 rounded-full"
              style={{ backgroundColor: darkMode ? "#164e63" : "rgba(255,255,255,0.22)" }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>
                13:20 - 15:00
              </Text>
            </View>
          </View>

          {/* Conteúdo do Hero */}
          <View className="mt-3.5">
            <Text
              variant="heading"
              style={{ color: "#FFFFFF", fontSize: 20, lineHeight: 26 }}
            >
              Projeto Integrador I
            </Text>
            {/* Texto de professor com contraste WCAG garantido (> 6:1 em fundo escuro) */}
            <Text
              variant="body"
              className="mt-1 text-sm font-medium"
              style={{ color: darkMode ? "#cbd5e1" : "#E2E8F0" }}
            >
              Prof. Glauco Todesco
            </Text>
          </View>

          {/* Rodapé do Hero com Localização e Ação Rápida */}
          <View
            className="flex-row items-center justify-between mt-4 pt-3"
            style={{ borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.18)" }}
          >
            <View className="flex-row items-center gap-1.5">
              <MapPin size={16} color={darkMode ? "#67e8f9" : "#e0f2fe"} />
              <Text
                variant="body"
                className="font-medium text-xs"
                style={{ color: "#FFFFFF" }}
              >
                Laboratório 03 • Bloco B
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/classrooms")}
              className="flex-row items-center px-3 py-1.5 rounded-lg gap-1"
              style={{ backgroundColor: darkMode ? "#155e75" : "rgba(255,255,255,0.22)" }}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>
                Ver sala
              </Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Action Grid (Atalhos rápidos para Salas, Professores, Matérias) */}
        <View className="mt-5">
          <Text
            variant="label"
            className="mb-2.5 px-0.5 uppercase tracking-wider text-xs font-semibold"
            style={{ color: colors.textMuted }}
          >
            Acesso Rápido
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/classrooms")}
              className="flex-1 p-3 rounded-xl items-center justify-center"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-1.5"
                style={{ backgroundColor: darkMode ? "#083344" : "#e0f2fe" }}
              >
                <MapPin size={20} color={darkMode ? "#38bdf8" : colors.accent} />
              </View>
              <Text
                variant="label"
                style={{ color: colors.text, fontSize: 13 }}
              >
                Salas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/professors")}
              className="flex-1 p-3 rounded-xl items-center justify-center"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-1.5"
                style={{ backgroundColor: darkMode ? "#3b0764" : "#f3e8ff" }}
              >
                <Users size={20} color={darkMode ? "#c084fc" : "#7c3aed"} />
              </View>
              <Text
                variant="label"
                style={{ color: colors.text, fontSize: 13 }}
              >
                Professores
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/subjects")}
              className="flex-1 p-3 rounded-xl items-center justify-center"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-1.5"
                style={{ backgroundColor: darkMode ? "#064e3b" : "#dcfce7" }}
              >
                <BookOpen size={20} color={darkMode ? "#4ade80" : "#15803d"} />
              </View>
              <Text
                variant="label"
                style={{ color: colors.text, fontSize: 13 }}
              >
                Grade
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seletor Semanal / Day Picker Horizontal */}
        <View className="mt-5">
          <View className="flex-row items-center justify-between mb-3 px-0.5">
            <View className="flex-row items-center gap-2">
              <Calendar size={18} color={darkMode ? "#38bdf8" : colors.accent} />
              <Text variant="subheading" style={{ color: colors.text }}>
                Cronograma Semanal
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/subjects")}
              className="flex-row items-center gap-1"
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: darkMode ? "#38bdf8" : colors.accent }}
              >
                Ver tudo
              </Text>
              <ChevronRight size={14} color={darkMode ? "#38bdf8" : colors.accent} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row py-1"
          >
            {DAYS_OF_WEEK.map((item) => {
              const isSelected = selectedDay === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedDay(item.id)}
                  className="items-center justify-center px-4 py-2.5 rounded-xl mr-2"
                  style={{
                    backgroundColor: isSelected
                      ? (darkMode ? "#0e7490" : colors.accent)
                      : colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? (darkMode ? "#38bdf8" : colors.accent)
                      : colors.border,
                    minWidth: 60,
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: isSelected ? "#FFFFFF" : colors.textMuted,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginTop: 2,
                      color: isSelected ? "#FFFFFF" : colors.text,
                    }}
                  >
                    {item.dayNum}
                  </Text>
                  {item.isToday && (
                    <View
                      className="w-1.5 h-1.5 rounded-full mt-1"
                      style={{
                        backgroundColor: isSelected
                          ? "#FFFFFF"
                          : (darkMode ? "#38bdf8" : colors.accent),
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de Aulas do Dia Selecionado */}
        <Card
          className="mt-4 w-full rounded-2xl"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <CardHeader className="mb-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text variant="subheading" style={{ color: colors.text }}>
                  {selectedDay === 1
                    ? "Aulas de Segunda-feira"
                    : selectedDay === 2
                    ? "Aulas de Terça-feira"
                    : "Horários"}
                </Text>
                <Text variant="caption" className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                  {scheduleData.length} disciplina{scheduleData.length > 1 ? "s" : ""} programada{scheduleData.length > 1 ? "s" : ""}
                </Text>
              </View>

              {/* Tag com bom contraste para fundo escuro ou claro */}
              <View
                className="px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: darkMode ? "#0c4a6e" : "#e0f2fe",
                  borderWidth: 1,
                  borderColor: darkMode ? "#38bdf8" : "#bae6fd",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: darkMode ? "#bae6fd" : "#0369a1",
                  }}
                >
                  {selectedDay === 1 ? "Hoje" : "Previsto"}
                </Text>
              </View>
            </View>
          </CardHeader>

          {/* CardContent em flex column limpo, sem elementos sobrepostos */}
          <CardContent
            className="rounded-xl p-2.5 w-full flex-col gap-1.5"
            style={{
              backgroundColor: darkMode ? colors.backgroundAlt : "#F0F4F8",
            }}
          >
            {scheduleData.map((item) => (
              <View key={item.id} className="w-full">
                <ScheduleItem
                  startTime={item.startTime}
                  endTime={item.endTime}
                  subject={item.subject}
                  teacher={item.teacher}
                  location={item.location}
                  accentColor={item.accentColor}
                  isEmpty={item.id === "empty"}
                />
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Card Informativo / Status da Turma */}
        <View
          className="mt-4 p-4 rounded-xl flex-row items-center gap-3"
          style={{
            backgroundColor: darkMode ? colors.surface : "#f8fafc",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            className="w-9 h-9 rounded-full items-center justify-center shrink-0"
            style={{ backgroundColor: darkMode ? "#064e3b" : "#dcfce7" }}
          >
            <CheckCircle2 size={18} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text variant="label" className="text-sm font-semibold" style={{ color: colors.text }}>
              Semestre 2026/2 ativo
            </Text>
            <Text variant="caption" className="text-xs leading-4 mt-0.5" style={{ color: colors.textMuted }}>
              Grade horária sincronizada com a coordenação de curso
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
