import { Book } from "@/models/book";
import { Fonts } from "@/styles/global";
import { coverUri } from "@/utils/cover-uri";
import { openBook } from "@/utils/open-book";
import { Pressable, Text, View } from "react-native";

import CoverImage from "./CoverImage";
import CoverPlaceholder from "./CoverPlaceholder";

export default function BookItem({ book }: { book: Book }) {
    const { key, title, author_name, first_publish_year, cover_i } = book;
    return (
        <Pressable
            className="flex-row gap-3 border-b border-border py-2.5"
            onPress={() =>
                openBook({
                    key,
                    title,
                    author: author_name?.slice(0, 2).join(", ") ?? "",
                    year: first_publish_year?.toString() ?? "",
                    cover_i: cover_i?.toString() ?? "",
                })
            }
        >
            <CoverImage uri={coverUri(cover_i, 'S')} className="h-16 w-12 rounded" placeholder={<CoverPlaceholder size={20} />} />
            <View className="flex-1 justify-center gap-1">
                <Text className="text-[15px] font-semibold text-fg" style={{ fontFamily: Fonts.serif }} numberOfLines={2}>{title}</Text>
                {author_name && (
                    <Text className="text-[13px] text-secondary" numberOfLines={1}>
                        {author_name.slice(0, 2).join(", ")}
                    </Text>
                )}
                {first_publish_year && (
                    <Text className="text-xs text-muted">{first_publish_year}</Text>
                )}
            </View>
        </Pressable>
    );
}
