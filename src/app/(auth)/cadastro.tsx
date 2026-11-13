import { useLocalSearchParams, useRouter } from 'expo-router';
import { LucideChevronLeft, LucideEye, LucideEyeOff } from 'lucide-react-native';
import { useState, } from 'react';
import {
  ScrollView,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, PasswordStrength, Text } from '../../components';
import { isUserProfile, saveUserProfile, type UserProfile } from '../../services/userProfile';
import { getPasswordStrength, isValidEmail } from '../../services/validation';
import { useAppTheme } from '../../theme/ThemeContext';

type Erros = {
  email?: string;
  senha?: string;
  confirmarSenha?: string;
  geral?: string;
};

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
  const [erros, setErros] = useState<Erros>({});

  const forcaSenha = getPasswordStrength(senha);
  const podeCadastrar = forcaSenha.isStrong;

  function limparErro(campo: keyof Omit<Erros, 'geral'>) {
    setErros((atual) =>
      atual[campo] || atual.geral ? { ...atual, [campo]: undefined, geral: undefined } : atual,
    );
  }

  const handleCadastro = async () => {
    const proximos: Erros = {};

    if (!email.trim()) {
      proximos.email = 'Informe seu email.';
    } else if (!isValidEmail(email)) {
      proximos.email = 'Digite um email válido.';
    }

    if (!senha) {
      proximos.senha = 'Informe uma senha.';
    } else if (!forcaSenha.isStrong) {
      proximos.senha = 'A senha não atende aos requisitos.';
    }

    if (!confirmarSenha) {
      proximos.confirmarSenha = 'Repita a senha.';
    } else if (senha !== confirmarSenha) {
      proximos.confirmarSenha = 'As senhas não coincidem.';
    }

    setErros(proximos);

    if (Object.keys(proximos).length > 0) {
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
      setErros({ geral: 'Não foi possível criar a conta. Tente novamente.' });
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
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

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
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
              onChangeText={(valor) => {
                setEmail(valor);
                limparErro('email');
              }}
              error={erros.email}
            />
            <Input
              label="Senha"
              placeholder="Senha"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={(valor) => {
                setSenha(valor);
                limparErro('senha');
              }}
              error={erros.senha}
              rightIcon={
                <Pressable
                  onPress={() => setMostrarSenha((visivel) => !visivel)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? (
                    <LucideEyeOff size={24} color={colors.textMuted} />
                  ) : (
                    <LucideEye size={24} color={colors.textMuted} />
                  )}
                </Pressable>
              }
            />
            <Input
              label="Repita a senha"
              placeholder="Senha"
              secureTextEntry={!mostrarConfirmacao}
              value={confirmarSenha}
              onChangeText={(valor) => {
                setConfirmarSenha(valor);
                limparErro('confirmarSenha');
              }}
              error={erros.confirmarSenha}
              rightIcon={
                <Pressable
                  onPress={() => setMostrarConfirmacao((visivel) => !visivel)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={mostrarConfirmacao ? 'Ocultar repetição da senha' : 'Mostrar repetição da senha'}
                >
                  {mostrarConfirmacao ? (
                    <LucideEyeOff size={24} color={colors.textMuted} />
                  ) : (
                    <LucideEye size={24} color={colors.textMuted} />
                  )}
                </Pressable>
              }
            />
          </View>

          {senha.length > 0 && (
            <View className="mx-2 mt-1">
              <PasswordStrength password={senha} />
            </View>
          )}

          {erros.geral && (
            <Text variant="caption" className="mx-5 mt-3 text-center" style={{ color: colors.danger }}>
              {erros.geral}
            </Text>
          )}

          <Button
            className="mx-5 mt-4"
            variant="primary"
            onPress={handleCadastro}
            disabled={!podeCadastrar}
            accessibilityHint={
              podeCadastrar ? undefined : 'A senha precisa atender a todos os requisitos'
            }
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
      </ScrollView>
    </SafeAreaView>
  );
}
