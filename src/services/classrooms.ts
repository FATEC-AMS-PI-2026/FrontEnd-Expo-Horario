import { API_URL } from "./api";

export interface Classroom {
    id: number;
    codigo: string;
    capacidade: number;
    tipoSala: { id: number; nome: string } | null;
}

export interface ClassroomResource {
    id: number;
    recurso: { id: number; nome: string };
    quantidade: number;
}

export interface ClassroomAllocation {
    id: number;
    diaSemana: string;
    turma: { id: number; codigo: string };
    disciplina: { id: number; nome: string; cor: string | null };
    professor: { id: number; nome: string } | null;
    sala: { id: number; codigo: string };
    blocoHorario: { id: number; horaInicio: string; horaFim: string };
    quadroHorario: {
        status: string;
        periodoAtividadeQuadro: {
            status: string;
            dataInicio: string;
            dataFim: string;
        } | null;
    };
}

interface PageResponse<T> {
    content: T[];
    totalPages: number;
}

export interface ClassroomDetails {
    classroom: Classroom;
    resources: ClassroomResource[];
    allocations: ClassroomAllocation[];
}

const WEEKDAYS = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

async function loadPages<T>(path: string, signal: AbortSignal): Promise<T[]> {
    const items: T[] = [];
    let page = 0;
    let totalPages = 1;

    do {
        const separator = path.includes("?") ? "&" : "?";
        const response = await fetch(
            `${API_URL}${path}${separator}page=${page}&size=100`,
            { signal },
        );
        if (!response.ok) {
            throw new Error(`Não foi possível carregar os dados (HTTP ${response.status}).`);
        }

        const result: PageResponse<T> = await response.json();
        items.push(...result.content);
        totalPages = result.totalPages;
        page++;
    } while (page < totalPages);

    return items;
}

function isCurrentAllocation(allocation: ClassroomAllocation, now = new Date()) {
    if (allocation.quadroHorario.status !== "ATIVO") return false;

    const period = allocation.quadroHorario.periodoAtividadeQuadro;
    if (!period) return true;

    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    return period.status === "ATIVO" &&
        period.dataInicio <= today &&
        period.dataFim >= today;
}

function timeInSeconds(time: string) {
    const [hours, minutes, seconds = 0] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function isAllocationInUse(allocation: ClassroomAllocation, now: Date) {
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    return allocation.diaSemana === WEEKDAYS[now.getDay()] &&
        isCurrentAllocation(allocation, now) &&
        currentTime >= timeInSeconds(allocation.blocoHorario.horaInicio) &&
        currentTime < timeInSeconds(allocation.blocoHorario.horaFim);
}

export async function loadClassrooms(signal: AbortSignal): Promise<Classroom[]> {
    const classrooms = await loadPages<Classroom>("/salas", signal);
    return classrooms.sort((a, b) => a.codigo.localeCompare(b.codigo));
}

export async function loadOccupiedClassroomIds(signal: AbortSignal): Promise<Set<number>> {
    const now = new Date();
    const day = WEEKDAYS[now.getDay()];
    const allocations = await loadPages<ClassroomAllocation>(
        `/alocacoes?dia_semana=${day}`,
        signal,
    );

    return new Set(
        allocations
            .filter((allocation) => isAllocationInUse(allocation, now))
            .map((allocation) => allocation.sala.id),
    );
}

export async function loadClassroomDetails(
    classroomId: number,
    signal: AbortSignal,
    includeResources = true,
): Promise<ClassroomDetails> {
    const roomResponse = await fetch(`${API_URL}/salas/${classroomId}`, { signal });
    if (!roomResponse.ok) {
        throw new Error(`Não foi possível carregar a sala (HTTP ${roomResponse.status}).`);
    }

    const [classroom, resources, allocations] = await Promise.all([
        roomResponse.json() as Promise<Classroom>,
        includeResources
            ? loadPages<ClassroomResource>(`/recurso-sala?salaId=${classroomId}`, signal)
            : Promise.resolve([] as ClassroomResource[]),
        loadPages<ClassroomAllocation>(`/alocacoes?sala=${classroomId}`, signal),
    ]);

    const weekdayOrder = (day: string) => {
        const order = WEEKDAYS.indexOf(day);
        return order === -1 ? WEEKDAYS.length : order;
    };

    return {
        classroom,
        resources: resources.sort((a, b) => a.recurso.nome.localeCompare(b.recurso.nome)),
        allocations: allocations
            .filter((allocation) => isCurrentAllocation(allocation))
            .sort((a, b) =>
                weekdayOrder(a.diaSemana) - weekdayOrder(b.diaSemana) ||
                a.blocoHorario.horaInicio.localeCompare(b.blocoHorario.horaInicio) ||
                a.id - b.id,
            ),
    };
}
