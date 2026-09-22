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
  View
} from "react-native";

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
    materias: "Projeto Integrador I; Técnica avançadas de Programação Web e Mobile",
    cursos: "Análise e Desenvolvimento de Sistemas",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
  {
    id: "2",
    nome: "Renato Cardoso",
    materias: "Interação Humano-Computador; Técnicas Avançadas de Banco de Dados",
    cursos: "Análise e Desenvolvimento de Sistemas",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
  {
    id: "3",
    nome: "Melky Duenas",
    materias: "Organização de Computadores e Sistemas Operacionais; Técnicas Avançadas de Programação",
    cursos: "Análise e Desenvolvimento de Sistemas",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
  {
    id: "4",
    nome: "Lilian Simão",
    materias: "Engenharia de Software; Ética",
    cursos: "Análise e Desenvolvimento de Sistemas; Processos Gerenciais",
    foto: require("../../../assets/images/professorExemplo.png"),
  },
];

export default function Professors() {
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

  const filteredProfessors = professorsData.filter((prof) =>
    prof.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.materias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-4 flex-1">
        
        <View className="flex-row items-center justify-between mb-6 mt-2">
          <Text className="text-lg font-bold text-black">Professores</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 flex-row items-center bg-white border border-gray-300 rounded-md px-3 py-2 mr-4">
            <Feather name="search" size={18} color="#006b7b" />
            <TextInput
              placeholder="Buscar"
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-base text-gray-800"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity>
            <Feather name="filter" size={24} color="#006b7b" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#006b7b" />
            <Text className="text-gray-500 mt-2">Carregando professores...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 justify-center items-center">
            <Feather name="alert-triangle" size={48} color="#ef4444" />
            <Text className="text-base text-gray-800 mt-4 text-center">
              Ocorreu um erro ao carregar os dados.
            </Text>
            <TouchableOpacity 
              className="mt-4 bg-[#006b7b] px-4 py-2 rounded-md"
              onPress={fetchData}
            >
              <Text className="text-white font-medium">Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProfessors.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Feather name="search" size={48} color="#d1d5db" />
            <Text className="text-base text-gray-500 mt-4 text-center">
              Nenhum professor encontrado com "{searchQuery}".
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredProfessors.map((prof) => (
              <View 
                key={prof.id} 
                className="bg-[#f0f0f0] rounded-lg p-3 mb-4 border border-gray-200"
              >
                <View className="flex-row items-center">
                  <Image 
                    source={prof.foto} 
                    className="rounded-md mr-3 bg-gray-300" 
                    style={{ width: 40, height: 40 }} 
                    resizeMode="cover"
                  />
                  <View className="flex-1 justify-center">
                    <Text className="text-base font-semibold text-black">
                      {prof.nome}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
                      {prof.materias} 
                    </Text>
                  </View>
                </View>

                <View className="items-end mt-1">
                  <TouchableOpacity>
                    <Text className="text-xs font-medium text-[#006b7b]">
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