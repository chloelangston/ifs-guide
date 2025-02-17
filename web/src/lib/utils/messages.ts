export function formatMessage(text: string | null | undefined): string {
    if (!text || typeof text !== 'string') {
        console.error('formatMessage received invalid text:', text);
        return '';
    }

    // Convert bold markdown (**word**) into <strong>word</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert numbered lists (e.g., "1. Item" -> <ol><li>Item</li></ol>)
    text = text.replace(/(\d+)\. (.*?)(?=\n|$)/g, '<p>$2</p>'); // Convert to list items

    // Convert unordered lists (e.g., "- Item" -> <ul><li>Item</li></ul>)
    text = text.replace(/- (.*?)(?=\n|$)/g, '<p>$1</p>'); // Convert to list items

    // Wrap lists in <ul> or <ol> if they exist
    if (text.includes('<li>')) {
        text = text.replace(/(<li>.*?<\/li>)+/gs, '<div>$&</div>'); // Wrap in <ul>
    }

    return text.replace(/\n/g, ''); // Preserve line breaks
}