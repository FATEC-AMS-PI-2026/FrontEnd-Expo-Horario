import { Button, ScheduleItem, Text } from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import {
    AlertTriangle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Ellipsis,
    Plus,
    RefreshCw,
    Trash,
    X,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    LayoutAnimation,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    View,
} from "react-native";
import { Sortable, SortableItem } from "react-native-reanimated-dnd";
import { useAppTheme } from "../../theme/ThemeContext";
import { loadSchedule, parseAcademicSelection, ScheduleError } from "../../services/schedule";
import type { ScheduleEntry } from "../../services/schedule";

const USE_NATIVE_DRIVER = Platform.OS !== "web";

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const DAY_NAMES = [
    "Domingo",
    "Segunda feira",
    "Terça feira",
    "Quarta feira",
    "Quinta feira",
    "Sexta feira",
    "Sábado",
];
const SUBJECTS = [
    "Projeto Integrador",
    "Banco de Dados",
    "Interação Humano Computador",
];
const LESSONS = [1, 2, 3, 4, 5, 6];
const SCREEN_WIDTH = Dimensions.get("window").width;
const SORTABLE_ITEM_HEIGHT = 67;

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

interface ScheduleRow {
    id: string;
    item: ScheduleEntry;
    sourceIndex: number;
}

interface SelectionActionsProps {
    isVisible: boolean;
    onRemove: () => void;
    onCancel: () => void;
    onHidden: () => void;
}

function SelectionActions({
    isVisible,
    onRemove,
    onCancel,
    onHidden,
}: SelectionActionsProps) {
    const { colors } = useAppTheme();
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(progress, {
            toValue: isVisible ? 1 : 0,
            useNativeDriver: USE_NATIVE_DRIVER,
            damping: 18,
            stiffness: 180,
        }).start(({ finished }) => {
            if (finished && !isVisible) onHidden();
        });
    }, [isVisible, onHidden, progress]);

    return (
        <Animated.View
            pointerEvents={isVisible ? "auto" : "none"}
            style={{
                backgroundColor: colors.background,
                opacity: progress,
                transform: [
                    {
                        translateY: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-12, 0],
                        }),
                    },
                    {
                        scale: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.94, 1],
                        }),
                    },
                ],
            }}
            className="mb-2 flex-row items-center justify-between rounded-xl py-2"
        >
            <Pressable
                className="items-center justify-center rounded-full py-2 px-3"
                style={{ backgroundColor: colors.surfaceAlt }}
                onPress={onCancel}
            >
                <Text variant="body">Cancelar</Text>
            </Pressable>
            <Pressable
                className="rounded-lg px-3 py-2"
                style={{ backgroundColor: colors.danger }}
                onPress={onRemove}
            >
                <Trash size={24} color={colors.background} />
            </Pressable>
        </Animated.View>
    );
}

export default function Subjects() {
    const { colors, darkMode } = useAppTheme();
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [activeDay, setActiveDay] = useState(() => new Date().getDay());
    const [menuItemIndex, setMenuItemIndex] = useState<number | null>(null);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(
        null,
    );
    const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
    const [selectedDay, setSelectedDay] = useState(activeDay);
    const [selectedLesson, setSelectedLesson] = useState(4);
    const [isSubjectPickerOpen, setIsSubjectPickerOpen] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [selectionActionsAnchorIndex, setSelectionActionsAnchorIndex] =
        useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorCode, setErrorCode] = useState<string | number | null>(null);
    const dayTransitionX = useRef(new Animated.Value(0)).current;
    const swipeX = useRef(new Animated.Value(0)).current;
    const translateX = useRef(Animated.add(dayTransitionX, swipeX)).current;
    const isDayTransitioning = useRef(false);
    const activeDayRef = useRef(activeDay);

    const [selectionLabel, setSelectionLabel] = useState("");
    const requestRef = useRef<AbortController | null>(null);

    const fetchScheduleData = useCallback(async () => {
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;
        setIsLoading(true);
        setErrorCode(null);
        setSchedule([]);
        setSelectionLabel("");
        setSelectedIndices([]);
        setMenuItemIndex(null);
        setSelectionActionsAnchorIndex(null);
        setIsAddSheetOpen(false);
        setEditingItemIndex(null);
        try {
            const saved = await AsyncStorage.getItem("gini:selecaoAcademica");
            if (controller.signal.aborted) return;
            const selection = parseAcademicSelection(saved);
            const result = await loadSchedule(selection, controller.signal);
            if (controller.signal.aborted) return;
            setSchedule(result.entries);
            setSelectionLabel(result.label);
        } catch (error) {
            if (controller.signal.aborted) return;
            setErrorCode(error instanceof ScheduleError ? error.code
                : error instanceof TypeError ? "NETWORK_ERROR" : "UNKNOWN");
        } finally {
            if (!controller.signal.aborted) setIsLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        void fetchScheduleData();
        return () => requestRef.current?.abort();
    }, [fetchScheduleData]));

    const visibleItems = schedule
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.day === activeDay);
    const visibleRows: ScheduleRow[] = visibleItems.map(({ item, index }) => ({
        id: String(index),
        item,
        sourceIndex: index,
    }));
    const isSelectedItemEmpty =
        menuItemIndex !== null && schedule[menuItemIndex]?.isEmpty === true;
    const isSelectedItemInterval =
        menuItemIndex !== null && schedule[menuItemIndex]?.isInterval === true;
    const isSelectionMode = selectedIndices.length > 0;
    const firstSelectedIndex = visibleItems.find(({ index }) =>
        selectedIndices.includes(index),
    )?.index;
    const selectionActionsIndex =
        firstSelectedIndex ?? selectionActionsAnchorIndex;

    const toggleSelection = (index: number) => {
        // Garante que intervalos não possam ser selecionados para remoção em lote
        if (schedule[index]?.isInterval) return;

        setSelectedIndices((current) =>
            current.includes(index)
                ? current.filter((selectedIndex) => selectedIndex !== index)
                : (() => {
                      if (current.length === 0)
                          setSelectionActionsAnchorIndex(index);
                      return [...current, index];
                  })(),
        );
    };

    const clearSelection = () => setSelectedIndices([]);

    const finishSelectionActions = useCallback(
        () => setSelectionActionsAnchorIndex(null),
        [],
    );

    const changeDay = useCallback(
        (nextDay: number, direction?: number) => {
            if (isDayTransitioning.current || nextDay === activeDayRef.current)
                return;

            const dir = direction ?? (nextDay > activeDayRef.current ? -1 : 1);
            isDayTransitioning.current = true;

            Animated.timing(dayTransitionX, {
                toValue: SCREEN_WIDTH * dir,
                duration: 280,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start(() => {
                setActiveDay(nextDay);
                activeDayRef.current = nextDay;
                dayTransitionX.setValue(-SCREEN_WIDTH * dir);

                Animated.timing(dayTransitionX, {
                    toValue: 0,
                    duration: 280,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: USE_NATIVE_DRIVER,
                }).start(() => {
                    isDayTransitioning.current = false;
                });
            });
        },
        [dayTransitionX],
    );

    const daySwipeResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) =>
                Math.abs(gesture.dx) > 12 &&
                Math.abs(gesture.dx) > Math.abs(gesture.dy),

            onPanResponderMove: (_, gesture) => {
                swipeX.setValue(gesture.dx);
            },

            onPanResponderRelease: (_, gesture) => {
                const shouldChangeDay =
                    Math.abs(gesture.dx) > SCREEN_WIDTH * 0.2;
                const currentDay = activeDayRef.current;
                const nextDay =
                    gesture.dx < 0 ? currentDay + 1 : currentDay - 1;

                if (!shouldChangeDay || nextDay < 0 || nextDay >= DAYS.length) {
                    Animated.spring(swipeX, {
                        toValue: 0,
                        useNativeDriver: USE_NATIVE_DRIVER,
                        damping: 20,
                        stiffness: 200,
                        mass: 0.9,
                    }).start();
                    return;
                }

                const startOffset = gesture.dx;
                swipeX.setValue(0);
                dayTransitionX.setValue(startOffset);
                changeDay(nextDay, gesture.dx < 0 ? -1 : 1);
            },

            onPanResponderTerminate: () => {
                Animated.spring(swipeX, {
                    toValue: 0,
                    useNativeDriver: USE_NATIVE_DRIVER,
                    damping: 20,
                    stiffness: 200,
                }).start();
            },
        }),
    ).current;

    const removeSelectedItems = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setSchedule((current) =>
            current.map((item, index) =>
                selectedIndices.includes(index) && !item.isInterval
                    ? {
                          ...item,
                          subject: "Aula vazia",
                          teacher: "",
                          location: "",
                          accentColor: "#B0BEC5",
                          isEmpty: true,
                      }
                    : item,
            ),
        );
        clearSelection();
    };

    const openAddSheet = () => {
        setEditingItemIndex(null);
        setSelectedSubject(SUBJECTS[0]);
        setSelectedDay(activeDay);
        setSelectedLesson(4);
        setIsSubjectPickerOpen(false);
        setIsAddSheetOpen(true);
    };

    const openEditSheet = () => {
        if (menuItemIndex === null) return;
        const item = schedule[menuItemIndex];
        if (item.isInterval) return;

        setEditingItemIndex(menuItemIndex);
        setSelectedSubject(item.isEmpty ? SUBJECTS[0] : item.subject);
        setSelectedDay(item.day);
        setSelectedLesson(4);
        setMenuItemIndex(null);
        setIsSubjectPickerOpen(false);
        setIsAddSheetOpen(true);
    };

    const saveScheduleItem = () => {
        const nextItem: ScheduleEntry = {
            subject: selectedSubject,
            teacher:
                selectedSubject === "Projeto Integrador"
                    ? "Glauco Todesco"
                    : "Renato",
            location: "Lab. 03",
            startTime: "13:20h",
            endTime: "15:00h",
            accentColor:
                selectedSubject === "Banco de Dados" ? "#1565C0" : "#00695C",
            day: selectedDay,
        };

        setSchedule((current) => {
            if (editingItemIndex === null) return [...current, nextItem];
            return current.map((item, index) =>
                index === editingItemIndex ? nextItem : item,
            );
        });
        setIsAddSheetOpen(false);
    };

    const deleteScheduleItem = () => {
        if (menuItemIndex === null) return;
        if (schedule[menuItemIndex]?.isInterval) return;

        setSchedule((current) =>
            current.map((item, index) =>
                index === menuItemIndex
                    ? {
                          ...item,
                          subject: "Aula vazia",
                          teacher: "",
                          location: "",
                          accentColor: "#B0BEC5",
                          isEmpty: true,
                      }
                    : item,
            ),
        );
        setMenuItemIndex(null);
    };

    const reorderVisibleItems = (allPositions?: Record<string, number>) => {
        if (!allPositions) return;

        const reorderedItems = [...visibleRows]
            .sort(
                (a, b) => (allPositions[a.id] ?? 0) - (allPositions[b.id] ?? 0),
            )
            .map(({ item }) => item);
        const visibleIndexes = visibleRows.map(
            ({ sourceIndex }) => sourceIndex,
        );
    };

    const renderScheduleRow = (row: ScheduleRow) => {
        const { item, sourceIndex } = row;

        return (
            <View className="mb-1.5">
                {selectionActionsIndex === sourceIndex && (
                    <SelectionActions
                        isVisible={isSelectionMode}
                        onRemove={removeSelectedItems}
                        onCancel={clearSelection}
                        onHidden={finishSelectionActions}
                    />
                )}
                {item.isInterval ? (
                    <View
                        className="flex-row items-center rounded-xl px-3 py-3 mt-1.5 overflow-hidden"
                        style={{ backgroundColor: colors.surfaceAlt }}
                    >
                        <View className="w-[58px] shrink-0 mr-1">
                            <Text
                                variant="caption"
                                className="leading-4"
                                style={{ color: colors.textMuted }}
                            >
                                {item.startTime}
                            </Text>
                            <Text
                                variant="caption"
                                className="mt-1.5 leading-4"
                                style={{ color: colors.textMuted }}
                            >
                                {item.endTime}
                            </Text>
                        </View>
                        <View className="flex-1 min-w-0 pr-1">
                            <Text variant="body" className="font-medium">
                                {item.subject}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <ScheduleItem
                        startTime={item.startTime}
                        endTime={item.endTime}
                        subject={item.subject}
                        teacher={item.teacher}
                        location={item.location}
                        accentColor={
                            item.isEmpty
                                ? colors.border
                                : darkMode
                                  ? colors.accent
                                  : item.accentColor
                        }
                        isEmpty={item.isEmpty}
                        isSelected={selectedIndices.includes(sourceIndex)}
                        onPress={() =>
                            isSelectionMode && toggleSelection(sourceIndex)
                        }
                        onLongPress={() => toggleSelection(sourceIndex)}
                        onMorePress={() => setMenuItemIndex(sourceIndex)}
                    />
                )}
            </View>
        );
    };

    if (isLoading) {
        return (
            <View
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: colors.background }}
            >
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (errorCode !== null) {
        return <ErrorState errorCode={errorCode}
            actionLabel={errorCode === "SELECTION_REQUIRED" ? "Escolher curso e turma" : undefined}
            onRetry={errorCode === "SELECTION_REQUIRED"
                ? () => router.push("/chooseCourse")
                : () => void fetchScheduleData()} />;
    }

    return (
        <View
            className="flex-1 pt-4"
            style={{ backgroundColor: colors.background }}
        >
            <Text variant="caption" className="px-4 mb-3" style={{ color: colors.textMuted }}>
                {selectionLabel}
            </Text>
            <View className="flex-row p-1 px-3 gap-1 w-full">
                {DAYS.map((day, index) => (
                    <Pressable
                        key={index}
                        onPress={() => changeDay(index)}
                        className="flex-1 p-2 px-4 border rounded-md items-center"
                        style={{
                            borderColor: colors.border,
                            backgroundColor:
                                index === activeDay
                                    ? colors.accent
                                    : colors.surface,
                        }}
                    >
                        <Text
                            variant="label"
                            style={{
                                color:
                                    index === activeDay
                                        ? colors.background
                                        : colors.text,
                            }}
                        >
                            {day}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
                <Text variant="heading">{DAY_NAMES[activeDay]}</Text>
                <Button
                    variant="ghost"
                    size="xs"
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: colors.surfaceAlt }}
                    onPress={openAddSheet}
                >
                    <Plus color={colors.text} />
                </Button>
            </View>

            <Animated.View
                {...daySwipeResponder.panHandlers}
                className="flex-1"
                style={{ transform: [{ translateX }] }}
            >
                {visibleRows.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <Text className="text-center" style={{ color: colors.textMuted }}>
                            Nenhuma aula cadastrada para esta turma em {DAY_NAMES[activeDay].toLowerCase()}.
                        </Text>
                    </View>
                ) : <Sortable
                    data={visibleRows}
                    itemHeight={SORTABLE_ITEM_HEIGHT}
                    style={{ flex: 1, backgroundColor: colors.background }}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={({ item: row, id, ...sortableProps }) => (
                        <SortableItem
                            {...sortableProps}
                            id={id}
                            data={row}
                            style={{ height: SORTABLE_ITEM_HEIGHT }}
                            onDrop={(_, __, allPositions) =>
                                reorderVisibleItems(allPositions)
                            }
                        >
                            {renderScheduleRow(row)}
                        </SortableItem>
                    )}
                />}
            </Animated.View>

            <View className="flex-row items-center justify-between px-6 py-4">
                <Button
                    variant="ghost"
                    size="xs"
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: colors.surfaceAlt }}
                >
                    <ChevronLeft size={24} color={colors.textMuted} />
                </Button>
                <View className="flex-row gap-1.5">
                    <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                    />
                    <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                    />
                    <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                    />
                    <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                    />
                    <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                    />
                    <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                    />
                    <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                    />
                </View>
                <Button
                    variant="ghost"
                    size="xs"
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: colors.surfaceAlt }}
                >
                    <ChevronRight size={24} color={colors.textMuted} />
                </Button>
            </View>

            <Modal
                visible={menuItemIndex !== null && !isSelectedItemInterval}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuItemIndex(null)}
            >
                <Pressable
                    className="flex-1 justify-end bg-black/30"
                    onPress={() => setMenuItemIndex(null)}
                >
                    <Pressable
                        className="rounded-t-3xl px-5 pt-3 pb-8"
                        style={{ backgroundColor: colors.surface }}
                        onPress={() => {}}
                    >
                        <View
                            className="self-center w-10 h-1 rounded-full mb-5"
                            style={{ backgroundColor: colors.border }}
                        />
                        <Text variant="subheading" className="mb-2">
                            Opções da aula
                        </Text>
                        <Pressable
                            className="py-4 border-b"
                            style={{ borderColor: colors.border }}
                            onPress={openEditSheet}
                        >
                            <Text variant="body">Editar</Text>
                        </Pressable>
                        <Pressable
                            className="py-4"
                            onPress={
                                isSelectedItemEmpty
                                    ? openEditSheet
                                    : deleteScheduleItem
                            }
                        >
                            <Text
                                variant="body"
                                style={{
                                    color: isSelectedItemEmpty
                                        ? colors.accent
                                        : colors.danger,
                                }}
                            >
                                {isSelectedItemEmpty
                                    ? "Adicionar aula"
                                    : "Excluir"}
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                visible={isAddSheetOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setIsAddSheetOpen(false)}
            >
                <Pressable
                    className="flex-1 justify-end bg-black/30"
                    onPress={() => setIsAddSheetOpen(false)}
                >
                    <Pressable
                        className="rounded-t-3xl px-3 pt-4 pb-8"
                        style={{ backgroundColor: colors.surface }}
                        onPress={() => {}}
                    >
                        <View className="flex-row items-center justify-between mb-5">
                            <View className="w-10" />
                            <Text variant="subheading">
                                {editingItemIndex === null
                                    ? "Adicionar Matéria"
                                    : "Editar Matéria"}
                            </Text>
                            <Pressable
                                className="w-10 h-10 items-center justify-center rounded-full"
                                style={{ backgroundColor: colors.surfaceAlt }}
                                onPress={() => setIsAddSheetOpen(false)}
                                accessibilityLabel="Fechar"
                            >
                                <X size={22} color={colors.text} />
                            </Pressable>
                        </View>

                        <Text variant="caption" className="mb-1">
                            selecione uma matéria
                        </Text>
                        <View className="relative z-10">
                            <Pressable
                                className="h-11 border rounded-lg px-3 flex-row items-center justify-between"
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                }}
                                onPress={() =>
                                    setIsSubjectPickerOpen((open) => !open)
                                }
                            >
                                <Text variant="caption">{selectedSubject}</Text>
                                <ChevronDown size={22} color={colors.text} />
                            </Pressable>
                            {isSubjectPickerOpen && (
                                <View
                                    className="absolute top-12 left-0 right-0 border rounded-lg shadow-lg"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    {SUBJECTS.map((subject) => (
                                        <Pressable
                                            key={subject}
                                            className="px-3 py-3 border-b"
                                            style={{
                                                borderColor: colors.border,
                                            }}
                                            onPress={() => {
                                                setSelectedSubject(subject);
                                                setIsSubjectPickerOpen(false);
                                            }}
                                        >
                                            <Text variant="caption">
                                                {subject}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>

                        <Text variant="caption" className="mt-5 mb-1">
                            selecione um dia
                        </Text>
                        <View className="flex-row gap-1">
                            {DAYS.map((day, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => setSelectedDay(index)}
                                    className="flex-1 h-11 rounded-lg border items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            selectedDay === index
                                                ? colors.accent
                                                : colors.surface,
                                        borderColor:
                                            selectedDay === index
                                                ? colors.accent
                                                : colors.border,
                                    }}
                                >
                                    <Text
                                        variant="caption"
                                        className={
                                            selectedDay === index
                                                ? "font-medium"
                                                : ""
                                        }
                                        style={{
                                            color:
                                                selectedDay === index
                                                    ? colors.background
                                                    : colors.textMuted,
                                        }}
                                    >
                                        {day}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text variant="caption" className="mt-5 mb-1">
                            selecione uma aula
                        </Text>
                        <View className="flex-row gap-1">
                            {LESSONS.map((lesson) => (
                                <Pressable
                                    key={lesson}
                                    onPress={() => setSelectedLesson(lesson)}
                                    className="flex-1 h-11 rounded-lg border items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            selectedLesson === lesson
                                                ? colors.accent
                                                : colors.surface,
                                        borderColor:
                                            selectedLesson === lesson
                                                ? colors.accent
                                                : colors.border,
                                    }}
                                >
                                    <Text
                                        variant="caption"
                                        className={
                                            selectedLesson === lesson
                                                ? "font-medium"
                                                : ""
                                        }
                                        style={{
                                            color:
                                                selectedLesson === lesson
                                                    ? colors.background
                                                    : colors.textMuted,
                                        }}
                                    >
                                        {lesson}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable
                            className="mt-5 h-13 rounded-lg flex-row items-center justify-center gap-2"
                            style={{ backgroundColor: colors.accent }}
                            onPress={saveScheduleItem}
                        >
                            <Plus size={24} color={colors.background} />
                            <Text
                                className="font-[Poppins-Regular]"
                                style={{ color: colors.background }}
                            >
                                {editingItemIndex === null
                                    ? "Adicionar"
                                    : "Salvar"}
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
