import { View } from "react-native";
import "../../../global.css";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    ScheduleItem,
    Text
} from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

export default function Home() {
    const { colors, darkMode } = useAppTheme();

    return (
        <View className="flex-1 px-3 pt-14 pb-24" style={{ backgroundColor: darkMode ? colors.backgroundAlt : colors.background }}>
            <Text variant="subheading" style={{ color: colors.text }}>
                Olá! Fulano
            </Text>
            <Text variant="caption" className="mt-2" style={{ color: colors.textMuted }}>
                Acompanhe o horário de suas aulas facilmente
            </Text>

            {/* Adicionei 'w-full' para garantir que o Card ocupe a largura máxima permitida */}
            <Card className="mt-10 w-full rounded-xl bg-background border-gray-300">
                <CardHeader className="mb-1 w-full">
                    {/* Adicionei 'flex-wrap' e 'gap-2' para o botão descer caso falte espaço */}
                    <View className="flex-row items-center justify-between flex-wrap gap-2">
                        <Text variant="subheading" className="text-black">
                            Horários
                        </Text>
                        {/* Adicionei 'shrink-0' para o botão não ser esmagado */}
                        <Button
                            variant="outline"
                            size="xs"
                            className="rounded-full px-3 py-1 shrink-0"
                        >
                            Ver todas as aulas →
                        </Button>
                    </View>
                    <Text variant="caption" className="mt-1" style={{ color: colors.textMuted }}>
                        Segunda feira
                    </Text>
                </CardHeader>

                {/* Adicionei 'w-full' e 'flex-1' para o conteúdo se adaptar à largura */}
                <CardContent className="rounded-2xl p-2 w-full flex-1" style={{ backgroundColor: darkMode ? colors.backgroundAlt : "#e1e8f6" }}>
                    {/* Adicionei 'mb-2' para dar respiro entre os itens e 'w-full' */}
                    <View className="w-full mb-2">
                        <ScheduleItem
                            startTime="13:20h"
                            endTime="15:00h"
                            subject="Projeto Integrador I"
                            teacher="Glauco Todesco"
                            location="Lab. 03"
                            accentColor="#069634"
                        />
                    </View>

                    <View className="w-full">
                        <ScheduleItem
                            startTime="15:00h"
                            endTime="16:50h"
                            subject="Banco de Dados"
                            teacher="Renato"
                            location="Lab. 03"
                            accentColor="#067f95"
                        />
                    </View>
                </CardContent>
            </Card>
        </View>
    );
}
