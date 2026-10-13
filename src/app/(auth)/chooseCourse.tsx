import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LucideChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components";
import { API_URL } from "../../services/api";
import { useAppTheme } from "../../theme/ThemeContext";

interface Curso {
  id: number;
  nome: string;
  periodicidade: string;
  status: string;
  duracao: number;
  createdAt: string;
  updatedAt: string;
}

interface CursosResponse {
  content: Curso[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

function CourseCard({ item }: { item: Curso }) {
  const scale = useSharedValue(1);
  const { colors, darkMode } = useAppTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 80,
      stiffness: 500,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 80,
      stiffness: 500,
    });
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
<Pressable
  onPressIn={handlePressIn}
  onPressOut={handlePressOut}
  onPress={() =>
    router.push({
      pathname: "/periodSelectionScreen",
      params: {
        cursoId: item.id.toString(),
        cursoNome: item.nome,
      },
    })
  }
  style={[
    styles.card,
    {
      backgroundColor: darkMode
        ? colors.surface
        : "#ffffff",
      borderColor: colors.border,
    },
  ]}
>
  <Text
    style={[
      styles.cardTitle,
      { color: colors.text },
    ]}
  >
    {item.nome}
  </Text>

  <Text
    style={[
      styles.cardSubtitle,
      { color: colors.textMuted },
    ]}
  >
    Periodicidade: {item.periodicidade}
  </Text>

  <Text
    style={[
      styles.cardSubtitle,
      { color: colors.textMuted },
    ]}
  >
    Duração: {item.duracao}
  </Text>
</Pressable>
    </Animated.View>
  );
}

export default function ChooseCourse() {
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const { colors } = useAppTheme();

  useEffect(() => {
    async function carregarCursos() {
      try {
        setCarregando(true);
        setErro("");


    const response = await fetch(`${API_URL}/cursos`);
        if (!response.ok) {
          throw new Error(
            `Erro na requisição: ${response.status}`
          );
  }

        const data: CursosResponse = await response.json();

        setCursos(data.content);
      } catch (error) {
        console.error(
          "Erro ao carregar cursos:",
          error
        );

        setErro(
          "Não foi possível carregar os cursos."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarCursos();
  }, []);

  const filteredCourses = cursos.filter(
    (curso) =>
      curso.nome
        .toLowerCase()
        .includes(busca.toLowerCase()) ||
      curso.periodicidade
        .toLowerCase()
        .includes(busca.toLowerCase())
  );

  const renderItem: ListRenderItem<Curso> = ({
    item,
  }) => <CourseCard item={item} />;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View>
          <Button
            className="btn w-26 justify-center align-center"
            variant="secondary"
            size="sm"
            onPress={() => router.back()}
          >
            <View className="flex-row gap-1 items-center">
              <LucideChevronLeft size={24} />

              <Text className="text-primary m-0">
                Voltar
              </Text>
            </View>
          </Button>
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          Escolha seu curso
        </Text>

        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={24}
            color={colors.text}
          />

          <View style={styles.separator} />

          <TextInput
            style={[
              styles.searchInput,
              {
                color: colors.text,
                outlineStyle: "none",
              } as any,
            ]}
            placeholder="Buscar"
            placeholderTextColor={colors.textMuted}
            value={busca}
            onChangeText={setBusca}
            underlineColorAndroid="transparent"
          />
        </View>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color={colors.text}
          />
        ) : erro ? (
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
            }}
          >
            {erro}
          </Text>
        ) : (
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) =>
              item.id.toString()
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.listContainer
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
  },

  separator: {
    width: 1,
    height: 20,
    marginHorizontal: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  listContainer: {
    paddingBottom: 20,
  },

  cardWrapper: {
    marginBottom: 12,
  },

  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
});