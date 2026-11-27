
import {
    Modal,
    Pressable,
    View,
} from "react-native";

import { Text, Button } from "../index";
import { useAppTheme } from "../../theme/ThemeContext";

import type { AcademicSelection } from "../../services/yearTransition";

interface NextTurma {
    id: number;
    codigo: string;
    periodo: number;
    ano: number;
    curso: { id: number };
}

interface YearTransitionModalProps {
    visible: boolean;
    current: AcademicSelection;
    nextTurma: NextTurma;
    onConfirm: () => void;
    onDismiss: () => void;
}

export default function YearTransitionModal({
    visible,
    current,
    nextTurma,
    onConfirm,
    onDismiss,
}: YearTransitionModalProps) {
    const { colors, darkMode } = useAppTheme();

    // Define o nome da etapa pelo periodo do curso
    const unidade = current.periodicidade.toLowerCase().includes("anual")
        ? "ano"
        : current.periodicidade.toLowerCase().includes("semestral")
            ? "semestre"
            : "período";

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View
                className="flex-1 justify-center items-center px-6"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <View
                    className="w-full rounded-2xl p-6 gap-4"
                    style={{ backgroundColor: colors.surface }}
                >
                    <Text
                        variant="heading"
                        style={{ color: colors.text, fontSize: 22 }}
                    >
                        Novo período disponível!
                    </Text>

                    <Text style={{ color: colors.textMuted, lineHeight: 22 }}>
                        Uma nova etapa do seu curso está disponível.
                        Deseja atualizar sua seleção acadêmica?
                    </Text>

                    <View
                        className="rounded-lg p-4 gap-3"
                        style={{
                            backgroundColor: darkMode
                                ? colors.background
                                : "#F1F5F9",
                        }}
                    >
                        <View>
                            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                                TURMA ATUAL
                            </Text>
                            <Text style={{ color: colors.text, fontWeight: "600" }}>
                                {current.periodo}º {unidade} · {current.turmaCodigo}
                            </Text>
                        </View>

                        <View>
                            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                                NOVA TURMA
                            </Text>
                            <Text style={{ color: colors.text, fontWeight: "600" }}>
                                {nextTurma.periodo}º {unidade} · {nextTurma.codigo}
                            </Text>
                            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                                Ano letivo: {nextTurma.ano}
                            </Text>
                        </View>
                    </View>

                    <Button onPress={onConfirm}>
                        Trocar de período
                    </Button>

                    <Pressable
                        onPress={onDismiss}
                        className="items-center py-2"
                    >
                        <Text style={{ color: colors.danger, fontWeight: "600" }}>
                            Negar
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
