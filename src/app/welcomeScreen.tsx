import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image
          source={require("../../assets/images/cpsWelcome.png")}
          style={styles.image}
          resizeMode="cover" 
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Gerenciador de Horários</Text>
        <Text style={styles.text}>
          Veja rapidamente os horários de aula, professores e salas do seu curso.
        </Text>
        
        <View style={styles.actionContainer}>
          <Text style={styles.option}>Escolha quem você é</Text>
          
          <TouchableOpacity style={styles.buttonAluno}>
            <Text style={styles.buttonTextAluno}>Sou Aluno</Text>
          </TouchableOpacity>        
          
          <TouchableOpacity style={styles.buttonProfessor}>
            <Text style={styles.buttonTextProfessor}>Sou Professor</Text>
          </TouchableOpacity>            
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
  },
  containerImage: {
    width: "100%", 
    height: "50%", 
    overflow: "hidden", 
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1, 
    alignItems: "center",
    paddingTop: 30, 
    paddingHorizontal: 12, 
  },
  title: {
    fontSize: 20, 
    fontWeight: "900", 
    color: "#000000",
    textAlign: "center",
  },
  text: {
    fontSize: 14, 
    color: "#555555", 
    textAlign: "center", 
    marginTop: 10, 
    lineHeight: 20, 
  },
  actionContainer: {
    width: "100%",
    marginTop: 20, 
    alignItems: "center",
  },
  option: {
    fontSize: 14, 
    color: "#000000",
    marginBottom: 15, 
  },
  
  buttonAluno: {
    backgroundColor: "#005C6E", 
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, 
    marginBottom: 10, 
  },
  buttonTextAluno: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  buttonProfessor: {
    backgroundColor: "#DADADA", 
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonTextProfessor: {
    color: "#005C6E", 
    fontSize: 14,
  },
});