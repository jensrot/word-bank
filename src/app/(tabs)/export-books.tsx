import { globalStyles } from "@/styles/global";
import { ScrollView, Text } from "react-native";

export default function ExportBooks() {
    return (
        <ScrollView style={globalStyles.container}>
            <Text>This is where you can export your books.</Text>
        </ScrollView>
    );
}