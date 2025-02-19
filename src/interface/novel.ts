import novelType from "@/types/novel";

interface Novel {
    id?: number;
    slug?: string;
    type?: novelType;

    title: string;
    phrase: string;
    point: string;
    description?: string;

    created_at?: string;
    updated_at?: string;
}

export default Novel;