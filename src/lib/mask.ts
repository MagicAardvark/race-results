export const mask = (
    text: string,
    unmaskedStartChars = 4,
    unmaskedEndChars = 4,
    options?: {
        maskCharacter?: string;
    }
) => {
    if (text.length <= unmaskedStartChars + unmaskedEndChars) {
        return text;
    }

    const maskChar = options?.maskCharacter ?? "*";

    const regex = new RegExp(
        `(.{${unmaskedStartChars}})(.+)(.{${unmaskedEndChars}})`
    );

    return text.replace(regex, (_, p1, p2, p3) => {
        const masked = maskChar.repeat(p2.length);
        return `${p1}${masked}${p3}`;
    });
};
