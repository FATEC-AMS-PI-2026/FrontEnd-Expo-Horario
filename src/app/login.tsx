import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  return (
    <View style={styles.container}>

      
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.subtitle}>
          Insira seus dados para entrar
        </Text>
      </View>

      
      <View style={styles.form}>

        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
             placeholderTextColor="rgba(0, 0, 0, 0.35)"
            autoCapitalize="none"
          />
        </View>

        
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
             placeholderTextColor="rgba(0, 0, 0, 0.35)"
            secureTextEntry
          />

          <Pressable style={styles.eyeButton}>
            <Ionicons
              name="eye-outline"
              size={22}
              color="#005C6E"
            />
          </Pressable>
        </View>

        
        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>
            Esqueci minha senha
          </Text>
        </Pressable>

       
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>

       

        <Pressable style={styles.registerButton}>
          <Text style={styles.registerText}>
            Não tem uma conta? Crie uma
          </Text>
        </Pressable>



      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },

  form: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },

  forgotPassword: {
    alignItems: "flex-start",
    marginBottom: 20,
    marginTop: 8,
  },

  forgotPasswordText: {
    fontSize: 13,
    color: "#005C6E",
  },

  button: {
    height: 48,
    backgroundColor: "#005C6E",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  registerButton: {
    height: 48,
    backgroundColor: "#c0c0c0",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 8,
    justifyContent: "center",
  },

  registerText: {
    fontSize: 14,
    color: "#005C6E",
  },

  registerLink: {
    color: "#005C6E",
    fontWeight: "600",
  },
  passwordContainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 14,
  },

  eyeButton: {
    paddingHorizontal: 14,
  },
});