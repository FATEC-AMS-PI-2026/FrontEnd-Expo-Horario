import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
// Importação atualizada para a biblioteca recomendada
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

const CURSOS = [
  { id: '1', nome: 'Analise e Desenvolvimento de Sistemas', periodo: 'Manhã', tipo: 'Tecnólogo' },
  { id: '2', nome: 'Gestão de Processos Gerenciais', periodo: 'Manhã', tipo: 'Tecnólogo' },
  { id: '3', nome: 'Analise e Desenvolvimento de Sistemas', periodo: 'Tarde (AMS)', tipo: 'Tecnólogo' },
  { id: '4', nome: 'Mecatrônica Industrial', periodo: 'Noite', tipo: 'Tecnólogo' },
  { id: '5', nome: 'Gestão de Eventos', periodo: 'Manhã', tipo: 'Tecnólogo' },
  { id: '6', nome: 'Secretariado', periodo: 'Manhã', tipo: 'Tecnólogo' },
];

export default function ChooseCourse() {
  const [busca, setBusca] = useState('');

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardSubtitle}>Período: {item.periodo}</Text>
      <Text style={styles.cardSubtitle}>Tipo: {item.tipo}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Título */}
        <Text style={styles.title}>Escolha seu curso</Text>

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#333" />
          <View style={styles.separator} />
          <TextInput
  style={styles.searchInput}
  placeholder="Buscar"
  placeholderTextColor="#ffffff"
  value={busca}
  onChangeText={setBusca}
  underlineColorAndroid="transparent" // Adicione esta linha para o Android
/>
        </View>

        {/* Lista de Cursos */}
        <FlatList
          data={CURSOS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20, // Ajustado para evitar espaço excessivo com o novo SafeAreaView
    marginBottom: 30,
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  
});