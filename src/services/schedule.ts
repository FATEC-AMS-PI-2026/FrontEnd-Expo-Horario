import { API_URL } from "./api";

export interface AcademicSelection {
    cursoId: number;
    turmaId: number;
}

export interface ScheduleEntry {
    subject: string;
    teacher: string;
    location: string;
    startTime: string;
    endTime: string;
    accentColor: string;
    day: number;
    isInterval?: boolean;
    isEmpty?: boolean;
}

interface Allocation {
    id: number;
    diaSemana: string;
    turma: { id: number; codigo: string; curso: { id: number; nome: string } };
    disciplina: { nome: string; cor: string | null };
    professor: { nome: string } | null;
    sala: { codigo: string } | null;
    blocoHorario: { horaInicio: string; horaFim: string };
    quadroHorario: { status: string };
}

const WEEKDAYS = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

export class ScheduleError extends Error {
    constructor(public readonly code: string | number) {
        super(String(code));
    }
}

export function parseAcademicSelection(saved: string | null): AcademicSelection {
    let selection: unknown;
    try {
        selection = saved ? JSON.parse(saved) : null;
    } catch {
        throw new ScheduleError("SELECTION_REQUIRED");
    }
    if (
        !selection || typeof selection !== "object" ||
        !("cursoId" in selection) || !("turmaId" in selection) ||
        typeof selection.cursoId !== "number" || typeof selection.turmaId !== "number" ||
        !Number.isSafeInteger(selection.cursoId) || selection.cursoId <= 0 ||
        !Number.isSafeInteger(selection.turmaId) || selection.turmaId <= 0
    ) {
        throw new ScheduleError("SELECTION_REQUIRED");
    }
    return { cursoId: selection.cursoId, turmaId: selection.turmaId };
}

export async function loadSchedule(selection: AcademicSelection, signal: AbortSignal) {
    const allocations: Allocation[] = [];
    let page = 0;
    let totalPages = 1;

    // Confere o curso da turma antes de carregar suas alocacoes.
    const turmaResponse = await fetch(`${API_URL}/turmas/${selection.turmaId}`, { signal });
    if (!turmaResponse.ok) throw new ScheduleError(turmaResponse.status);
    const turma: Allocation["turma"] = await turmaResponse.json();
    if (turma.id !== selection.turmaId || turma.curso.id !== selection.cursoId) {
        throw new ScheduleError("SELECTION_REQUIRED");
    }

    do {
        const response = await fetch(
            `${API_URL}/alocacoes?turma=${selection.turmaId}&page=${page}&size=100`,
            { signal },
        );
        if (!response.ok) throw new ScheduleError(response.status);
        const result: { content: Allocation[]; totalPages: number } = await response.json();
        allocations.push(...result.content);
        totalPages = result.totalPages;
        page++;
    } while (page < totalPages);

    const entries: ScheduleEntry[] = allocations
        .filter((allocation) =>
            allocation.turma.id === selection.turmaId &&
            allocation.turma.curso.id === selection.cursoId &&
            allocation.quadroHorario.status === "ATIVO" &&
            WEEKDAYS.includes(allocation.diaSemana),
        )
        .sort((a, b) =>
            WEEKDAYS.indexOf(a.diaSemana) - WEEKDAYS.indexOf(b.diaSemana) ||
            a.blocoHorario.horaInicio.localeCompare(b.blocoHorario.horaInicio) || a.id - b.id,
        )
        .map((allocation) => ({
            day: WEEKDAYS.indexOf(allocation.diaSemana),
            subject: allocation.disciplina.nome,
            teacher: allocation.professor?.nome ?? "Professor não informado",
            location: allocation.sala?.codigo ?? "Sala não informada",
            startTime: `${allocation.blocoHorario.horaInicio.slice(0, 5)}h`,
            endTime: `${allocation.blocoHorario.horaFim.slice(0, 5)}h`,
            accentColor: allocation.disciplina.cor || "#005C6E",
        }));

    return { entries, label: `${turma.curso.nome} · Turma ${turma.codigo}` };
}
