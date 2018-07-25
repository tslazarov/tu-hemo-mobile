import { Observable } from "data/observable";
import { ObservableProperty } from "../observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

export class RegisterUserViewModel extends Observable {
    // labels
    emailHint: string;
    passwordHint: string;
    confirmPasswordHint: string;
    next: string;

    @ObservableProperty() email: string;
    @ObservableProperty() password: string;
    @ObservableProperty() confirmPassword: string;
    feedback: Feedback;

    constructor() {
        super();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.emailHint = TranslationService.localizeValue("emailHint", "register-page", "label");
        this.passwordHint = TranslationService.localizeValue("passwordHint", "register-page", "label");
        this.confirmPasswordHint = TranslationService.localizeValue("confirmPasswordHint", "register-page", "label");
        this.next = TranslationService.localizeValue("next", "register-page", "label");
    }

    validateEmptyEmailOrPassword(email: string, password: string, confirmPassword: string):boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof email != 'undefined' && email)) {
            
            message = TranslationService.localizeValue("emptyEmail", "register-page", "message");
            isValid = false;
        } else if(!(typeof password != 'undefined' && password)) {
            
            message = TranslationService.localizeValue("emptyPassword", "register-page", "message");
            isValid = false;
        } else if(!(typeof confirmPassword != 'undefined' && confirmPassword)) {
            
            message = TranslationService.localizeValue("emptyConfirmPassword", "register-page", "message");
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
