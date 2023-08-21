export function msToFormatted(ms: number): string {
    let formatted = new Date(ms).toISOString().slice(11, 19)

    const [hour, minute, second] = formatted.split(":")

    if(hour === "00") formatted = `${minute}:${second}`

    if(minute === "00") formatted = second

    return formatted
}