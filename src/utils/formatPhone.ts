export const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let result = "";

    if (digits.length > 0) result += "+7 ";
    if (digits.length >= 1) result += "(" + digits.slice(1, 4);
    if (digits.length >= 4) result += ") " + digits.slice(4, 7);
    if (digits.length >= 7) result += "-" + digits.slice(7, 9);
    if (digits.length >= 9) result += "-" + digits.slice(9, 11);

    return result;
};
