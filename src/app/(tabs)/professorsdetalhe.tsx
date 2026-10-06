import { View, ScrollView, Image, Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";

import "../../../global.css";

import { Text } from "../../components";

export default function Professores() {
    return (
        <View className="flex-1 bg-white">

            <ScrollView
                className="flex-1 px-4"
                contentContainerClassName="pb-28"
                showsVerticalScrollIndicator={false}
            >
                <View className="h-[48px] flex-row items-center justify-center">
                    <Pressable className="absolute left-4">
                        <ArrowLeft size={22} color="#0B6878" />
                    </Pressable>

                    <Text className="text-[14px] font-medium text-black">
                        Professores
                    </Text>
                </View>


                <View className="flex-row items-center mt-2 mb-4">

                    <Image
                        source={require("../../../assets/images/professor.png")}
                        className="w-[59px] h-[59px] rounded-lg"
                    />

                    <View className="ml-3">
                        <Text className="text-[9px] text-gray-500">
                            Professor
                        </Text>

                        <Text className="text-[17px] font-bold text-black">
                            Glauco Tonesco
                        </Text>

                        <Text className="text-[9px] text-gray-500">
                            Projeto Integrador
                        </Text>
                    </View>

                </View>




                <Text className="text-[9px] font-semibold text-black mb-2">
                    Segunda Feira
                </Text>



                <View className="w-full h-[64px] bg-[#F5F5F5] border border-[#D5D5D5] rounded-lg mb-2 flex-row">


                    <View className="w-[5px] h-[46px] bg-[#DADADA] rounded-full ml-1 mt-[8px]" />


                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px] text-gray-500">
                            13:20h
                        </Text>

                        <Text className="text-[10px] text-gray-500">
                            15:00h
                        </Text>
                    </View>


                    <View className="flex-1 justify-center">

                        <Text className="text-[9px] text-gray-400">
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium text-black">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium text-[#006B7A]">
                            1º ADS
                        </Text>

                    </View>


                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold text-[#006B7A]">
                            Lab. 03
                        </Text>
                    </View>

                </View>



                <View className="w-full h-[64px] bg-[#F5F5F5] border border-[#D5D5D5] rounded-lg mb-2 flex-row">

                    <View className="w-[5px] h-[46px] bg-[#DADADA] rounded-full ml-1 mt-[8px]" />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px] text-gray-500">
                            15:00h
                        </Text>

                        <Text className="text-[10px] text-gray-500">
                            16:50h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px] text-gray-400">
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium text-black">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium text-[#006B7A]">
                            1º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold text-[#006B7A]">
                            Lab. 03
                        </Text>
                    </View>

                </View>



                <View className="w-full h-[64px] bg-[#F5F5F5] border border-[#D5D5D5] rounded-lg mb-2 flex-row">

                    <View className="w-[5px] h-[46px] bg-[#DADADA] rounded-full ml-1 mt-[8px]" />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px] text-gray-500">
                            17:00h
                        </Text>

                        <Text className="text-[10px] text-gray-500">
                            18:40h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px] text-gray-400">
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium text-black">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium text-[#006B7A]">
                            2º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold text-[#006B7A]">
                            Lab. 02
                        </Text>
                    </View>

                </View>




                <Text className="text-[9px] font-semibold text-black mt-1 mb-2">
                    Terça Feira
                </Text>



                <View className="w-full h-[64px] bg-[#F5F5F5] border border-[#D5D5D5] rounded-lg mb-2 flex-row">

                    <View className="w-[5px] h-[46px] bg-[#DADADA] rounded-full ml-1 mt-[8px]" />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px] text-gray-500">
                            13:20h
                        </Text>

                        <Text className="text-[10px] text-gray-500">
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px] text-gray-400">
                            Fatec Sorocaba
                        </Text>

                        <Text className="text-[13px] font-medium text-black">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium text-[#006B7A]">
                            2º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold text-[#006B7A]">
                            Lab. 06
                        </Text>
                    </View>

                </View>


                
                <View className="w-full h-[64px] bg-[#F5F5F5] border border-[#D5D5D5] rounded-lg mb-2 flex-row">

                    <View className="w-[5px] h-[46px] bg-[#00A419] rounded-full ml-1 mt-[8px]" />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px] text-gray-500">
                            13:20h
                        </Text>

                        <Text className="text-[10px] text-gray-500">
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px] text-gray-400">
                            Fatec Sorocaba
                        </Text>

                        <Text className="text-[13px] font-medium text-black">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium text-[#006B7A]">
                            3º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold text-[#006B7A]">
                            Lab. 04
                        </Text>
                    </View>

                </View>



                <View className="w-full h-[64px] bg-[#F5F5F5] border border-[#D5D5D5] rounded-lg mb-2 flex-row">

                    <View className="w-[5px] h-[46px] bg-[#DADADA] rounded-full ml-1 mt-[8px]" />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px] text-gray-500">
                            13:20h
                        </Text>

                        <Text className="text-[10px] text-gray-500">
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px] text-gray-400">
                            Fatec Sorocaba
                        </Text>

                        <Text className="text-[13px] font-medium text-black">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium text-[#006B7A]">
                            3º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold text-[#006B7A]">
                            Lab. 04
                        </Text>
                    </View>

                </View>




                <Text className="text-[9px] font-semibold text-black mt-1 mb-2">
                    Quarta Feira
                </Text>

                <View className="w-full h-[64px] bg-[#F5F5F5] border border-[#D5D5D5] rounded-lg mb-2 flex-row">

                    <View className="w-[5px] h-[46px] bg-[#DADADA] rounded-full ml-1 mt-[8px]" />

                    <View className="w-[45px] justify-between py-[9px] ml-1">
                        <Text className="text-[10px] text-gray-500">
                            13:20h
                        </Text>

                        <Text className="text-[10px] text-gray-500">
                            15:00h
                        </Text>
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[9px] text-gray-400">
                            Fatec Itu Dom Amaury Castanho
                        </Text>

                        <Text className="text-[13px] font-medium text-black">
                            Projeto integrador I
                        </Text>

                        <Text className="text-[10px] font-medium text-[#006B7A]">
                            1º ADS
                        </Text>
                    </View>

                    <View className="justify-end pb-[9px] pr-2">
                        <Text className="text-[11px] font-semibold text-[#006B7A]">
                            Lab. 03
                        </Text>
                    </View>

                </View>

            </ScrollView>
        </View>

    );
}