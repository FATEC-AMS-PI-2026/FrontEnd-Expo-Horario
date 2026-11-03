import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LucideChevronLeft } from "lucide-react-native";
import { Button, Text } from "../../components";
import { API_URL } from "../../services/api";
import { useAppTheme } from "../../theme/ThemeContext";

interface Curso {
    id: number;
    nome: string;
    periodicidade: string;
    duracao: number;
}

interface Turma {
    id: number;
    codigo: string;
    periodo: number;
    ano: number;
    curso: { id: number };
}

interface Pagina<T> {
    content: T[];
    totalPages: number;
}

async function buscarPaginas<T>(path: string, signal: AbortSignal): Promise<T[]> {
    const registros: T[] = [];
    let pagina = 0;
    let totalPaginas = 1;

    do {
        const separador = path.includes("?") ? "&" : "?";
        const response = await fetch(
            `${API_URL}${path}${separador}page=${pagina}&size=100`,
            { signal },
        );
        if (!response.ok) {
            throw new Error(`Não foi possível carregar as turmas (HTTP ${response.status}).`);
        }

        const resultado: Pagina<T> = await response.json();
        registros.push(...resultado.content);
        totalPaginas = resultado.totalPages;
        pagina++;
    } while (pagina < totalPaginas);

    return registros;
}

function nomePeriodo(periodicidade: string, periodo: number) {
    const tipo = periodicidade.toLocaleLowerCase("pt-BR");
    const unidade = tipo.includes("anual") ? "ano" : tipo.includes("semestral") ? "semestre" : "período";
    return `${periodo}º ${unidade}`;
}

export default function PeriodSelectionScreen() {
    const { colors, darkMode } = useAppTheme();
    const params = useLocalSearchParams<{
        cursoId?: string | string[];
        cursoNome?: string | string[];
    }>();
    const cursoIdParam = Array.isArray(params.cursoId) ? params.cursoId[0] : params.cursoId;
    const cursoNomeParam = Array.isArray(params.cursoNome) ? params.cursoNome[0] : params.cursoNome;
    const cursoId = Number(cursoIdParam);
    const cursoValido = Number.isSafeInteger(cursoId) && cursoId > 0;

    const [curso, setCurso] = useState<Curso | null>(null);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [tentativa, setTentativa] = useState(0);
    const [salvandoId, setSalvandoId] = useState<number | null>(null);

    useFocusEffect(
        useCallback(() => {
            const controller = new AbortController();

            async function carregar() {
                setCarregando(true);
                setErro(null);

                try {
                    if (!cursoValido) {
                        throw new Error("Curso não identificado. Volte e selecione um curso.");
                    }

                    const cursoResponse = await fetch(`${API_URL}/cursos/${cursoId}`, {
                        signal: controller.signal,
                    });
                    if (!cursoResponse.ok) {
                        throw new Error(`Não foi possível carregar o curso (HTTP ${cursoResponse.status}).`);
                    }

                    const dadosCurso: Curso = await cursoResponse.json();
                    const todasTurmas = await buscarPaginas<Turma>(
                        `/turmas?curso=${cursoId}`,
                        controller.signal,
                    );

                    if (controller.signal.aborted) return;

                    setCurso(dadosCurso);
                    setTurmas(
                        todasTurmas
                            .filter((turma) => turma.curso.id === cursoId)
                            .sort((a, b) =>
                                a.periodo - b.periodo ||
                                b.ano - a.ano ||
                                a.codigo.localeCompare(b.codigo),
                            ),
                    );
                } catch (error) {
                    if (controller.signal.aborted) return;
                    console.error("Erro ao carregar períodos do curso:", error, { tentativa });
                    setErro(error instanceof Error ? error.message : "Não foi possível carregar as turmas.");
                } finally {
                    if (!controller.signal.aborted) setCarregando(false);
                }
            }

            void carregar();
            return () => controller.abort();
        }, [cursoId, cursoValido, tentativa]),
    );

    async function selecionarTurma(turma: Turma) {
        setSalvandoId(turma.id);
        setErro(null);

        try {
            await AsyncStorage.setItem("gini:selecaoAcademica", JSON.stringify({
                cursoId,
                cursoNome: curso?.nome ?? cursoNomeParam ?? "",
                periodicidade: curso?.periodicidade ?? "",
                turmaId: turma.id,
                turmaCodigo: turma.codigo,
                periodo: turma.periodo,
                ano: turma.ano,
            }));

            router.replace("/home");
        } catch (error) {
            console.error("Erro ao salvar turma selecionada:", error);
            setErro("Não foi possível salvar sua escolha. Tente novamente.");
        } finally {
            setSalvandoId(null);
        }
    }

    const periodicidade = curso?.periodicidade ?? "";

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: darkMode ? colors.backgroundAlt : colors.background }}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 28,
                    paddingTop: 22,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Button
                    variant="secondary"
                    size="sm"
                    style={{ alignSelf: "flex-start" }}
                    onPress={() => router.back()}
                >
                    <View className="flex-row items-center gap-1">
                        <LucideChevronLeft size={20} color={colors.text} />
                        <Text style={{ color: colors.text }}>Voltar</Text>
                    </View>
                </Button>

                <View className="items-center mt-12 mb-10">
                    <Text
                        variant="heading"
                        className="text-center"
                        style={{ color: colors.text, fontSize: 28 }}
                    >
                        Escolha sua turma
                    </Text>
                    <Text
                        variant="body"
                        className="text-center mt-4"
                        style={{ color: colors.accent, fontSize: 18 }}
                    >
                        {curso?.nome ?? cursoNomeParam ?? "Carregando curso..."}
                    </Text>
                    <Text
                        variant="body"
                        className="text-center mt-4"
                        style={{ color: colors.textMuted, fontSize: 18, lineHeight: 26 }}
                    >
                        Selecione a turma que você está cursando agora.
                    </Text>
                </View>

                {carregando ? (
                    <View className="items-center py-8">
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text className="mt-4" style={{ color: colors.textMuted }}>
                            Carregando turmas...
                        </Text>
                    </View>
                ) : erro ? (
                    <View className="items-center gap-4">
                        <Text accessibilityRole="alert" className="text-center" style={{ color: colors.danger }}>
                            {erro}
                        </Text>
                        <Button variant="outline" onPress={() => setTentativa((valor) => valor + 1)}>
                            Tentar novamente
                        </Button>
                    </View>
                ) : turmas.length === 0 ? (
                    <Text className="text-center" style={{ color: colors.textMuted }}>
                        Este curso ainda não possui turmas disponíveis.
                    </Text>
                ) : (
                    <View className="gap-3">
                        {turmas.map((turma) => (
                            <Pressable
                                key={turma.id}
                                accessibilityRole="button"
                                accessibilityLabel={`${nomePeriodo(periodicidade, turma.periodo)}, turma ${turma.codigo}, ano letivo ${turma.ano}`}
                                accessibilityState={{ disabled: salvandoId !== null }}
                                disabled={salvandoId !== null}
                                onPress={() => void selecionarTurma(turma)}
                                style={({ pressed }) => ({
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 18,
                                    opacity: salvandoId !== null && salvandoId !== turma.id ? 0.55 : pressed ? 0.8 : 1,
                                })}
                            >
                                <Text
                                    variant="label"
                                    className="font-semibold"
                                    style={{ color: colors.text, fontSize: 17, marginBottom: 8 }}
                                >
                                    {nomePeriodo(periodicidade, turma.periodo)}
                                </Text>
                                <Text variant="body" style={{ color: colors.textMuted, fontSize: 15 }}>
                                    Turma: {turma.codigo} · Ano letivo: {turma.ano}
                                </Text>
                                {salvandoId === turma.id && (
                                    <ActivityIndicator
                                        className="mt-3 self-start"
                                        size="small"
                                        color={colors.accent}
                                    />
                                )}
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
