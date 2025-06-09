export const normalizePhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("7")) return digits;
    if (digits.startsWith("8")) return "7" + digits.slice(1);
    if (digits.length === 10) return "7" + digits;
    return digits;
};
