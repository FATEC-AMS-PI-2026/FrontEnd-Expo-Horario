import { ScrollView, View } from "react-native";
import { LucideChevronLeft } from "lucide-react-native";
import { Text, Button } from "../components";

export default function PeriodSelectionScreen() {
    return (
        <ScrollView className="flex-1 bg-white p-4 w-full items-center">
            <View>
                <Button
                    className="btn w-fit justify-center align-center"
                    variant="secondary"
                    size="sm"
                >
                    <View className="flex-row gap-1 items-center">
                        <LucideChevronLeft size={16} />
                        <Text className="text-primary m-0">Voltar</Text>
                    </View>
                </Button>
            </View>
            <View className="w-full h-[12rem] justify-items-center items-center justify-center">
                <Text className="text-center" variant="heading">
                    Escolha seu período
                </Text>
                <Text className="text-center" variant="body">
                    Selecione o período que está cursando agora.
                </Text>
            </View>
            <View className="flex flex-col justify-center gap-2">
                <Button className="btn" variant="outline">
                    1° ano
                </Button>
                <Button className="btn" variant="outline">
                    2° ano
                </Button>
                <Button className="btn" variant="outline">
                    3° ano
                </Button>
                <Button className="btn" variant="outline">
                    4° ano
                </Button>
            </View>
        </ScrollView>
    );
}
