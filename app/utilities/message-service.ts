import { FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class MessageService {
    static showSuccess(message: string, feedback) {
        feedback.show({
            message: message,
            messageColor: new Color("#FFFFFF"),
            messageSize: 16,
            position: FeedbackPosition.Top,
            type: FeedbackType.Success,
            duration: 3000,
            onTap: () => { feedback.hide() }
        });
    }

    static showError(message: string, feedback) {
        feedback.show({
            message: message,
            messageColor: new Color("#FFFFFF"),
            messageSize: 16,
            position: FeedbackPosition.Top,
            type: FeedbackType.Error,
            duration: 3000,
            backgroundColor: new Color("#C91C1C"),
            onTap: () => { feedback.hide() }
        });
    }
}