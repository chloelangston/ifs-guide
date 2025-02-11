/**
 * @param {string} data
 */
export function separateTextAndJson(data) {
    console.log("Original data: ", data);

    // Extract the JSON block using regex
    const jsonMatch = data.match(/```json([\s\S]*?)```/);

    if (!jsonMatch) {
        console.log("No JSON block found in the string");
        return {
            text: data, // If no JSON, return the whole data as text
            json: null
        };
    }

    let jsonString = jsonMatch[1]; // The raw JSON string (escaped)
    console.log("Extracted raw JSON string: ", jsonString);

    // Unescape and clean the JSON string
    try {
        jsonString = jsonString.replace(/\\n/g, '') // Remove newline escape sequences
            .replace(/\\"/g, '"') // Convert escaped quotes to normal quotes
            .trim(); // Remove leading/trailing whitespace
    } catch (err) {
        console.error("Failed to clean JSON string:", err);
        return {
            text: data,
            json: null
        };
    }

    console.log("Cleaned JSON string: ", jsonString);

    let jsonData;
    try {
        // Parse the cleaned JSON string
        jsonData = JSON.parse(jsonString);
    } catch (err) {
        console.error("Failed to parse JSON:", err);
        return {
            text: data,
            json: null
        };
    }

    // Extract the surrounding text (everything before and after the JSON block)
    const textBeforeJson = data.substring(0, jsonMatch.index).trim();
    console.log("textBeforeJson: ", textBeforeJson)

    const test = data.substring(0, 4).trim();
    console.log("test: ", test)

    const textAfterJson = data.substring(jsonMatch.index ? jsonMatch.index + jsonMatch[0].length : 0).trim();
    const surroundingText = `${textBeforeJson} ${textAfterJson}`.trim();
    // const surroundingText = `${textAfterJson}`.trim();


    console.log("Extracted text: ", surroundingText);
    console.log("jsonData: ", jsonData);

    return {
        text: surroundingText,
        json: jsonData
    };
}

