import * as cookie from 'cookie';

/**
 * @param {any} part
 */
export function savePartToCookies(part: any) {
    let savedParts = getPartsFromCookies();
    savedParts.push(part);
    document.cookie = cookie.serialize('parts', JSON.stringify(savedParts), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });
}

export function getPartsFromCookies() {
    const cookies = cookie.parse(document.cookie || '');
    return cookies.parts ? JSON.parse(cookies.parts) : [];
}
