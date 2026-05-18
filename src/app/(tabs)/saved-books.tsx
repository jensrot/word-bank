import { globalStyles } from "@/styles/global";
import { ScrollView, Text } from "react-native";

export default function Books() {
    return (
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.title}>Saved books</Text>
        </ScrollView>
    );
}