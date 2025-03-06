type NovelGenre =
  | "action"         // 現代ファンタジー
  | "fantasy"        // 異世界ファンタジー
  | "love"           // 現代恋愛
  | "fantasy-love"   // 異世界恋愛
  | "sf"             // SF
  | "horror"         // ホラー
  | "mystery"        // ミステリー
  | "adventure"      // 冒険
  | "comedy"         // コメディ
  | "thriller"       // スリラー
  | "history"        // 歴史
  | "othor";         // その他

const NovelGenreList: NovelGenre[] = [
  "action",
  "fantasy",
  "love",
  "fantasy-love",
  "sf",
  "horror",
  "mystery",
  "adventure",
  "comedy",
  "thriller",
  "history",
  "othor",
];


export default NovelGenre;
export { NovelGenreList };