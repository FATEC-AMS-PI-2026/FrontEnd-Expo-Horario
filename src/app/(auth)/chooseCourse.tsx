import { Feather } from '@expo/vector-icons';
import { router } from "expo-router";
import { LucideChevronLeft } from 'lucide-react-native';
import { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

interface Curso {
  id: string;
  nome: string;
  periodo: string;
  tipo: string;
}

const CURSOS: Curso[] = [
  { id: '1', nome: 'Analise e Desenvolvimento de Sistemas', periodo: 'Manhã', tipo: 'Tecnólogo' },
  { id: '2', nome: 'Gestão de Processos Gerenciais', periodo: 'Manhã', tipo: 'Tecnólogo' },
  { id: '3', nome: 'Analise e Desenvolvimento de Sistemas', periodo: 'Tarde (AMS)', tipo: 'Tecnólogo' },
  { id: '4', nome: 'Mecatrônica Industrial', periodo: 'Noite', tipo: 'Tecnólogo' },
  { id: '5', nome: 'Gestão de Eventos', periodo: 'Manhã', tipo: 'Tecnólogo' },
  { id: '6', nome: 'Secretariado', periodo: 'Manhã', tipo: 'Tecnólogo' },
];

function CourseCard({ item }: { item: Curso }) {
  const scale = useSharedValue(1);
  const { colors, darkMode } = useAppTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 80, stiffness: 500 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 80, stiffness: 500 });
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => router.push("/periodSelectionScreen")}
        style={[
          styles.card,
          {
            backgroundColor: darkMode ? colors.surface : "#ffffff",
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.nome}</Text>
        <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>Período: {item.periodo}</Text>
        <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>Tipo: {item.tipo}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ChooseCourse() {
  const [busca, setBusca] = useState('');
  const { colors, darkMode } = useAppTheme();

  const filteredCourses = CURSOS.filter((curso) =>
    curso.nome.toLowerCase().includes(busca.toLowerCase()) ||
    curso.periodo.toLowerCase().includes(busca.toLowerCase())
  );

  const renderItem: ListRenderItem<Curso> = ({ item }) => (
    <CourseCard item={item} />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View>
          <Button
            className="btn w-26 justify-center align-center"
            variant="secondary"
            size="sm"
            onPress={() => router.back()}
          >
            <View className="flex-row gap-1 items-center">
              <LucideChevronLeft size={24} />
              <Text className="text-primary m-0">Voltar</Text>
            </View>
          </Button>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Escolha seu curso</Text>

        <View style={styles.searchContainer}>
          <Feather name="search" size={24} color="#333" />
          <View style={styles.separator} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, outlineStyle: 'none' } as any]}
            placeholder="Buscar"
            placeholderTextColor={colors.textMuted}
            value={busca}
            onChangeText={setBusca}
            underlineColorAndroid="transparent"
          />
        </View>

        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
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