import {
    ArrowLeft,
    Cable,
    MapPin,
} from "lucide-react-native";
import {
    Card,
    CardContent,
    CardHeader,
    ScheduleItem,
    Text,
} from "../../components/";

import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/ThemeContext";

export default function ClassDetails() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 24,
        }}
      >
        {/* CABEÇALHO */}
        <View className="flex-row items-center h-12">
          <Pressable
            onPress={() => router.back()}
            className="w-9 h-9 items-center justify-center rounded-full"
            hitSlop={8}
          >
            <ArrowLeft
              size={20}
              color={colors.text}
              strokeWidth={2}
            />
          </Pressable>

          <Text
            variant="caption"
            className="ml-3"
            style={{ color: colors.textMuted }}
          >
            Salas /{" "}
            <Text
              variant="caption"
              style={{ color: colors.text }}
            >
              Lab. 1
            </Text>
          </Text>
        </View>

        {/* INFORMAÇÕES DA SALA */}
        <View className="mb-3">
          <Text
            variant="body"
            className="font-semibold"
            style={{ color: colors.text }}
          >
            Laboratório de informática 01
          </Text>

          <View className="flex-row items-center mt-1.5 gap-2">
            {/* Status */}
            <View
              className="px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: colors.danger,
              }}
            >
              <Text
                variant="caption"
                className="font-medium"
                style={{ color: colors.text }}
              >
                Ocupado
              </Text>
            </View>

            {/* Prédio */}
            <View className="flex-row items-center">
              <MapPin
                size={12}
                color={colors.textMuted}
                strokeWidth={2}
              />

              <Text
                variant="caption"
                className="ml-1"
                style={{ color: colors.textMuted }}
              >
                Prédio 01
              </Text>
            </View>

            <Text
              variant="caption"
              style={{ color: colors.textMuted }}
            >
              Andar 3
            </Text>
          </View>
        </View>

    {/* card - equipamentos */}
        <View
          className="rounded-xl p-3 mb-3"
          style={{
            backgroundColor: colors.surfaceAlt,
          }}
        >
          <View className="flex-row items-center mb-3">
            <Cable
              size={16}
              color={colors.text}
              strokeWidth={2}
            />

            <Text
              variant="body"
              className="font-semibold ml-2"
              style={{ color: colors.text }}
            >
              Equipamentos
            </Text>
          </View>

          <View className="gap-2.5">
    {/* Wi-Fi */}
            <View
              className="flex-row items-center rounded-lg px-2 h-[38px] border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text
                variant="label"
                style={{ color: colors.text }}
              >
                Wi-fi
              </Text>
            </View>

    {/* Televisões */}
            <View
              className="flex-row items-center rounded-lg px-2 h-[38px] border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text
                variant="label"
                style={{ color: colors.text }}
              >
                Televisões
              </Text>
            </View>

    {/* Cadeiras */}
            <View
              className="flex-row items-center rounded-lg px-2 h-[38px] border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text
                variant="label"
                style={{ color: colors.text }}
              >
                Cadeiras
              </Text>
            </View>

    {/* Computadores */}
            <View
              className="flex-row items-center rounded-lg px-2 h-[38px] border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text
                variant="label"
                style={{ color: colors.text }}
              >
                Computadores
              </Text>
            </View>
          </View>
        </View>

    {/*Card - lab1*/}
        <View className="mb-2">
            {/* CARD — LAB 01 */}
            <Card className="mb-3 w-full rounded-xl bg-background border-gray-300">
                <CardHeader className="mb-1 w-full">
                <Text
                    variant="caption"
                    className="font-semibold"
                    style={{ color: colors.text }}
                >
                    LAB 01
                </Text>
                </CardHeader>

                <CardContent className="w-full p-2">
                <ScheduleItem
                    startTime="13:20h"
                    endTime="15:00h"
                    subject="Projeto integrador I"
                    teacher="Glauco Todesco"
                    location=""
                    accentColor={colors.accent}
                />
                </CardContent>
            </Card>

    {/*Card - segunda-feira*/}
            <Card className="w-full rounded-xl bg-background border-gray-300">
                <CardHeader className="mb-1 w-full">
                <Text
                    variant="caption"
                    className="font-semibold"
                    style={{ color: colors.text }}
                >
                    Segunda-feira
                </Text>
                </CardHeader>

                <CardContent className="w-full p-2">
                <View className="gap-2">
                    <ScheduleItem
                    startTime="13:20h"
                    endTime="15:00h"
                    subject="Horário Livre"
                    teacher=""
                    location=""
                    isEmpty
                    accentColor={colors.accent}
                    />

                    <ScheduleItem
                    startTime="15:00h"
                    endTime="16:50h"
                    subject="Horário Livre"
                    teacher=""
                    location=""
                    isEmpty
                    accentColor={colors.danger}
                    />

                    <ScheduleItem
                    startTime="16:50h"
                    endTime="17:10h"
                    subject="Intervalo"
                    teacher=""
                    location=""
                    isEmpty
                    accentColor={colors.accent}
                    />

                    <ScheduleItem
                    startTime="17:10h"
                    endTime="19:00h"
                    subject="Banco de Dados"
                    teacher="Prof. Renato"
                    location="Lab. 03"
                    accentColor={colors.accent}
                    />
                </View>
                </CardContent>
            </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
