export const calculateCursorPosition = (
        oldPos: number,
        oldValue: string,
        newValue: string
    ): number => {
        const oldDigitsBeforeCursor = oldValue
            .slice(0, oldPos)
            .replace(/\D/g, "").length;
        let digitCount = 0;

        for (let i = 0; i < newValue.length; i++) {
            if (/\d/.test(newValue[i])) digitCount++;
            if (digitCount >= oldDigitsBeforeCursor) return i + 1;
        }
        return newValue.length;
    };