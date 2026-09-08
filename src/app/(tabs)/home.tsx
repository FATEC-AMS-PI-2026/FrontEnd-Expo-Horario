import { View } from "react-native";
import "../../../global.css";
import {
    BottomMenu,
    Button,
    Card,
    CardContent,
    CardHeader,
    ScheduleItem,
    Text,
} from "../../components";

export default function Home() {
    return (
        // Adicionei 'flex-1' e 'pb-24' para garantir que o conteúdo não fique escondido atrás do BottomMenu
        <View className="flex-1 bg-[#0B6878] px-3 pt-14 pb-24">
            <Text variant="subheading" className="text-white">
                Olá! Fulano
            </Text>
            <Text variant="caption" className="text-white mt-2">
                Acompanhe o horário de suas aulas facilmente
            </Text>

            {/* Adicionei 'w-full' para garantir que o Card ocupe a largura máxima permitida */}
            <Card className="mt-10 w-full rounded-xl bg-background border-0">
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
                    <Text variant="caption" className="text-gray-500 mt-1">
                        Segunda feira
                    </Text>
                </CardHeader>

                {/* Adicionei 'w-full' e 'flex-1' para o conteúdo se adaptar à largura */}
                <CardContent className="bg-gray-200 rounded-2xl p-2 w-full flex-1">
                    {/* Adicionei 'mb-2' para dar respiro entre os itens e 'w-full' */}
                    <View className="w-full mb-2">
                        <ScheduleItem
                            startTime="13:20h"
                            endTime="15:00h"
                            subject="Projeto Integrador I"
                            teacher="Glauco Todesco"
                            location="Lab. 03"
                            accentColor="#006B21"
                        />
                    </View>

                    <View className="w-full">
                        <ScheduleItem
                            startTime="15:00h"
                            endTime="16:50h"
                            subject="Banco de Dados"
                            teacher="Renato"
                            location="Lab. 03"
                            accentColor="#0B6878"
                        />
                    </View>
                </CardContent>
            </Card>
        </View>
    );
}
