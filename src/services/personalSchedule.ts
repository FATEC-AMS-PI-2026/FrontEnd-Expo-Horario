import type { AcademicSelection, ScheduleEntry, ScheduleOffering, ScheduleSlot } from "./schedule";

export function personalScheduleKey(selection: AcademicSelection) {
    return `gini:gradePessoal:${selection.cursoId}:${selection.turmaId}`;
}

export function emptyLesson(entry: ScheduleEntry): ScheduleEntry {
    return { ...entry, subjectId: undefined, subject: "Aula vazia", teacher: "", location: "", accentColor: "#B0BEC5", isEmpty: true };
}

function seconds(time: string) {
    const [hours, minutes, secs = 0] = time.replace(/h$/, "").split(":").map(Number);
    return hours * 3600 + minutes * 60 + secs;
}

export function overlaps(a: ScheduleEntry, b: ScheduleEntry) {
    return a.day === b.day && seconds(a.startTime) < seconds(b.endTime) && seconds(b.startTime) < seconds(a.endTime);
}

export function offeringConflicts(entries: ScheduleEntry[], offering: ScheduleOffering) {
    const conflicts = new Map<string, ScheduleEntry>();
    for (const next of offering.entries) {
        for (const entry of [...entries, ...offering.entries]) {
            if (!entry.isEmpty && entry.sourceAllocationId !== next.sourceAllocationId && overlaps(entry, next)) {
                conflicts.set(entry.id, entry);
            }
        }
    }
    return Array.from(conflicts.values());
}

export function addOffering(entries: ScheduleEntry[], offering: ScheduleOffering) {
    if (offeringConflicts(entries, offering).length) throw new Error("O horário da oferta está ocupado.");
    const additions = offering.entries
        .filter((next) => !entries.some((entry) => !entry.isEmpty && entry.sourceAllocationId === next.sourceAllocationId))
        .map((entry) => ({ ...entry, id: `personal-dp-${entry.sourceAllocationId}` }));
    const ids = new Set(additions.map((entry) => entry.id));
    return [...entries.filter((entry) => !ids.has(entry.id)), ...additions];
}

export function releaseAndAddOffering(entries: ScheduleEntry[], offering: ScheduleOffering) {
    const ids = new Set(offeringConflicts(entries, offering).map((entry) => entry.id));
    const cleared = entries.map((entry) => ids.has(entry.id) ? emptyLesson(entry) : entry);
    // Ainda valida conflitos internos da oferta antes de devolver qualquer alteracao.
    return addOffering(cleared, offering);
}

export function daySchedule(entries: ScheduleEntry[], slots: ScheduleSlot[], day: number) {
    const occupied = entries.filter((entry) => entry.day === day && !entry.isEmpty);
    const rows = entries.filter((entry) => entry.day === day &&
        (!entry.isEmpty || !occupied.some((other) => overlaps(entry, other))));
    for (const slot of slots) {
        const empty: ScheduleEntry = {
            id: `empty-${day}-${slot.id}`, slotId: slot.id, day,
            startTime: `${slot.horaInicio.slice(0, 5)}h`, endTime: `${slot.horaFim.slice(0, 5)}h`,
            subject: "Aula vazia", teacher: "", location: "", accentColor: "#B0BEC5", isEmpty: true,
        };
        if (!rows.some((entry) => overlaps(entry, empty))) rows.push(empty);
    }
    return rows.sort((a, b) => seconds(a.startTime) - seconds(b.startTime) || a.id.localeCompare(b.id));
}

export function serializePersonalSchedule(base: ScheduleEntry[], entries: ScheduleEntry[]) {
    // Guarda referencias: professor, sala e horarios sao sempre relidos da API.
    return JSON.stringify({
        version: 2,
        excludedIds: base.filter((original) => !entries.some((entry) => entry.id === original.id && !entry.isEmpty)).map((entry) => entry.id),
        addedAllocationIds: [...new Set(entries.filter((entry) => entry.id.startsWith("personal-dp-") && !entry.isEmpty)
            .map((entry) => entry.sourceAllocationId))],
    });
}

export function restorePersonalSchedule(base: ScheduleEntry[], saved: string | null, offerings: ScheduleOffering[]) {
    if (!saved) return { entries: base, unavailableCount: 0, migrated: false };
    const data: unknown = JSON.parse(saved);
    if (!data || typeof data !== "object" || !("version" in data)) throw new Error("Grade pessoal inválida.");
    // Preserva exclusoes antigas, mas nao restaura materias de horarios arbitrarios.
    if (data.version === 1 && "overrides" in data && Array.isArray(data.overrides)) {
        const excluded = new Set(data.overrides.filter((entry) => entry?.isEmpty === true).map((entry) => entry.id));
        return { entries: base.map((entry) => excluded.has(entry.id) ? emptyLesson(entry) : entry), unavailableCount: 0, migrated: true };
    }
    if (data.version !== 2 || !("excludedIds" in data) || !Array.isArray(data.excludedIds) ||
        !data.excludedIds.every((id) => typeof id === "string") ||
        !("addedAllocationIds" in data) || !Array.isArray(data.addedAllocationIds) ||
        !data.addedAllocationIds.every((id) => typeof id === "number" && Number.isSafeInteger(id) && id > 0)) throw new Error("Grade pessoal inválida.");
    const excluded = new Set(data.excludedIds);
    const added = new Set<number>(data.addedAllocationIds);
    let entries = base.map((entry) => excluded.has(entry.id) ? emptyLesson(entry) : entry);
    let unavailableCount = added.size;
    for (const offering of offerings) {
        const selected = offering.entries.filter((entry) => entry.sourceAllocationId !== undefined && added.has(entry.sourceAllocationId));
        if (!selected.length) continue;
        const partial = { ...offering, entries: selected };
        if (offeringConflicts(entries, partial).length) continue;
        entries = addOffering(entries, partial);
        unavailableCount -= selected.length;
    }
    return { entries, unavailableCount, migrated: false };
}
