import { globalStyles } from "@/styles/global";
import { ScrollView, Text } from "react-native";

import HomeHeader from "@/components/HomeHeader";
import SearchBar from "@/components/SearchBar";

export default function HomeScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome to Word Bank!</Text>
      <HomeHeader />
      <SearchBar />
    </ScrollView>
  );
}