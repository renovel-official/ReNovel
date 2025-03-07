async function getFormattedDate(format: string): Promise<string> {
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

export { getFormattedDate };
