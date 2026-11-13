import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    View,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";

import "../../../global.css";

import { ScheduleItem, Text } from "../../components";
import { API_URL } from "../../services/api";
import { useAppTheme } from "../../theme/ThemeContext";

interface ProfessorApi {
    id: number;
    nome: string;
}

interface Alocacao {
    id: number;
    diaSemana: string;
    professor: ProfessorApi;
    disciplina: {
        id: number;
        nome: string;
    };
    turma: {
        codigo: string;
        curso: {
            nome: string;
        } | null;
    };
    sala: {
        codigo: string;
    } | null;
    blocoHorario: {
        horaInicio: string;
        horaFim: string;
    };
    quadroHorario: {
        status: string;
        periodoAtividadeQuadro: {
            status: string;
            dataInicio: string;
            dataFim: string;
        } | null;
    };
}

interface Pagina<T> {
    content: T[];
    totalPages: number;
}

const DIAS = [
    { valor: "DOMINGO", nome: "Domingo" },
    { valor: "SEGUNDA", nome: "Segunda-feira" },
    { valor: "TERCA", nome: "Terça-feira" },
    { valor: "QUARTA", nome: "Quarta-feira" },
    { valor: "QUINTA", nome: "Quinta-feira" },
    { valor: "SEXTA", nome: "Sexta-feira" },
    { valor: "SABADO", nome: "Sábado" },
];

// Usa a data local, evitando a mudança de dia causada pelo UTC.
function dataLocal(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarHorario(horario: string) {
    return horario.slice(0, 5);
}

async function buscarAulas(
    professorId: number,
    signal: AbortSignal
): Promise<Alocacao[]> {
    const aulas: Alocacao[] = [];
    let paginaAtual = 0;
    let totalPaginas = 1;

    do {
        const response = await fetch(
            `${API_URL}/alocacoes?usuario=${professorId}` +
            `&page=${paginaAtual}&size=100`,
            { signal }
        );

        if (!response.ok) {
            throw new Error(`Erro ao carregar horários: HTTP ${response.status}`);
        }

        const pagina: Pagina<Alocacao> = await response.json();

        aulas.push(...pagina.content);
        totalPaginas = pagina.totalPages;
        paginaAtual++;
    } while (paginaAtual < totalPaginas);

    return aulas;
}

export default function ProfessorsDetalhe() {
    const { colors } = useAppTheme();

    const { id, nome, materias } = useLocalSearchParams<{
        id?: string;
        nome?: string;
        materias?: string;
    }>();

    const professorId = Number(id);

    const [professor, setProfessor] = useState<ProfessorApi | null>(null);
    const [aulas, setAulas] = useState<Alocacao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [tentativa, setTentativa] = useState(0);
    const [agora, setAgora] = useState(() => new Date());
    const [diaSelecionado, setDiaSelecionado] = useState(() => new Date().getDay());

    useFocusEffect(useCallback(() => {
        setAgora(new Date());
        const relogio = setInterval(() => setAgora(new Date()), 1000);
        return () => clearInterval(relogio);
    }, []));

    const aulasDoDia = aulas.filter(
        (aula) => aula.diaSemana === DIAS[diaSelecionado].valor
    );

    function estaEmAndamento(aula: Alocacao) {
        const segundos = (horario: string) => {
            const [horas, minutos, segundos = 0] = horario.split(":").map(Number);
            return horas * 3600 + minutos * 60 + segundos;
        };
        const horarioAtual = agora.getHours() * 3600 + agora.getMinutes() * 60 + agora.getSeconds();
        const periodo = aula.quadroHorario.periodoAtividadeQuadro;
        const hoje = dataLocal(agora);
        return diaSelecionado === agora.getDay() &&
            aula.diaSemana === DIAS[agora.getDay()].valor &&
            periodo?.status === "ATIVO" &&
            periodo.dataInicio <= hoje && periodo.dataFim >= hoje &&
            horarioAtual >= segundos(aula.blocoHorario.horaInicio) &&
            horarioAtual < segundos(aula.blocoHorario.horaFim);
    }

    // Atualiza os dados sempre que a tela recebe foco.
    // Também cancela requisições quando o usuário sai dela.
    useFocusEffect(
        useCallback(() => {
            const controller = new AbortController();

            async function carregar() {
                setIsLoading(true);
                setErro(null);
                setAulas([]);
                setProfessor(null);

                try {
                    if (!Number.isInteger(professorId) || professorId <= 0) {
                        throw new Error(
                            "Professor não identificado. Volte à lista e selecione novamente."
                        );
                    }

                    const [response, alocacoes] = await Promise.all([
                        fetch(`${API_URL}/professores/${professorId}`, {
                            signal: controller.signal,
                        }),
                        buscarAulas(professorId, controller.signal),
                    ]);

                    if (!response.ok) {
                        throw new Error(
                            `Erro ao carregar professor: HTTP ${response.status}`
                        );
                    }

                    const dadosProfessor: ProfessorApi = await response.json();

                    // Carrega a semana inteira para trocar de dia sem nova requisicao.
                    const aulasDaSemana = alocacoes
                        .filter(
                            (aula) =>
                                aula.professor.id === professorId &&
                                aula.quadroHorario.status === "ATIVO"
                        )
                        .sort((a, b) =>
                            a.blocoHorario.horaInicio.localeCompare(
                                b.blocoHorario.horaInicio
                            )
                        );

                    if (controller.signal.aborted) return;

                    setProfessor(dadosProfessor);
                    setAulas(aulasDaSemana);
                } catch (error) {
                    if (controller.signal.aborted) return;

                    console.error("Erro na tela de detalhes:", error);

                    setErro(
                        error instanceof Error
                            ? error.message
                            : "Não foi possível carregar os horários."
                    );
                } finally {
                    if (!controller.signal.aborted) {
                        setIsLoading(false);
                    }
                }
            }

            void carregar();

            return () => controller.abort();
        }, [professorId, tentativa])
    );

    return (
        <View
            className="flex-1"
            style={{ backgroundColor: colors.background }}
        >
            <ScrollView
                className="flex-1 px-4"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="h-[48px] flex-row items-center justify-center">
                    <Pressable
                        className="absolute left-0"
                        accessibilityRole="button"
                        accessibilityLabel="Voltar para professores"
                        hitSlop={12}
                        onPress={() => router.navigate("/(tabs)/professors")}
                    >
                        <ArrowLeft size={22} color={colors.accent} />
                    </Pressable>

                    <Text className="text-[14px] font-medium">
                        Professores
                    </Text>
                </View>

                <View className="flex-row items-center mt-2 mb-6">
                    <Image
                        source={require("../../../assets/images/professor.png")}
                        style={{ width: 59, height: 59, borderRadius: 8 }}
                    />

                    <View className="ml-3 flex-1">
                        <Text
                            className="text-xs"
                            style={{ color: colors.textMuted }}
                        >
                            Professor
                        </Text>

                        <Text className="text-lg font-bold">
                            {professor?.nome ?? nome ?? "Professor"}
                        </Text>

                        <Text
                            className="text-xs mt-1"
                            style={{ color: colors.textMuted }}
                        >
                            {materias ?? ""}
                        </Text>
                    </View>
                </View>

                <View className="flex-row p-1 gap-1 w-full mb-4">
                    {[1, 2, 3, 4, 5, 6].map((dia) => (
                        <Pressable
                            key={dia}
                            accessibilityRole="button"
                            accessibilityLabel={DIAS[dia].nome}
                            accessibilityState={{ selected: diaSelecionado === dia }}
                            onPress={() => setDiaSelecionado(dia)}
                            className="flex-1 p-2 border rounded-md items-center"
                            style={{
                                borderColor: colors.border,
                                backgroundColor: diaSelecionado === dia ? colors.accent : colors.surface,
                            }}
                        >
                            <Text variant="label" style={{ color: diaSelecionado === dia ? colors.background : colors.text }}>
                                {DIAS[dia].nome.charAt(0)}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-sm font-semibold">
                        {DIAS[diaSelecionado].nome}{diaSelecionado === agora.getDay() ? " · Hoje" : ""}
                    </Text>
                    {diaSelecionado !== agora.getDay() && (
                        <Pressable accessibilityRole="button" onPress={() => setDiaSelecionado(agora.getDay())} style={{ padding: 8 }}>
                            <Text style={{ color: colors.accent }}>Voltar para hoje</Text>
                        </Pressable>
                    )}
                </View>

                {isLoading ? (
                    <View className="items-center py-10">
                        <ActivityIndicator
                            size="large"
                            color={colors.accent}
                        />

                        <Text
                            className="mt-3"
                            style={{ color: colors.textMuted }}
                        >
                            Carregando horários...
                        </Text>
                    </View>
                ) : erro ? (
                    <View className="items-center py-8">
                        <Text
                            className="text-center"
                            style={{ color: colors.textMuted }}
                        >
                            {erro}
                        </Text>

                        <Pressable
                            accessibilityRole="button"
                            className="mt-4 rounded-lg px-4 py-3"
                            style={{ backgroundColor: colors.accent }}
                            onPress={() => setTentativa((valor) => valor + 1)}
                        >
                            <Text style={{ color: colors.background }}>
                                Tentar novamente
                            </Text>
                        </Pressable>
                    </View>
                ) : aulasDoDia.length === 0 ? (
                    <Text
                        className="text-center py-8"
                        style={{ color: colors.textMuted }}
                    >
                        Nenhuma aula prevista para {DIAS[diaSelecionado].nome.toLowerCase()}.
                    </Text>
                ) : (
                    aulasDoDia.map((aula) => (
                        <ScheduleItem
                            key={aula.id}
                            startTime={formatarHorario(aula.blocoHorario.horaInicio)}
                            endTime={formatarHorario(aula.blocoHorario.horaFim)}
                            subject={aula.disciplina.nome}
                            teacher=""
                            location={aula.sala?.codigo ?? "Não informada"}
                            isCurrent={estaEmAndamento(aula)}
                            hideMore
                        >
                            <Text variant="caption" className="mt-1" style={{ color: colors.textMuted }}>
                                {aula.turma.curso?.nome ?? "Curso não informado"}
                            </Text>
                            <Text variant="caption" className="mt-1" style={{ color: colors.accent }}>
                                Turma: {aula.turma.codigo}
                            </Text>
                        </ScheduleItem>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
