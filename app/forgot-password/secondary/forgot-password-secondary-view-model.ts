import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class ForgotPasswordSecondaryViewModel extends Observable {

    changePassword: string;
    resetCodeHint: string;
    passwordHint: string;
    confirmPasswordHint: string;
    change: string;
    feedback: Feedback;

    @ObservableProperty() correctResetCode: string;
    @ObservableProperty() resetCode: string;
    @ObservableProperty() password: string;
    @ObservableProperty() confirmPassword: string;
    @ObservableProperty() email: string;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.changePassword = TranslationService.localizeValue("changePassword", "forgot-password-page", "label");
        this.resetCodeHint = TranslationService.localizeValue("resetCodeHint", "forgot-password-page", "label");
        this.passwordHint = TranslationService.localizeValue("passwordHint", "forgot-password-page", "label");
        this.confirmPasswordHint = TranslationService.localizeValue("confirmPasswordHint", "forgot-password-page", "label");
        this.change = TranslationService.localizeValue("change", "forgot-password-page", "label");
    }

    validateEmptyResetCodeAndPassword():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.resetCode != 'undefined' && this.resetCode)) {
            
            message = TranslationService.localizeValue("emptyResetCode", "forgot-password-page", "message");
            isValid = false;
        } else if(!(typeof this.password != 'undefined' && this.password)) {
            
            message = TranslationService.localizeValue("emptyPassword", "forgot-password-page", "message");
            isValid = false;
        } else if(!(typeof this.confirmPassword != 'undefined' && this.confirmPassword)) {
            
            message = TranslationService.localizeValue("emptyConfirmPassword", "forgot-password-page", "message");
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

    validateFields():boolean {
        let isValid:boolean = true;
        let message:string;
        
        if(this.resetCode != this.correctResetCode) {
            isValid = false;
            message = TranslationService.localizeValue("invalidResetCode", "forgot-password-page", "message");            
        } 
        if(this.password.length < 8 || this.confirmPassword.length < 8) {
            isValid = false;
            message = TranslationService.localizeValue("invalidPasswordFormat", "forgot-password-page", "message");            
        } else if(this.password !== this.confirmPassword) {
            isValid = false;
            message = TranslationService.localizeValue("invalidPasswordMatch", "forgot-password-page", "message");            
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
