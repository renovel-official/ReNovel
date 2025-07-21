import { metadata } from "@/app/layout";
import CreateNovelPagePc from "@/components/screen/pc/dashboard/new-novel";

export default async function CreateNovel() {
    metadata.title = "新規小説作成 / ReNovel";
    return (
        <CreateNovelPagePc />
    );
}