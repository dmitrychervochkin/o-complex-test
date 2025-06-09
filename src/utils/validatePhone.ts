export const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 11 && digits.startsWith("7");
};
