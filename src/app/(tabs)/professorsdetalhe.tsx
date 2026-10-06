import { View, ScrollView, Image, Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

import "../../../global.css";

import { Text } from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

export default function ProfessorsDetalhe() {
    const { colors } = useAppTheme();
    const { nome, materias } = useLocalSearchParams<{
        nome?: string;
        materias?: string;
    }>();

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>

            <ScrollView
                className="flex-1 px-4"
                contentContainerClassName="pb-28"
                showsVerticalScrollIndicator={false}
            >
                <View className="h-[48px] flex-row items-center justify-center">
                    <Pressable
                        className="absolute left-4"
                        accessibilityRole="button"
                        accessibilityLabel="Voltar para professores"
                        hitSlop={8}
                        onPress={() => router.navigate("/(tabs)/professors")}
                    >
                        <ArrowLeft size={22} color={colors.accent} />
                    </Pressable>

                    <Text className="text-[14px] font-medium">
                        Professores
                    </Text>
                </View>


                <View className="flex-row items-center mt-2 mb-4">

                    <Image
                        source={require("../../../assets/images/professor.png")}
                        className="w-[59px] h-[59px] rounded-lg"
                    />

                    <View className="ml-3 flex-1">
                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Professor
                        </Text>

                        <Text className="text-[17px] font-bold">
                            {nome ?? "Professor"}
                        </Text>

                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            {materias ?? ""}
                        </Text>
                    </View>

                </View>




                <Text className="text-[9px] font-semibold mb-2">
                    Segunda Feira
                </Text>



                <View className="w-full h-[64px] border rounded-lg mb-2 flex-row"
                    style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>


                    <View className="w-[5px] h-[46px] rounded-full ml-1 mt-[8px]" style={{ backgroundColor: colors.border }} />


                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            13:20h
                        </Text>

                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            15:00h
                        </Text>
                    </View>


                    <View className="flex-1 justify-center">

                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium" style={{ color: colors.accent }}>
                            1º ADS
                        </Text>

                    </View>


                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
                            Lab. 03
                        </Text>
                    </View>

                </View>



                <View className="w-full h-[64px] border rounded-lg mb-2 flex-row"
                    style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>

                    <View className="w-[5px] h-[46px] rounded-full ml-1 mt-[8px]" style={{ backgroundColor: colors.border }} />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            15:00h
                        </Text>

                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            16:50h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium" style={{ color: colors.accent }}>
                            1º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
                            Lab. 03
                        </Text>
                    </View>

                </View>



                <View className="w-full h-[64px] border rounded-lg mb-2 flex-row"
                    style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>

                    <View className="w-[5px] h-[46px] rounded-full ml-1 mt-[8px]" style={{ backgroundColor: colors.border }} />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            17:00h
                        </Text>

                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            18:40h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium" style={{ color: colors.accent }}>
                            2º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
                            Lab. 02
                        </Text>
                    </View>

                </View>




                <Text className="text-[9px] font-semibold mt-1 mb-2">
                    Terça Feira
                </Text>



                <View className="w-full h-[64px] border rounded-lg mb-2 flex-row"
                    style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>

                    <View className="w-[5px] h-[46px] rounded-full ml-1 mt-[8px]" style={{ backgroundColor: colors.border }} />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            13:20h
                        </Text>

                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Fatec Sorocaba
                        </Text>

                        <Text className="text-[13px] font-medium">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium" style={{ color: colors.accent }}>
                            2º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
                            Lab. 06
                        </Text>
                    </View>

                </View>


                
                <View className="w-full h-[64px] border rounded-lg mb-2 flex-row"
                    style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>

                    <View className="w-[5px] h-[46px] rounded-full ml-1 mt-[8px]" style={{ backgroundColor: colors.accent }} />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            13:20h
                        </Text>

                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Fatec Sorocaba
                        </Text>

                        <Text className="text-[13px] font-medium">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium" style={{ color: colors.accent }}>
                            3º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
                            Lab. 04
                        </Text>
                    </View>

                </View>



                <View className="w-full h-[64px] border rounded-lg mb-2 flex-row"
                    style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>

                    <View className="w-[5px] h-[46px] rounded-full ml-1 mt-[8px]" style={{ backgroundColor: colors.border }} />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            13:20h
                        </Text>

                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Fatec Sorocaba
                        </Text>

                        <Text className="text-[13px] font-medium">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium" style={{ color: colors.accent }}>
                            3º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
                            Lab. 04
                        </Text>
                    </View>

                </View>




                <Text className="text-[9px] font-semibold mt-1 mb-2">
                    Quarta Feira
                </Text>

                <View className="w-full h-[64px] border rounded-lg mb-2 flex-row"
                    style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>

                    <View className="w-[5px] h-[46px] rounded-full ml-1 mt-[8px]" style={{ backgroundColor: colors.border }} />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            13:20h
                        </Text>

                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium" style={{ color: colors.accent }}>
                            1º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
                            Lab. 03
                        </Text>
                    </View>

                </View>

            </ScrollView>
        </View>

    );
}
