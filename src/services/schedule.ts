import { API_URL } from "./api";

export interface AcademicSelection {
    cursoId: number;
    turmaId: number;
}

export interface ScheduleEntry {
    id: string;
    subjectId?: number;
    slotId?: number;
    sourceAllocationId?: number;
    sourceTurmaId?: number;
    sourceTurmaCode?: string;
    offeringId?: string;
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
    turma: { id: number; codigo: string; periodo: number; ano: number; curso: { id: number; nome: string; periodicidade: string } };
    disciplina: { id: number; nome: string; cor: string | null };
    professor: { nome: string } | null;
    sala: { codigo: string } | null;
    blocoHorario: { id: number; horaInicio: string; horaFim: string };
    quadroHorario: {
        id: number;
        status: string;
        periodoAtividadeQuadro: { status: string; dataInicio: string; dataFim: string } | null;
    };
}

const WEEKDAYS = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

function isCurrent(allocation: Allocation) {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const period = allocation.quadroHorario.periodoAtividadeQuadro;
    return allocation.quadroHorario.status === "ATIVO" && period?.status === "ATIVO" &&
        period.dataInicio <= today && period.dataFim >= today && WEEKDAYS.includes(allocation.diaSemana) &&
        allocation.blocoHorario.horaInicio < allocation.blocoHorario.horaFim;
}

function toEntry(allocation: Allocation): ScheduleEntry {
    return {
        id: `backend-${allocation.id}`,
        sourceAllocationId: allocation.id,
        sourceTurmaId: allocation.turma.id,
        sourceTurmaCode: allocation.turma.codigo,
        offeringId: `${allocation.quadroHorario.id}:${allocation.turma.id}:${allocation.disciplina.id}`,
        subjectId: allocation.disciplina.id,
        slotId: allocation.blocoHorario.id,
        day: WEEKDAYS.indexOf(allocation.diaSemana),
        subject: allocation.disciplina.nome,
        teacher: allocation.professor?.nome ?? "Professor não informado",
        location: allocation.sala?.codigo ?? "Sala não informada",
        startTime: `${allocation.blocoHorario.horaInicio.slice(0, 5)}h`,
        endTime: `${allocation.blocoHorario.horaFim.slice(0, 5)}h`,
        accentColor: allocation.disciplina.cor || "#005C6E",
    };
}

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
            isCurrent(allocation),
        )
        .sort((a, b) =>
            WEEKDAYS.indexOf(a.diaSemana) - WEEKDAYS.indexOf(b.diaSemana) ||
            a.blocoHorario.horaInicio.localeCompare(b.blocoHorario.horaInicio) || a.id - b.id,
        )
        .map(toEntry);

    return { entries, label: `${turma.curso.nome} · Turma ${turma.codigo}` };
}

export interface ScheduleOffering {
    id: number;
    key: string;
    subject: string;
    periodo: number;
    periodicidade: string;
    turmaId: number;
    turmaCodigo: string;
    ano: number;
    entries: ScheduleEntry[];
}

export interface ScheduleSlot {
    id: number;
    horaInicio: string;
    horaFim: string;
}

async function loadPages<T>(path: string, signal: AbortSignal): Promise<T[]> {
    const entries: T[] = [];
    let page = 0;
    let totalPages = 1;
    do {
        const response = await fetch(`${API_URL}${path}${path.includes("?") ? "&" : "?"}page=${page}&size=100`, { signal });
        if (!response.ok) throw new ScheduleError(response.status);
        const result: { content: T[]; totalPages: number } = await response.json();
        entries.push(...result.content);
        totalPages = result.totalPages;
        page++;
    } while (page < totalPages);
    return entries;
}

export async function loadScheduleOptions(selection: AcademicSelection, signal: AbortSignal) {
    const [turmas, slots] = await Promise.all([
        loadPages<Allocation["turma"]>(`/turmas?curso=${selection.cursoId}`, signal),
        loadPages<ScheduleSlot>("/bloco-horarios", signal),
    ]);
    const allocations = (await Promise.all(turmas.filter((turma) => turma.curso.id === selection.cursoId)
        .map((turma) => loadPages<Allocation>(`/alocacoes?turma=${turma.id}`, signal)
            .then((items) => items.filter((item) => item.turma.id === turma.id))))).flat();
    const groups = new Map<string, Allocation[]>();
    for (const allocation of new Map(allocations.filter((item) => item.turma.curso.id === selection.cursoId && isCurrent(item))
        .map((item) => [item.id, item])).values()) {
        const key = `${allocation.quadroHorario.id}:${allocation.turma.id}:${allocation.disciplina.id}`;
        const group = groups.get(key) ?? [];
        group.push(allocation);
        groups.set(key, group);
    }

    const offerings: ScheduleOffering[] = Array.from(groups, ([key, group]) => {
        const first = group[0];
        return {
            id: first.disciplina.id, key, subject: first.disciplina.nome,
            periodo: first.turma.periodo, periodicidade: first.turma.curso.periodicidade,
            turmaId: first.turma.id, turmaCodigo: first.turma.codigo, ano: first.turma.ano,
            entries: group.sort((a, b) => WEEKDAYS.indexOf(a.diaSemana) - WEEKDAYS.indexOf(b.diaSemana) ||
                a.blocoHorario.horaInicio.localeCompare(b.blocoHorario.horaInicio)).map(toEntry),
            complete: group.every((item) => Boolean(item.professor?.nome && item.sala?.codigo)),
        };
    }).filter((offering) => offering.complete);
    return {
        offerings: offerings.sort((a, b) => a.periodo - b.periodo || a.subject.localeCompare(b.subject, "pt-BR") || a.turmaCodigo.localeCompare(b.turmaCodigo)),
        // Alguns dados antigos possuem blocos com inicio igual ao fim.
        slots: slots.filter((slot) => slot.horaInicio < slot.horaFim)
            .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
    };
}
