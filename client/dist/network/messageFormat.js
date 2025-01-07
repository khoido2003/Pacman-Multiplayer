export class MessageFormat {
    static format(type, userId, action, data) {
        const message = {
            type: type,
            userId: userId,
            action: action,
            data: data,
        };
        return JSON.stringify(message);
    }
}
