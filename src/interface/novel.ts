import NovelGenre from "@/types/genre";
import NovelType from "@/types/novel";

interface Novel {
    id?: number;
    slug?: string;
    type?: NovelType;

    title: string;
    phrase: string;
    point: number;
    description: string;
    genre: NovelGenre;
    tags?: string[];

    created_at?: string;
    updated_at?: string;
}



export default Novel;