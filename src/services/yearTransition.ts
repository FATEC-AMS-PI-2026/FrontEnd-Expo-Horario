
import AsyncStorage from "@react-native-async-storage/async-storage";

const SELECTION_KEY = "gini:selecaoAcademica";
const DISMISSED_YEAR_KEY = "gini:yearTransitionDismissed";

// Dados da turma sao ficticios, so pra teste msm
export interface Turma {
    id: number;
    codigo: string;
    periodo: number;
    ano: number;
    curso: { id: number };
}

export interface AcademicSelection {
    cursoId: number;
    cursoNome: string;
    periodicidade: string;
    turmaId: number;
    turmaCodigo: string;
    periodo: number;
    ano: number;
}

export interface YearTransitionResult {
    shouldShow: boolean;
    current: AcademicSelection | null;
    nextTurma: Turma | null;
}

export async function carregarSelecaoAcademica(): Promise<AcademicSelection | null> {
    const salvo = await AsyncStorage.getItem(SELECTION_KEY);

    if (!salvo) return null;

    try {
        const dados = JSON.parse(salvo) as AcademicSelection;

        if (
            !Number.isSafeInteger(dados.cursoId) ||
            !Number.isSafeInteger(dados.turmaId) ||
            !Number.isSafeInteger(dados.periodo) ||
            !Number.isSafeInteger(dados.ano)
        ) {
            return null;
        }

        return dados;
    } catch {
        return null;
    }
}

// Verifica se o aluno já recusou a sugestão no ano atual.
export async function transicaoRecusadaEsteAno(): Promise<boolean> {
    const anoAtual = new Date().getFullYear().toString();
    const anoRecusado = await AsyncStorage.getItem(DISMISSED_YEAR_KEY);

    return anoRecusado === anoAtual;
}

// Registra a recusa até o próximo ano do calendário.
export async function registrarRecusaTransicao(): Promise<void> {
    const anoAtual = new Date().getFullYear().toString();

    await AsyncStorage.setItem(DISMISSED_YEAR_KEY, anoAtual);
}

export async function limparRecusaTransicao(): Promise<void> {
    await AsyncStorage.removeItem(DISMISSED_YEAR_KEY);
}

// Gera uma turma ficticia
export async function buscarProximaTurma(
    atual: AcademicSelection,
    signal: AbortSignal,
): Promise<Turma | null> {
    if (signal.aborted) return null;

    const proximoPeriodo = atual.periodo + 1;

    return {
        id: atual.turmaId + 1,
        codigo: `${atual.turmaCodigo}-P${proximoPeriodo}`,
        periodo: proximoPeriodo,
        ano: new Date().getFullYear(),
        curso: {
            id: atual.cursoId,
        },
    };
}

// Atualiza a seleção acadêmica depois que o aluno aceita a troca.
export async function confirmarTransicaoAcademica(
    atual: AcademicSelection,
    proxima: Turma,
): Promise<void> {
    const novaSelecao: AcademicSelection = {
        ...atual,
        turmaId: proxima.id,
        turmaCodigo: proxima.codigo,
        periodo: proxima.periodo,
        ano: proxima.ano,
    };

    await AsyncStorage.setItem(
        SELECTION_KEY,
        JSON.stringify(novaSelecao),
    );

    // Uma nova seleção não deve herdar uma recusa anterior.
    await limparRecusaTransicao();
}


export async function verificarTransicaoAcademica(
    signal: AbortSignal,
): Promise<YearTransitionResult> {
    const atual = await carregarSelecaoAcademica();

    if (!atual || signal.aborted) {
        return {
            shouldShow: false,
            current: atual,
            nextTurma: null,
        };
    }

    // Evita mostrar novamente a sugestão depois de uma recusa no mesmo ano.
    const recusada = await transicaoRecusadaEsteAno();

    if (recusada || signal.aborted) {
        return {
            shouldShow: false,
            current: atual,
            nextTurma: null,
        };
    }

    const anoAtual = new Date().getFullYear();

    // Só sugere a troca quando o ano letivo salvo é anterior ao calendário atual.
    if (anoAtual <= atual.ano) {
        return {
            shouldShow: false,
            current: atual,
            nextTurma: null,
        };
    }

    const proxima = await buscarProximaTurma(atual, signal);

    if (!proxima || signal.aborted) {
        return {
            shouldShow: false,
            current: atual,
            nextTurma: null,
        };
    }

    return {
        shouldShow: true,
        current: atual,
        nextTurma: proxima,
    };
}
