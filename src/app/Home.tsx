import { View } from "react-native";
import "../../global.css";
import { BottomMenu, Button, Card, CardContent, CardHeader, ScheduleItem, Text } from "../components";

export default function Home() {
  return (
    <View className="flex-1 bg-[#0B6878] px-6 pt-14">
        <Text variant="subheading" className="text-white">
          Olá! Fulano
        </Text>
        <Text variant="caption" className="text-white mt-2">
          Acompanhe o horário de suas aulas facilmente
        </Text>
        <Card className="mt-10 rounded-xl bg-background border-0">
          <CardHeader className="mb-2">
              <View className="flex-row items-center justify-between">
                    
                <Text variant="subheading"className="text-black">
                  Horários
                </Text>
                <Button variant="outline"size="xs" className="rounded-full px-3 py-1">
                  Ver todas as aulas →
                </Button>
              </View>
              <Text variant="caption"className="text-gray-500 mt-1">
              Segunda feira
              </Text>
          </CardHeader>

      <CardContent className="bg-gray-200 rounded-2xl p-2">
        <ScheduleItem
          startTime="13:20h"
          endTime="15:00h"
          subject="Projeto Integrador I"
          teacher="Glauco Todesco"
          location="Lab. 03"
          accentColor="#006B21"
        />
        <ScheduleItem
          startTime="15:00h"
          endTime="16:50h"
          subject="Banco de Dados"
          teacher="Prof. Renato"
          location="Lab. 03"
          accentColor="#0B6878"
        />
      </CardContent>
    </Card>
      <BottomMenu />
    </View>
  );
}