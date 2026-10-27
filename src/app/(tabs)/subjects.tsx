import { Button, ScheduleItem, SearchBar, Text } from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { AlertTriangle, Plus, RefreshCw, X } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { loadSchedule, loadScheduleOptions, parseAcademicSelection, ScheduleError } from "../../services/schedule";
import type { AcademicSelection, ScheduleEntry, ScheduleSlot, ScheduleOffering } from "../../services/schedule";
import { addOffering, daySchedule, emptyLesson, offeringConflicts, overlaps, personalScheduleKey, releaseAndAddOffering, restorePersonalSchedule, serializePersonalSchedule } from "../../services/personalSchedule";

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const DAY_NAMES = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const ERROR_MESSAGES: Record<string | number, string> = {
    SELECTION_REQUIRED: "Escolha seu curso e sua turma para consultar os horários.",
    400: "Requisição inválida. Verifique os dados fornecidos e tente novamente.",
    401: "Sua sessão expirou. Faça login novamente para acessar seus horários.",
    403: "Você não tem permissão para acessar esta grade de aulas.",
    404: "Parece que houve algum erro, seus dados não foram encontrados em nossos servidores. Entre em contato com o suporte para mais informações.",
    408: "A conexão demorou muito a responder. Verifique sua internet.",
    500: "Ocorreu um erro interno em nossos servidores. Nossa equipe já foi notificada.",
    502: "Serviço temporariamente indisponível. Tente novamente em alguns minutos.",
    503: "Serviço em manutenção programada. Voltaremos em breve.",
    NETWORK_ERROR:
        "Sem conexão com a internet. Verifique seu Wi-Fi ou dados móveis.",
    UNKNOWN:
        "Ocorreu um erro inesperado ao carregar suas aulas. Tente novamente.",
};

export const getErrorMessage = (code?: string | number): string => {
    if (!code) return ERROR_MESSAGES.UNKNOWN;
    return ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN;
};

interface ErrorStateProps {
    errorCode: string | number;
    onRetry: () => void;
    actionLabel?: string;
}

export function ErrorState({ errorCode, onRetry, actionLabel = "Tentar novamente" }: ErrorStateProps) {
    const { colors } = useAppTheme();
    const message = getErrorMessage(errorCode);

    return (
        <View
            className="flex-1 items-center justify-center p-6"
            style={{ backgroundColor: colors.background }}
        >
            <View
                className="mb-4 h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.dangerSoft }}
            >
                <AlertTriangle size={32} color={colors.danger} />
            </View>

            <Text variant="subheading" className="mb-2 text-center font-bold">
                Ops! Algo deu errado
            </Text>

            <Text
                variant="body"
                className="mb-3 text-center"
                style={{ color: colors.textMuted }}
            >
                {message}
            </Text>

            <View
                className="mb-6 rounded-md px-3 py-1"
                style={{ backgroundColor: colors.surfaceAlt }}
            >
                <Text
                    variant="caption"
                    className="font-mono"
                    style={{ color: colors.textMuted }}
                >
                    Código de erro: {errorCode}
                </Text>
            </View>

            <Pressable
                onPress={onRetry}
                className="flex-row items-center justify-center gap-2 rounded-lg px-6 py-3 active:opacity-80"
                style={{ backgroundColor: colors.accent }}
            >
                <RefreshCw size={18} color={colors.background} />
                <Text
                    className="font-medium"
                    style={{ color: colors.background }}
                >
                    {actionLabel}
                </Text>
            </Pressable>
        </View>
    );
}

export default function Subjects() {
    const { colors, darkMode } = useAppTheme();
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [offerings, setOfferings] = useState<ScheduleOffering[]>([]);
    const [slots, setSlots] = useState<ScheduleSlot[]>([]);
    const [label, setLabel] = useState("");
    const [activeDay, setActiveDay] = useState(() => new Date().getDay());
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState<string | number | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [menuEntry, setMenuEntry] = useState<ScheduleEntry | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [targetEntry, setTargetEntry] = useState<ScheduleEntry | null>(null);
    const [offeringKey, setOfferingKey] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [period, setPeriod] = useState<number | null>(null);
    const [conflicts, setConflicts] = useState<ScheduleEntry[]>([]);
    const requestRef = useRef<AbortController | null>(null);
    const baseRef = useRef<ScheduleEntry[]>([]);
    const selectionRef = useRef<AcademicSelection | null>(null);
    const savingRef = useRef(false);

    const load = useCallback(async () => {
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;
        selectionRef.current = null;
        setLoading(true);
        setErrorCode(null);
        setSaveError(null);
        setSchedule([]);
        setMenuEntry(null);
        setEditorOpen(false);
        setConflicts([]);
        try {
            const saved = await AsyncStorage.getItem("gini:selecaoAcademica");
            if (controller.signal.aborted) return;
            const selection = parseAcademicSelection(saved);
            const [result, options, personal] = await Promise.all([
                loadSchedule(selection, controller.signal),
                loadScheduleOptions(selection, controller.signal),
                AsyncStorage.getItem(personalScheduleKey(selection)),
            ]);
            if (controller.signal.aborted) return;
            let entries = result.entries;
            try {
                const restored = restorePersonalSchedule(entries, personal, options.offerings);
                entries = restored.entries;
                if (restored.migrated) setSaveError("Escolha novamente suas DPs para usar as aulas e os horários das turmas de origem. As exclusões foram mantidas.");
                else if (restored.unavailableCount) setSaveError("Algumas aulas de DP não estão mais disponíveis ou conflitam com sua grade atual. Confira as ofertas novamente.");
            } catch {
                setSaveError("Não foi possível ler sua personalização. Exibindo a grade padrão.");
            }
            baseRef.current = result.entries;
            selectionRef.current = selection;
            setSchedule(entries);
            setLabel(result.label);
            setOfferings(options.offerings);
            setSlots(options.slots);
        } catch (error) {
            if (!controller.signal.aborted) setErrorCode(error instanceof ScheduleError ? error.code
                : error instanceof TypeError ? "NETWORK_ERROR" : "UNKNOWN");
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        void load();
        return () => requestRef.current?.abort();
    }, [load]));

    async function saveEntries(next: ScheduleEntry[]): Promise<boolean> {
        const selection = selectionRef.current;
        if (!selection || savingRef.current) return false;
        savingRef.current = true;
        setSaving(true);
        setSaveError(null);
        try {
            await AsyncStorage.setItem(personalScheduleKey(selection), serializePersonalSchedule(baseRef.current, next));
            if (selectionRef.current !== selection || requestRef.current?.signal.aborted) return false;
            setSchedule(next);
            return true;
        } catch {
            if (selectionRef.current === selection) setSaveError("Não foi possível salvar a alteração. Tente novamente.");
            return false;
        } finally {
            savingRef.current = false;
            setSaving(false);
        }
    }

    function closeEditor() {
        if (savingRef.current) return;
        setMenuEntry(null);
        setEditorOpen(false);
        setConflicts([]);
    }

    function openEditor(entry?: ScheduleEntry) {
        if (savingRef.current) return;
        setTargetEntry(entry ?? null);
        setOfferingKey(null);
        setSearch("");
        setPeriod(null);
        setConflicts([]);
        setSaveError(null);
        setMenuEntry(null);
        setEditorOpen(true);
    }

    async function removeLesson(entry: ScheduleEntry) {
        if (entry.isEmpty) return;
        if (await saveEntries(schedule.map((item) => item.id === entry.id ? emptyLesson(item) : item))) setMenuEntry(null);
    }

    async function saveOffering(releaseConflicts = false) {
        const offering = offerings.find((item) => item.key === offeringKey);
        if (!offering || savingRef.current) return;
        const occupied = offeringConflicts(schedule, offering);
        if (occupied.length && !releaseConflicts) {
            setConflicts(occupied);
            return;
        }
        try {
            const next = releaseConflicts ? releaseAndAddOffering(schedule, offering) : addOffering(schedule, offering);
            if (await saveEntries(next)) {
                setActiveDay(targetEntry?.day ?? offering.entries[0].day);
                setEditorOpen(false);
                setConflicts([]);
            }
        } catch {
            setSaveError("A oferta possui encontros sobrepostos. Escolha outra oferta.");
        }
    }

    const rows = daySchedule(schedule, slots, activeDay);
    const periods = [...new Set(offerings.map((offering) => offering.periodo))].sort((a, b) => a - b);
    const filteredOfferings = offerings.filter((offering) =>
        !offering.entries.every((entry) => schedule.some((item) => !item.isEmpty && item.sourceAllocationId === entry.sourceAllocationId)) &&
        (period === null || offering.periodo === period) && normalize(offering.subject).includes(normalize(search)) &&
        (!targetEntry || offering.entries.some((entry) => overlaps(entry, targetEntry))));
    const selectedOffering = filteredOfferings.find((offering) => offering.key === offeringKey);
    const periodLabel = (offering: ScheduleOffering) => `${offering.periodo}º ${offering.periodicidade?.toLowerCase() === "anual" ? "ano" : "semestre"}`;

    if (loading) return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}><ActivityIndicator size="large" color={colors.accent} /></View>;
    if (errorCode !== null) return <ErrorState errorCode={errorCode}
        actionLabel={errorCode === "SELECTION_REQUIRED" ? "Escolher curso e turma" : undefined}
        onRetry={errorCode === "SELECTION_REQUIRED" ? () => router.push("/chooseCourse") : () => void load()} />;

    return (
        <View className="flex-1 pt-4" style={{ backgroundColor: colors.background }}>
            <Text variant="caption" className="px-4 mb-3" style={{ color: colors.textMuted }}>{label}</Text>
            <View className="flex-row p-1 px-3 gap-1 w-full">
                {DAYS.map((letter, index) => (
                    <Pressable key={index} accessibilityRole="button" accessibilityLabel={DAY_NAMES[index]}
                        accessibilityState={{ selected: activeDay === index }} onPress={() => setActiveDay(index)}
                        className="flex-1 p-2 border rounded-md items-center"
                        style={{ borderColor: colors.border, backgroundColor: activeDay === index ? colors.accent : colors.surface }}>
                        <Text variant="label" style={{ color: activeDay === index ? colors.background : colors.text }}>{letter}</Text>
                    </Pressable>
                ))}
            </View>
            <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
                <Text variant="heading">{DAY_NAMES[activeDay]}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Adicionar DP" disabled={saving}
                    onPress={() => openEditor()} style={{ padding: 10, borderRadius: 24, backgroundColor: colors.surfaceAlt }}>
                    <Plus color={colors.text} size={22} />
                </Pressable>
            </View>
            {saveError && <Text accessibilityRole="alert" variant="caption" className="px-4 mb-2" style={{ color: colors.danger }}>{saveError}</Text>}
            <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 110 }}>
                {rows.length ? rows.map((entry) => (
                    <ScheduleItem key={entry.id} startTime={entry.startTime} endTime={entry.endTime}
                        subject={entry.subject} teacher={entry.teacher} location={entry.location}
                        accentColor={entry.isEmpty ? colors.border : darkMode ? colors.accent : entry.accentColor}
                        isEmpty={entry.isEmpty} onMorePress={() => { if (!savingRef.current) setMenuEntry(entry); }}>
                        {!entry.isEmpty && entry.sourceTurmaId !== selectionRef.current?.turmaId && (
                            <Text variant="caption" style={{ color: colors.textMuted }}>DP · Turma {entry.sourceTurmaCode}</Text>
                        )}
                    </ScheduleItem>
                )) : <Text className="text-center py-8" style={{ color: colors.textMuted }}>Nenhum horário disponível para este dia.</Text>}
            </ScrollView>

            <Modal visible={menuEntry !== null || editorOpen} transparent animationType="slide" onRequestClose={closeEditor}>
                <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" }}>
                    <Pressable accessibilityLabel="Fechar opções" style={{ flex: 1 }} onPress={closeEditor} disabled={saving} />
                    <View style={{ maxHeight: "88%", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32, backgroundColor: colors.surface }}>
                        <View className="flex-row items-center justify-between mb-4">
                            <Text variant="subheading">{menuEntry ? "Opções da aula" : conflicts.length ? "Conflito de horário" : "Adicionar aula ofertada"}</Text>
                            <Pressable accessibilityRole="button" accessibilityLabel="Fechar" disabled={saving} onPress={closeEditor} style={{ padding: 8 }}><X color={colors.text} size={22} /></Pressable>
                        </View>
                        {saveError && <Text accessibilityRole="alert" variant="caption" className="mb-3" style={{ color: colors.danger }}>{saveError}</Text>}
                        {menuEntry ? (
                            <View style={{ gap: 12 }}>
                                <Text variant="caption" style={{ color: colors.textMuted }}>{DAY_NAMES[menuEntry.day]} · {menuEntry.startTime}–{menuEntry.endTime}</Text>
                                {menuEntry.isEmpty && <Button variant="outline" disabled={saving} onPress={() => openEditor(menuEntry)}>Escolher aula neste horário</Button>}
                                {!menuEntry.isEmpty && <Button variant="destructive" loading={saving} onPress={() => void removeLesson(menuEntry)}>Excluir</Button>}
                                <Button variant="ghost" disabled={saving} onPress={closeEditor}>Cancelar</Button>
                            </View>
                        ) : conflicts.length ? (
                            <View style={{ gap: 16 }}>
                                <Text>O horário da turma de origem está ocupado na sua grade. Você pode liberar as aulas abaixo e adicionar esta matéria nos horários originais.</Text>
                                <ScrollView style={{ maxHeight: 160 }}>
                                    {conflicts.map((entry) => <Text key={entry.id} variant="caption" className="mb-2">{entry.subject} · {DAY_NAMES[entry.day]} · {entry.startTime}–{entry.endTime}</Text>)}
                                </ScrollView>
                                <Button loading={saving} onPress={() => void saveOffering(true)}>Liberar aulas e adicionar</Button>
                                <Button variant="outline" disabled={saving} onPress={() => setConflicts([])}>Voltar às ofertas</Button>
                                <Button variant="ghost" disabled={saving} onPress={closeEditor}>Cancelar</Button>
                            </View>
                        ) : (
                            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 8 }}>
                                <Text variant="caption" className="mb-3" style={{ color: colors.textMuted }}>
                                    Escolha uma matéria já oferecida por uma turma do seu curso. Todos os encontros serão incluídos nos horários originais, com professor e sala definidos.
                                </Text>
                                {targetEntry && <Text variant="caption" className="mb-3">Ofertas em {DAY_NAMES[targetEntry.day]} · {targetEntry.startTime}–{targetEntry.endTime}</Text>}
                                <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar matéria ofertada" />
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}>
                                    {[null, ...periods].map((value) => <Pressable key={value ?? "all"} accessibilityRole="button" disabled={saving}
                                        onPress={() => { setPeriod(value); setOfferingKey(null); }}
                                        style={{ padding: 10, borderRadius: 8, backgroundColor: period === value ? colors.accent : colors.surfaceAlt }}>
                                        <Text variant="caption" style={{ color: period === value ? colors.background : colors.text }}>{value === null ? "Todos os períodos" : `${value}º período`}</Text>
                                    </Pressable>)}
                                </ScrollView>
                                {filteredOfferings.map((offering) => {
                                    const occupied = offeringConflicts(schedule, offering).length > 0;
                                    return <Pressable key={offering.key} accessibilityRole="button"
                                        accessibilityLabel={`${offering.subject}, ${periodLabel(offering)}, turma ${offering.turmaCodigo}`}
                                        accessibilityState={{ selected: offeringKey === offering.key }} disabled={saving}
                                        onPress={() => setOfferingKey(offering.key)}
                                        style={{
                                            padding: 14, marginBottom: 12, borderRadius: 8, borderWidth: offeringKey === offering.key ? 2 : 1,
                                            borderColor: offeringKey === offering.key ? colors.accent : colors.border, backgroundColor: colors.surface
                                        }}>
                                        <Text variant="label">{offering.subject}</Text>
                                        <Text variant="caption" className="mt-1" style={{ color: colors.textMuted }}>{periodLabel(offering)} · Turma {offering.turmaCodigo} · {offering.ano}</Text>
                                        {offering.entries.map((entry) => <View key={entry.id} style={{ marginTop: 10 }}>
                                            <Text variant="caption" style={{ color: colors.accent }}>{DAY_NAMES[entry.day]} · {entry.startTime}–{entry.endTime}</Text>
                                            <Text variant="caption">{entry.teacher} · Sala: {entry.location}</Text>
                                        </View>)}
                                        <Text variant="caption" className="mt-2" style={{ color: occupied ? colors.danger : colors.textMuted }}>
                                            {occupied ? "Conflita com sua grade" : "Horários livres na sua grade"}
                                        </Text>
                                    </Pressable>;
                                })}
                                {!filteredOfferings.length && <Text variant="caption" className="py-4" style={{ color: colors.textMuted }}>
                                    {targetEntry ? "Nenhuma oferta adicional neste horário. Use o botão + para consultar os outros horários." : "Nenhuma oferta adicional para os filtros selecionados. As aulas que já estão na sua grade ficam ocultas."}
                                </Text>}
                                <Button loading={saving} disabled={!selectedOffering} onPress={() => void saveOffering()}>
                                    Adicionar à minha grade
                                </Button>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
