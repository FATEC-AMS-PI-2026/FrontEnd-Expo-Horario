import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppTheme } from "../../theme/ThemeContext";

interface Professor {
  id: string;
  nome: string;
  materias: string;
  cursos: string;
  foto: ImageSourcePropType;
}

// Formato da paginação retornada pelo backend.
interface Pagina<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface ProfessorApi {
  id: number;
  nome: string;
}

interface VinculoApi {
  id: number;
  professorId: number;
  disciplinaId: number;
}

interface DisciplinaApi {
  id: number;
  nome: string;
  curso: {
    id: number;
    nome: string;
  } | null;
}

// Busca todas as páginas de um endpoint.
async function buscarTodasPaginas<T>(endpoint: string): Promise<T[]> {
  const registros: T[] = [];
  let paginaAtual = 0;
  let totalPaginas = 1;

  do {
    const response = await fetch(
      `${API_URL}${endpoint}?page=${paginaAtual}&size=100`
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao consultar ${endpoint}: HTTP ${response.status}`
      );
    }

    const pagina: Pagina<T> = await response.json();

    registros.push(...pagina.content);
    totalPaginas = pagina.totalPages;
    paginaAtual++;
  } while (paginaAtual < totalPaginas);

  return registros;
}

export default function Professors() {
  const { colors } = useAppTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [professorsData, setProfessorsData] = useState<Professor[]>([]);

 const fetchData = async () => {
  setIsLoading(true);
  setIsError(false);

  try {
    // As três consultas são independentes.
    const [professores, vinculos, disciplinas] = await Promise.all([
      buscarTodasPaginas<ProfessorApi>("/professores"),
      buscarTodasPaginas<VinculoApi>("/professores-disciplinas"),
      buscarTodasPaginas<DisciplinaApi>("/disciplinas"),
    ]);

    const disciplinasPorId = new Map(
      disciplinas.map((disciplina) => [disciplina.id, disciplina])
    );

    const dados: Professor[] = professores.map((professor) => {
      const disciplinasDoProfessor = vinculos
        .filter((vinculo) => vinculo.professorId === professor.id)
        .map((vinculo) => disciplinasPorId.get(vinculo.disciplinaId))
        .filter(
          (disciplina): disciplina is DisciplinaApi =>
            disciplina !== undefined
        );

      const nomesDisciplinas = [
        ...new Set(
          disciplinasDoProfessor.map((disciplina) => disciplina.nome)
        ),
      ];

      const nomesCursos = [
        ...new Set(
          disciplinasDoProfessor
            .map((disciplina) => disciplina.curso?.nome)
            .filter((nome): nome is string => Boolean(nome))
        ),
      ];

      return {
        id: String(professor.id),
        nome: professor.nome,
        materias: nomesDisciplinas.join("; ") || "Sem disciplinas vinculadas",
        cursos: nomesCursos.join("; ") || "Sem cursos vinculados",
        foto: require("../../../assets/images/professor.png"),
      };
    });

    setProfessorsData(dados);
  } catch (error) {
    console.error("Erro ao carregar professores:", error);
    setIsError(true);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const filteredProfessors = professorsData.filter((professor) =>
  normalizar(professor.nome).includes(normalizar(searchQuery))
);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="px-5 pt-4 flex-1">
        {/* Título */}
        <View className="flex-row items-center justify-between mb-6 mt-2">
          <Text
            className="text-lg font-bold"
            style={{ color: colors.text }}
          >
            Professores
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* Barra de pesquisa */}
        <View className="flex-row items-center mb-6">
          <View
            className="flex-1 flex-row items-center rounded-md px-3 py-2 mr-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <Feather
              name="search"
              size={18}
              color={colors.accent}
            />

            <TextInput
              placeholder="Buscar"
              placeholderTextColor={colors.textMuted}
              className="flex-1 ml-2 text-base"
              style={{ color: colors.text }}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity>
            <Feather
              name="filter"
              size={24}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Carregamento */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator
              size="large"
              color={colors.accent}
            />

            <Text
              className="mt-2"
              style={{ color: colors.textMuted }}
            >
              Carregando professores...
            </Text>
          </View>
        ) : isError ? (
          /* Erro */
          <View className="flex-1 justify-center items-center">
            <Feather
              name="alert-triangle"
              size={48}
              color={colors.danger}
            />

            <Text
              className="text-base mt-4 text-center"
              style={{ color: colors.text }}
            >
              Ocorreu um erro ao carregar os dados.
            </Text>

            <TouchableOpacity
              className="mt-4 px-4 py-2 rounded-md"
              style={{ backgroundColor: colors.accent }}
              onPress={fetchData}
            >
              <Text
                className="font-medium"
                style={{ color: colors.background }}
              >
                Tentar Novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredProfessors.length === 0 ? (
          /* Nenhum resultado */
          <View className="flex-1 justify-center items-center">
            <Feather
              name="search"
              size={48}
              color={colors.textMuted}
            />

            <Text
              className="text-base mt-4 text-center"
              style={{ color: colors.textMuted }}
            >
              Nenhum professor encontrado com "{searchQuery}".
            </Text>
          </View>
        ) : (
          /* Lista de professores */
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredProfessors.map((prof) => (
              <TouchableOpacity
                key={prof.id}
                className="rounded-lg p-3 mb-4"
                accessibilityRole="button"
                accessibilityLabel={`Ver horários de ${prof.nome}`}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/professorsdetalhe",
                    params: { id: prof.id, nome: prof.nome, materias: prof.materias },
                  })
                }
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-center">
                  <Image
                    source={prof.foto}
                    className="rounded-md mr-3"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: colors.surfaceAlt,
                    }}
                    resizeMode="cover"
                  />

                  <View className="flex-1 justify-center">
                    <Text
                      className="text-base font-semibold"
                      style={{ color: colors.text }}
                    >
                      {prof.nome}
                    </Text>

                    <Text
                      className="text-xs mt-1"
                      style={{ color: colors.textMuted }}
                      numberOfLines={1}
                    >
                      {prof.materias}
                    </Text>

                    <Text
                      className="text-xs mt-1"
                      style={{ color: colors.accent }}
                      numberOfLines={1}
                    >
                      Cursos: {prof.cursos}
                    </Text>
                  </View>
                </View>

                <View className="items-end mt-1">
                  <Text
                    className="text-xs font-medium"
                    style={{ color: colors.accent }}
                  >
                    Ver Horários
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <View className="h-10" />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
