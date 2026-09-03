import { useState, } from 'react';
import {
    View,
} from 'react-native';
import { Button, Input, Text } from '../components';

export default function CadastroScreen() {
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
  };

  return (
    
        <View className="flex-1 bg-white">
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
            onPress={() => console.log('Ir para login')}
          >
            Já tem conta? Entre
          </Button>
        </View>
  );
}

