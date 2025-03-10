export default async function textToHtmlConvert(text: string): Promise<string> {
    const lines: string[] = text.split('\n');
    let html: string = '';

    lines.forEach((line: string, index: number) => {
        let processedLine: string = line;

        // ルビの処理
        processedLine = processedLine.replace(/｜(.*?)《(.*?)》/g, (match, p1, p2) => {
            return `<ruby>${p1}<rt>${p2}</rt></ruby>`;
        });

        // 一文字一文字の上に「・」を振る処理
        processedLine = processedLine.replace(/《《(.*?)》》/g, (match, p1) => {
            return p1.split('').map((char: string) => `<ruby>${char}<rt>・</rt></ruby>`).join('');
        });

        html += `<p id="p${index + 1}">${processedLine}</p>`;
    });

    return html;
}