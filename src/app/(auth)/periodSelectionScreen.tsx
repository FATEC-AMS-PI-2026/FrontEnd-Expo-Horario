import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "../../components";
import { API_URL } from "../../services/api";
import { useAppTheme } from "../../theme/ThemeContext";
import { LucideChevronLeft } from "lucide-react-native";

interface Turma {
    id: number;
    codigo: string;
    periodo: number;
    ano: number;
    curso: { id: number; nome: string; periodicidade: string };
}
interface Pagina<T> { content: T[]; totalPages: number }

export default function PeriodSelectionScreen() {
    const { colors } = useAppTheme();
    const params = useLocalSearchParams<{ cursoId?: string | string[]; cursoNome?: string | string[] }>();
    const cursoId = Number(Array.isArray(params.cursoId) ? params.cursoId[0] : params.cursoId);
    const cursoNome = Array.isArray(params.cursoNome) ? params.cursoNome[0] : params.cursoNome;
    const cursoValido = Number.isSafeInteger(cursoId) && cursoId > 0;
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [erroSelecao, setErroSelecao] = useState<string | null>(null);
    const [salvandoId, setSalvandoId] = useState<number | null>(null);
    const [tentativa, setTentativa] = useState(0);
    const salvando = useRef(false);

    useFocusEffect(useCallback(() => {
        const controller = new AbortController();
        setTurmas([]);
        setErro(null);
        setErroSelecao(null);
        setCarregando(true);
        async function carregar() {
            try {
                if (!cursoValido) throw new Error("Selecione um curso antes de escolher sua turma.");
                const registros: Turma[] = [];
                let pagina = 0;
                let totalPaginas = 1;
                do {
                    const response = await fetch(`${API_URL}/turmas?curso=${cursoId}&page=${pagina}&size=100`, { signal: controller.signal });
                    if (!response.ok) throw new Error(`Não foi possível carregar as turmas (HTTP ${response.status}).`);
                    const dados: Pagina<Turma> = await response.json();
                    registros.push(...dados.content);
                    totalPaginas = dados.totalPages;
                    pagina++;
                } while (pagina < totalPaginas);
                if (controller.signal.aborted) return;
                setTurmas(registros.filter((t) => t.curso.id === cursoId)
                    .sort((a, b) => a.periodo - b.periodo || b.ano - a.ano || a.codigo.localeCompare(b.codigo)));
            } catch (error) {
                if (!controller.signal.aborted) setErro(error instanceof Error ? error.message : "Não foi possível carregar as turmas. Tente novamente.");
            } finally {
                if (!controller.signal.aborted) setCarregando(false);
            }
        }
        void carregar();
        return () => controller.abort();
    }, [cursoId, cursoValido, tentativa]));

    async function selecionarTurma(turma: Turma) {
        if (salvando.current) return;
        salvando.current = true;
        setSalvandoId(turma.id);
        setErroSelecao(null);
        try {
            // Curso e turma sao salvos juntos para evitar uma selecao parcial.
            await AsyncStorage.setItem("gini:selecaoAcademica", JSON.stringify({
                cursoId: turma.curso.id, cursoNome: turma.curso.nome,
                turmaId: turma.id, turmaCodigo: turma.codigo, periodo: turma.periodo, ano: turma.ano,
            }));
            router.replace({ pathname: "/home", params: {
                cursoId: String(turma.curso.id), turmaId: String(turma.id),
                periodo: String(turma.periodo), ano: String(turma.ano),
            } });
        } catch {
            setErroSelecao("Não foi possível salvar sua escolha. Tente novamente.");
        } finally {
            salvando.current = false;
            setSalvandoId(null);
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
          <Button
            className="btn w-26 justify-center align-center"
            variant="secondary"
            size="sm"
            onPress={() => router.back()}
          >
            <View className="flex-row gap-1 items-center">
              <LucideChevronLeft size={24} color={colors.text} />
              <Text className="text-primary m-0">Voltar</Text>
            </View>
          </Button>
                <View style={{ paddingVertical: 36, gap: 12 }}>
                    <Text className="text-center" variant="heading">Escolha sua turma</Text>
                    {cursoNome && <Text className="text-center" style={{ color: colors.accent }}>{cursoNome}</Text>}
                    <Text className="text-center" variant="body" style={{ color: colors.textMuted }}>Selecione a turma que você está cursando agora.</Text>
                </View>
                {carregando ? (
                    <View style={{ alignItems: "center", padding: 24, gap: 12 }}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={{ color: colors.textMuted }}>Carregando turmas...</Text>
                    </View>
                ) : erro ? (
                    <View style={{ gap: 16 }}>
                        <Text className="text-center" accessibilityRole="alert" style={{ color: colors.danger }}>{erro}</Text>
                        {cursoValido && <Button variant="outline" onPress={() => setTentativa((v) => v + 1)}>Tentar novamente</Button>}
                    </View>
                ) : turmas.length === 0 ? (
                    <Text className="text-center" style={{ color: colors.textMuted }}>Nenhuma turma disponível para este curso. Volte e escolha outro curso.</Text>
                ) : (
                    <View style={{ gap: 12 }}>
                        {erroSelecao && <Text accessibilityRole="alert" style={{ color: colors.danger }}>{erroSelecao}</Text>}
                        {turmas.map((turma) => (
                            <Pressable
                                key={turma.id}
                                accessibilityRole="button"
                                accessibilityLabel={`${turma.periodo}º período, turma ${turma.codigo}, ano letivo ${turma.ano}`}
                                accessibilityState={{ disabled: salvandoId !== null, busy: salvandoId === turma.id }}
                                disabled={salvandoId !== null}
                                onPress={() => void selecionarTurma(turma)}
                                style={({ pressed }) => ({
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    padding: 16,
                                    opacity: salvandoId !== null && salvandoId !== turma.id ? 0.5 : 1,
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                })}
                            >
                                <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: colors.text }}>
                                    {`${turma.periodo}º ${turma.curso.periodicidade?.toLowerCase() === "anual" ? "ano" : turma.curso.periodicidade?.toLowerCase() === "semestral" ? "semestre" : "período"}`}
                                </Text>
                                <Text style={{ fontSize: 13, marginBottom: 4, color: colors.textMuted }}>
                                    Turma: {turma.codigo} ·  Ano letivo: {turma.ano}
                                </Text>
                              
                                {salvandoId === turma.id && <ActivityIndicator color={colors.accent} style={{ marginTop: 8 }} />}
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
