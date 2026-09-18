import { Button, ScheduleItem, Text } from "@/components";
import { ChevronDown, ChevronLeft, ChevronRight, Ellipsis, Plus, Trash, X } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
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

const USE_NATIVE_DRIVER = Platform.OS !== "web";

type ScheduleEntry = {
  subject: string;
  teacher: string;
  location: string;
  startTime: string;
  endTime: string;
  accentColor: string;
  day: number;
  isInterval?: boolean;
  isEmpty?: boolean;
};

const SCHEDULE_DATA: ScheduleEntry[] = [
  {
    subject: "Projeto Integrador I",
    teacher: "Glauco Todesco",
    location: "Lab. 03",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#00695C",
    day: 1,
  },
  {
    subject: "Projeto Integrador I",
    teacher: "Glauco Todesco",
    location: "Lab. 03",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#00695C",
    day: 1,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#00ACC1",
    day: 1,
    isInterval: true,
  },
  {
    subject: "Banco de Dados",
    teacher: "Renato",
    location: "Lab. 03",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#1565C0",
    day: 1,
  },
  {
    subject: "Banco de Dados",
    teacher: "Renato",
    location: "Lab. 03",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#1565C0",
    day: 1,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#00ACC1",
    day: 1,
    isInterval: true,
  },
  {
    subject: "Interação Humano Computador",
    teacher: "Renato",
    location: "Lab. 03",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#E65100",
    day: 1,
  },
  {
    subject: "Banco de Dados",
    teacher: "Renato",
    location: "Lab. 03",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#E65100",
    day: 1,
  },
  {
    subject: "Engenharia de Software",
    teacher: "Mariana Lopes",
    location: "Sala 12",
    startTime: "08:00h",
    endTime: "09:40h",
    accentColor: "#6A1B9A",
    day: 0,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "09:40h",
    endTime: "10:00h",
    accentColor: "#00ACC1",
    day: 0,
    isInterval: true,
  },
  {
    subject: "Programação Web",
    teacher: "Carlos Mendes",
    location: "Lab. 02",
    startTime: "10:00h",
    endTime: "11:40h",
    accentColor: "#2E7D32",
    day: 0,
  },
  {
    subject: "Redes de Computadores",
    teacher: "Ana Ribeiro",
    location: "Lab. 01",
    startTime: "08:00h",
    endTime: "09:40h",
    accentColor: "#AD1457",
    day: 2,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "09:40h",
    endTime: "10:00h",
    accentColor: "#00ACC1",
    day: 2,
    isInterval: true,
  },
  {
    subject: "Interação Humano Computador",
    teacher: "Renato",
    location: "Lab. 03",
    startTime: "10:00h",
    endTime: "11:40h",
    accentColor: "#E65100",
    day: 2,
  },
  {
    subject: "Sistemas Operacionais",
    teacher: "Paulo Nunes",
    location: "Sala 08",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#283593",
    day: 3,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "15:00h",
    endTime: "15:20h",
    accentColor: "#00ACC1",
    day: 3,
    isInterval: true,
  },
  {
    subject: "Projeto Integrador II",
    teacher: "Glauco Todesco",
    location: "Lab. 03",
    startTime: "15:20h",
    endTime: "17:00h",
    accentColor: "#00695C",
    day: 3,
  },
  {
    subject: "Banco de Dados II",
    teacher: "Renato",
    location: "Lab. 03",
    startTime: "08:00h",
    endTime: "09:40h",
    accentColor: "#1565C0",
    day: 4,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "09:40h",
    endTime: "10:00h",
    accentColor: "#00ACC1",
    day: 4,
    isInterval: true,
  },
  {
    subject: "Arquitetura de Computadores",
    teacher: "Fernanda Alves",
    location: "Sala 05",
    startTime: "10:00h",
    endTime: "11:40h",
    accentColor: "#EF6C00",
    day: 4,
  },
  {
    subject: "Análise de Sistemas",
    teacher: "Mariana Lopes",
    location: "Sala 12",
    startTime: "13:20h",
    endTime: "15:00h",
    accentColor: "#6A1B9A",
    day: 5,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "15:00h",
    endTime: "15:20h",
    accentColor: "#00ACC1",
    day: 5,
    isInterval: true,
  },
  {
    subject: "Desenvolvimento Mobile",
    teacher: "Carlos Mendes",
    location: "Lab. 02",
    startTime: "15:20h",
    endTime: "17:00h",
    accentColor: "#2E7D32",
    day: 5,
  },
  {
    subject: "Atividade Complementar",
    teacher: "Coordenação",
    location: "Auditório",
    startTime: "08:00h",
    endTime: "09:40h",
    accentColor: "#00838F",
    day: 6,
  },
  {
    subject: "Intervalo",
    teacher: "",
    location: "",
    startTime: "09:40h",
    endTime: "10:00h",
    accentColor: "#00ACC1",
    day: 6,
    isInterval: true,
  },
  {
    subject: "Estudos Orientados",
    teacher: "Glauco Todesco",
    location: "Biblioteca",
    startTime: "10:00h",
    endTime: "11:40h",
    accentColor: "#5D4037",
    day: 6,
  },
];

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
const SUBJECTS = ["Projeto Integrador", "Banco de Dados", "Interação Humano Computador"];
const LESSONS = [1, 2, 3, 4, 5, 6];
const SCREEN_WIDTH = Dimensions.get("window").width;
const SORTABLE_ITEM_HEIGHT = 64;

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
        opacity: progress,
        transform: [
          { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) },
          { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
        ],
      }}
      className="mb-2 flex-row items-center justify-between rounded-xl bg-white py-2"
    >
      <Pressable
        className="items-center justify-center rounded-full bg-gray-100 py-2 px-3"
        onPress={onCancel}
      >
        <Text variant="body" className="text-gray-700">Cancelar</Text>
      </Pressable>
      <Pressable
        className="rounded-lg bg-red-500 px-3 py-2"
        onPress={onRemove}
      >
        <Trash size={24} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

export default function Subjects() {
  const [schedule, setSchedule] = useState(SCHEDULE_DATA);
  const [activeDay, setActiveDay] = useState(1);
  const [menuItemIndex, setMenuItemIndex] = useState<number | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedDay, setSelectedDay] = useState(activeDay);
  const [selectedLesson, setSelectedLesson] = useState(4);
  const [isSubjectPickerOpen, setIsSubjectPickerOpen] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectionActionsAnchorIndex, setSelectionActionsAnchorIndex] = useState<number | null>(null);
  const dayTransitionX = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;
  const translateX = useRef(Animated.add(dayTransitionX, swipeX)).current;
  const isDayTransitioning = useRef(false);
  const activeDayRef = useRef(activeDay);

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
  const isSelectionMode = selectedIndices.length > 0;
  const firstSelectedIndex = visibleItems.find(({ index }) =>
    selectedIndices.includes(index),
  )?.index;
  const selectionActionsIndex = firstSelectedIndex ?? selectionActionsAnchorIndex;

  const toggleSelection = (index: number) => {
    setSelectedIndices((current) =>
      current.includes(index)
        ? current.filter((selectedIndex) => selectedIndex !== index)
        : (() => {
            if (current.length === 0) setSelectionActionsAnchorIndex(index);
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
    if (isDayTransitioning.current || nextDay === activeDayRef.current) return;

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
      const shouldChangeDay = Math.abs(gesture.dx) > SCREEN_WIDTH * 0.2;
      const currentDay = activeDayRef.current;
      const nextDay = gesture.dx < 0 ? currentDay + 1 : currentDay - 1;

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

      // "entrega" o swipe atual para a transição oficial
      // (congela o offset atual e zera o swipe antes de animar)
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
        selectedIndices.includes(index)
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
      teacher: selectedSubject === "Projeto Integrador" ? "Glauco Todesco" : "Renato",
      location: "Lab. 03",
      startTime: "13:20h",
      endTime: "15:00h",
      accentColor: selectedSubject === "Banco de Dados" ? "#1565C0" : "#00695C",
      day: selectedDay,
    };

    setSchedule((current) => {
      if (editingItemIndex === null) return [...current, nextItem];
      return current.map((item, index) => (index === editingItemIndex ? nextItem : item));
    });
    setIsAddSheetOpen(false);
  };

  const deleteScheduleItem = () => {
    if (menuItemIndex === null) return;
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
      .sort((a, b) => (allPositions[a.id] ?? 0) - (allPositions[b.id] ?? 0))
      .map(({ item }) => item);
    const visibleIndexes = visibleRows.map(({ sourceIndex }) => sourceIndex);

    
    /* setSchedule((current) => {
      const next = [...current];
      visibleIndexes.forEach((sourceIndex, position) => {
        next[sourceIndex] = reorderedItems[position];
      });
      return next;
    }); */
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
          <View className="flex-row items-center bg-[#E0F7FA] rounded-xl px-3 py-2 overflow-hidden">
            <View className="w-[58px] shrink-0 mr-1">
              <Text variant="caption" className="text-gray-600 leading-4">
                {item.startTime}
              </Text>
              <Text variant="caption" className="text-gray-600 mt-1.5 leading-4">
                {item.endTime}
              </Text>
            </View>
            <View className="flex-1 min-w-0 pr-1">
              <Text variant="body" className="text-black font-medium">
                {item.subject}
              </Text>
            </View>
            <Button
              variant="ghost"
              size="xs"
              className="w-8 h-8"
              onPress={() => setMenuItemIndex(sourceIndex)}
            >
              <Ellipsis size={22} color="#666" />
            </Button>
          </View>
        ) : (
          <ScheduleItem
            startTime={item.startTime}
            endTime={item.endTime}
            subject={item.subject}
            teacher={item.teacher}
            location={item.location}
            accentColor={item.accentColor}
            isEmpty={item.isEmpty}
            isSelected={selectedIndices.includes(sourceIndex)}
            onPress={() => isSelectionMode && toggleSelection(sourceIndex)}
            onLongPress={() => toggleSelection(sourceIndex)}
            onMorePress={() => setMenuItemIndex(sourceIndex)}
          />
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white pt-4">

      <View className="flex-row p-1 px-3 gap-1 w-full">
        {DAYS.map((day, index) => (
          <Pressable
            key={index}
            onPress={() => changeDay(index)}
            className={`flex-1 p-2 px-4 border border-border rounded-md items-center ${
              index === activeDay ? "bg-primary" : ""
            }`}
          >
            <Text
              variant="label"
              className={index === activeDay ? "text-text-inverse" : ""}
            >
              {day}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text variant="heading" className="text-black">
          {DAY_NAMES[activeDay]}
        </Text>
        <Button
          variant="ghost"
          size="xs"
          className="w-8 h-8 rounded-full bg-gray-100"
          onPress={openAddSheet}
        >
          <Plus color="#000" />
        </Button>
      </View>

      <Animated.View
        {...daySwipeResponder.panHandlers}
        className="flex-1"
        style={{ transform: [{ translateX }] }}
      >
        <Sortable
          data={visibleRows}
          itemHeight={SORTABLE_ITEM_HEIGHT}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item: row, id, ...sortableProps }) => (
            <SortableItem
              {...sortableProps}
              id={id}
              data={row}
              style={{ height: SORTABLE_ITEM_HEIGHT }}
              onDrop={(_, __, allPositions) => reorderVisibleItems(allPositions)}
            >
              {renderScheduleRow(row)}
            </SortableItem>
          )}
        />
      </Animated.View>

      <View className="flex-row items-center justify-between px-6 py-4">
        <Button variant="ghost" size="xs" className="w-10 h-10 rounded-full bg-gray-100">
          <ChevronLeft size={24} color="#666" />
        </Button>
        <View className="flex-row gap-1.5">
          <View className="w-2 h-2 rounded-full bg-primary" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
        </View>
        <Button variant="ghost" size="xs" className="w-10 h-10 rounded-full bg-gray-100">
          <ChevronRight size={24} color="#666" />
        </Button>
      </View>

      <Modal
        visible={menuItemIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuItemIndex(null)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/30"
          onPress={() => setMenuItemIndex(null)}
        >
          <Pressable className="bg-white rounded-t-3xl px-5 pt-3 pb-8" onPress={() => {}}>
            <View className="self-center w-10 h-1 rounded-full bg-gray-300 mb-5" />
            <Text variant="subheading" className="mb-2">Opções da aula</Text>
            <Pressable className="py-4 border-b border-gray-100" onPress={openEditSheet}>
              <Text variant="body">Editar</Text>
            </Pressable>
            <Pressable
              className="py-4"
              onPress={isSelectedItemEmpty ? openEditSheet : deleteScheduleItem}
            >
              <Text
                variant="body"
                className={isSelectedItemEmpty ? "text-primary" : "text-red-600"}
              >
                {isSelectedItemEmpty ? "Adicionar aula" : "Excluir"}
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
            className="bg-white rounded-t-3xl px-3 pt-4 pb-8"
            onPress={() => {}}
          >
            <View className="flex-row items-center justify-between mb-5">
              <View className="w-10" />
              <Text variant="subheading">
                {editingItemIndex === null ? "Adicionar Matéria" : "Editar Matéria"}
              </Text>
              <Pressable
                className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                onPress={() => setIsAddSheetOpen(false)}
                accessibilityLabel="Fechar"
              >
                <X size={22} color="#111" />
              </Pressable>
            </View>

            <Text variant="caption" className="mb-1">selecione uma matéria</Text>
            <View className="relative z-10">
              <Pressable
                className="h-11 border border-gray-200 rounded-lg px-3 flex-row items-center justify-between"
                onPress={() => setIsSubjectPickerOpen((open) => !open)}
              >
                <Text variant="caption" className="text-black">{selectedSubject}</Text>
                <ChevronDown size={22} color="#111" />
              </Pressable>
              {isSubjectPickerOpen && (
                <View className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {SUBJECTS.map((subject) => (
                    <Pressable
                      key={subject}
                      className="px-3 py-3 border-b border-gray-100"
                      onPress={() => {
                        setSelectedSubject(subject);
                        setIsSubjectPickerOpen(false);
                      }}
                    >
                      <Text variant="caption" className="text-black">{subject}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Text variant="caption" className="mt-5 mb-1">selecione um dia</Text>
            <View className="flex-row gap-1">
              {DAYS.map((day, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedDay(index)}
                  className={`flex-1 h-11 rounded-lg border items-center justify-center ${
                    selectedDay === index ? "bg-green-200 border-green-600" : "border-gray-200"
                  }`}
                >
                  <Text variant="caption" className={selectedDay === index ? "text-black font-medium" : "text-gray-500"}>
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text variant="caption" className="mt-5 mb-1">selecione uma aula</Text>
            <View className="flex-row gap-1">
              {LESSONS.map((lesson) => (
                <Pressable
                  key={lesson}
                  onPress={() => setSelectedLesson(lesson)}
                  className={`flex-1 h-11 rounded-lg border items-center justify-center ${
                    selectedLesson === lesson ? "bg-green-200 border-green-600" : "border-gray-200"
                  }`}
                >
                  <Text variant="caption" className={selectedLesson === lesson ? "text-black font-medium" : "text-gray-500"}>
                    {lesson}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              className="mt-5 h-13 rounded-lg bg-primary flex-row items-center justify-center gap-2"
              onPress={saveScheduleItem}
            >
                <Plus size={24} color="#fff" />
                <Text className="text-white font-[Poppins-Regular]">
                  {editingItemIndex === null ? "Adicionar" : "Salvar"}
                </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
