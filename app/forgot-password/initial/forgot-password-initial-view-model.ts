import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback } from "nativescript-feedback";
import { MessageService } from "../../utilities/message-service";

export class ForgotPasswordInitialViewModel extends Observable {

    emailHint: string;
    next: string;
    resetPassword: string;
    feedback: Feedback;

    @ObservableProperty() email: string;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.emailHint = TranslationService.localizeValue("emailHint", "forgot-password-page", "label");
        this.resetPassword = TranslationService.localizeValue("resetPassword", "forgot-password-page", "label");
        this.next = TranslationService.localizeValue("next", "forgot-password-page", "label");
    }

    validateEmptyEmail():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.email != 'undefined' && this.email)) {
            
            message = TranslationService.localizeValue("emptyEmail", "forgot-password-page", "message");
            isValid = false;
        }

        if(!isValid) {
            MessageService.showError(message, this.feedback);
        }

        return isValid;
    }
}
