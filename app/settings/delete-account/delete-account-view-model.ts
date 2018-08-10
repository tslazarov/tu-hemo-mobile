import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class DeleteAccountViewModel extends Observable {
    // labels
    deleteAccount: string;
    passwordHint: string;
    delete: string;
    warning: string;
    warningMessage: string;
    confirm: string;
    feedback: Feedback;

    @ObservableProperty() password: string;
    @ObservableProperty() visibilityMode: string;
    @ObservableProperty() visibilityModeFb: string;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.deleteAccount = TranslationService.localizeValue("deleteAccount", "delete-account-page", "label");
        this.passwordHint = TranslationService.localizeValue("passwordHint", "delete-account-page", "label");
        this.delete = TranslationService.localizeValue("delete", "delete-account-page", "label");
        this.warning = TranslationService.localizeValue("warning", "delete-account-page", "label");
        this.warningMessage = TranslationService.localizeValue("warningMessage", "delete-account-page", "label");
        this.confirm = TranslationService.localizeValue("confirm", "delete-account-page", "label");
    }

    validateEmptyPassword():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.password != 'undefined' && this.password)) {
            message = TranslationService.localizeValue("emptyPassword", "delete-account-page", "message");
            isValid = false;
        }

        if(!isValid) {
            this.feedback.show({
                message: message,
                messageColor: new Color("#FFFFFF"),
                messageSize: 16,
                position: FeedbackPosition.Top,
                type: FeedbackType.Error,
                duration: 3000,
                backgroundColor: new Color("#C91C1C"),
                onTap: () => { this.feedback.hide() }
              });
        }

        return isValid;
    }
}
