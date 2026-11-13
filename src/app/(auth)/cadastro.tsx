import { useRouter } from 'expo-router';
import { LucideChevronLeft } from 'lucide-react-native';
import { useState, } from 'react';
import {
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Text } from '../../components';
import { useAppTheme } from '../../theme/ThemeContext';

export default function CadastroScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const handleCadastro = () => {
    if (!email || !senha || !confirmarSenha) {
      return;
    }

    if (senha !== confirmarSenha) {
      return;
    }

    console.log({
      email,
      senha,
    });

    router.push('/chooseCourse');
  };

  return (
    <SafeAreaView
  
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <View className="flex-1 items-center" style={{ backgroundColor: colors.background }}>

        <View className="mt-5 mx-5 self-start">
            <Button
              className="btn w-26 justify-center align-center"
              variant="secondary"
              size="sm"
              onPress={() => router.back()}
            >
              <View className="flex-row gap-1 items-center">
                <LucideChevronLeft size={24} color={colors.text} />
                <Text style={{ color: colors.text }} className="m-0">
                  Voltar
                </Text>
              </View>
            </Button>
          </View>
          
        <View className="w-full max-w-[400px]">


        <Text variant="heading" className="text-center mt-5">Criar Conta</Text>

        <Text variant="caption" className="text-center mt-2 mb-10">
          Insira seus dados pra criar conta
        </Text>

        <View className="mx-2 gap-2">
          <Input
            label="Email"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Senha"
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <Input
            label="Repita a senha"
            placeholder="Senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>


        <Button
          className="mx-5 mt-4"
          variant="primary"
          onPress={handleCadastro}
        >
          Criar Conta
        </Button>

        <Button
          className="mx-5 mt-2"
          variant="secondary"
          onPress={() => router.push('/login')}
        >
          Já tem conta? Entre
        </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
