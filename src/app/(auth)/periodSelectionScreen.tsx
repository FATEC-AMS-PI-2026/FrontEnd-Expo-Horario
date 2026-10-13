import { router } from "expo-router";
import { LucideChevronLeft } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Button, Text } from "../../components";

import { useAppTheme } from "../../theme/ThemeContext";

export default function PeriodSelectionScreen() {
    const { colors } = useAppTheme();

    return (
        <ScrollView
            className="flex-1 p-4 w-full items-center"
            style={{ backgroundColor: colors.background }}
        >
            <View>
                <Button
                    className="btn w-26 justify-center align-center"
                    variant="secondary"
                    size="sm"
                    onPress={() => router.push("/chooseCourse")}
                >
                    <View className="flex-row gap-1 items-center">
                        <LucideChevronLeft size={16} />
                        <Text className="m-0" style={{ color: colors.text }}>
                            Voltar
                        </Text>
                    </View>
                </Button>
            </View>

            <View className="w-full h-[12rem] justify-items-center items-center justify-center">
                <Text className="text-center" variant="heading" style={{ color: colors.text }}>
                    Escolha seu período
                </Text>

                <Text className="text-center" variant="body" style={{ color: colors.textMuted }}>
                    Selecione o período que está cursando agora.
                </Text>
            </View>

            <View className="flex flex-col justify-center gap-2 w-full">
                <Button
                    className="btn"
                    variant="outline"
                    onPress={() => router.push("/home")}
                >
                    1° ano
                </Button>

                <Button
                    className="btn"
                    variant="outline"
                    onPress={() => router.push("/home")}
                >
                    2° ano
                </Button>

                <Button
                    className="btn"
                    variant="outline"
                    onPress={() => router.push("/home")}
                >
                    3° ano
                </Button>

                <Button
                    className="btn"
                    variant="outline"
                    onPress={() => router.push("/home")}
                >
                    4° ano
                </Button>
            </View>
        </ScrollView>
    );
}
