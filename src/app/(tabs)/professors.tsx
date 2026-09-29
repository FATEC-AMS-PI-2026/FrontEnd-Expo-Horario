import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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

const professors: Professor[] = [
  {
    id: "1",
    nome: "Glauco Todesco",
    materias:
      "Projeto Integrador I; Técnica avançadas de Programação Web e Mobile",
    cursos: "Análise e Desenvolvimento de Sistemas",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
  {
    id: "2",
    nome: "Renato Cardoso",
    materias:
      "Interação Humano-Computador; Técnicas Avançadas de Banco de Dados",
    cursos: "Análise e Desenvolvimento de Sistemas",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
  {
    id: "3",
    nome: "Melky Duenas",
    materias:
      "Organização de Computadores e Sistemas Operacionais; Técnicas Avançadas de Programação",
    cursos: "Análise e Desenvolvimento de Sistemas",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
  {
    id: "4",
    nome: "Lilian Simão",
    materias: "Engenharia de Software; Ética",
    cursos:
      "Análise e Desenvolvimento de Sistemas; Processos Gerenciais",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
];

export default function Professors() {
  const { colors } = useAppTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [professorsData, setProfessorsData] = useState<Professor[]>([]);

  const fetchData = () => {
    setIsLoading(true);
    setIsError(false);

    setTimeout(() => {
      const simulateError = false;

      if (simulateError) {
        setIsError(true);
      } else {
        setProfessorsData(professors);
      }

      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProfessors = professorsData.filter(
    (prof) =>
      prof.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.materias.toLowerCase().includes(searchQuery.toLowerCase())
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
              <View
                key={prof.id}
                className="rounded-lg p-3 mb-4"
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
                  <TouchableOpacity>
                    <Text
                      className="text-xs font-medium"
                      style={{ color: colors.accent }}
                    >
                      Ver Horários
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View className="h-10" />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}