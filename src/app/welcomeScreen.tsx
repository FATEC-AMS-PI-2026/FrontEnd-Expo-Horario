import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "../components";

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
        <Text variant="heading">Gerenciador de Horários</Text>
        <Text variant="label" style={{ textAlign: "center"}}>
          Veja rapidamente os horários de aula, professores e salas do seu curso.
        </Text>
          

        <View style={styles.actionContainer}>

          <Text variant="body" style={{ textAlign: "center", marginBottom: 12 }}>Escolha quem você é</Text>

          <Button variant="primary" size="lg">Sou Aluno</Button>        
          
          <Button variant="secondary" size="lg">Sou Professor</Button>            
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
    paddingHorizontal: 12 
  },

  actionContainer: {
    width: "100%",
    marginTop: 20, 
    gap: 12,
  },

  
});