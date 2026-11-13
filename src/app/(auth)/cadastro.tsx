import { useLocalSearchParams, useRouter } from 'expo-router';
import { LucideChevronLeft } from 'lucide-react-native';
import { useState, } from 'react';
import {
  Alert,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Text } from '../../components';
import { isUserProfile, saveUserProfile, type UserProfile } from '../../services/userProfile';
import { useAppTheme } from '../../theme/ThemeContext';

export default function CadastroScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ perfil?: string | string[] }>();
  const profileParam = Array.isArray(params.perfil) ? params.perfil[0] : params.perfil;
  const profile: UserProfile = isUserProfile(profileParam) ? profileParam : 'aluno';
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const handleCadastro = async () => {
    if (!email || !senha || !confirmarSenha) {
      return;
    }

    if (senha !== confirmarSenha) {
      return;
    }

    try {
      await saveUserProfile(profile);
      if (profile === 'professor') {
        router.replace('/home');
      } else {
        router.push('/chooseCourse');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil do usuário:', error);
      Alert.alert('Não foi possível criar a conta', 'Tente novamente.');
    }
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


        <Text variant="heading" className="text-center mt-5">
          Cadastro do {profile === 'professor' ? 'Professor' : 'Aluno'}
        </Text>

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
          onPress={() => router.push({ pathname: '/login', params: { perfil: profile } })}
        >
          Já tem conta? Entre
        </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
