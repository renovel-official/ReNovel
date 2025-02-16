import novelType from "@/types/novelType";

interface Novel {
    id?: number;
    slug?: string;
    type?: novelType;

    title: string;
    phrase: string;
    description?: string;

    created_at?: string;
    updated_at?: string;
}

export default Novel;