import { MESSAGE_TYPE } from "../core/constant";

export class MessageFormat {
  static format(
    type: MESSAGE_TYPE,
    userId: string,
    action: string,
    data: any,
  ): string {
    const message = {
      type: type,
      userId: userId,
      action: action,
      data: data,
    };

    return JSON.stringify(message);
  }
}
