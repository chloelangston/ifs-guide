export function formatTime() {
    const now = new Date();
    return now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
}