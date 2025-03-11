async function getFormattedDate(format: string = "YYYY/MM/DD HH:mm:ss"): Promise<string> {
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tokyo', // 日本時間（JST）
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24時間表示
    };

    const date = new Date();

    const formattedDate = new Intl.DateTimeFormat('ja-JP', options).format(date);

    // フォーマットを指定に合わせてカスタマイズする
    return format
        .replace('YYYY', formattedDate.split('/')[0]) // 年
        .replace('MM', formattedDate.split('/')[1]) // 月
        .replace('DD', formattedDate.split('/')[2].split(' ')[0]) // 日
        .replace('HH', formattedDate.split(' ')[1].split(':')[0]) // 時
        .replace('mm', formattedDate.split(' ')[1].split(':')[1]) // 分
        .replace('ss', formattedDate.split(' ')[1].split(':')[2]); // 秒
}

async function convertInputToTimeStamp(inputValue: string): Promise<string> {
    const date = new Date(inputValue);

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tokyo', // 日本時間（JST）
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24時間表示
    };

    return (new Intl.DateTimeFormat('ja-JP', options).format(date));
}

async function getNowDateNumber() {
    return Date.now() + (9 * 60 * 60 * 1000);
}

async function convertToJapanStamp(dateString: string): Promise<number> {
    // JST の日時を Date オブジェクトに変換
    const [datePart, timePart] = (await convertInputToTimeStamp(dateString)).split(" ");
    const [year, month, day] = datePart.split("/").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    // 日本時間（JST）を UTC に変換
    const date = new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second));

    // UTC基準のミリ秒単位のタイムスタンプを返す
    return date.getTime() + (9 * 60 * 60 * 1000);
}

async function convertNumberStampToString(dataNumber: number): Promise<string> {
    // UTC のタイムスタンプを Date オブジェクトに変換
    const date = new Date(dataNumber);

    // 日本時間（JST）に変換（9時間加算）
    date.setHours(date.getHours());

    // 年・月・日・時・分・秒を取得し、ゼロ埋め
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    // フォーマットして返す
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

export {
    getFormattedDate, 
    getNowDateNumber, 
    convertToJapanStamp, 
    convertInputToTimeStamp, 
    convertNumberStampToString 
};
