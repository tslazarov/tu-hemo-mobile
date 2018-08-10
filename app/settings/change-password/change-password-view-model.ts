import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class ChangePasswordViewModel extends Observable {
    // labels
    changePassword: string;
    oldPasswordHint: string;
    newPasswordHint: string;
    confirmNewPasswordHint: string;
    change: string;
    feedback: Feedback;

    @ObservableProperty() oldPassword: string;
    @ObservableProperty() newPassword: string;
    @ObservableProperty() confirmNewPassword: string;
    
    constructor() {
        super();

        
        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.changePassword = TranslationService.localizeValue("changePassword", "change-password-page", "label");
        this.oldPasswordHint = TranslationService.localizeValue("oldPasswordHint", "change-password-page", "label");
        this.newPasswordHint = TranslationService.localizeValue("newPasswordHint", "change-password-page", "label");
        this.confirmNewPasswordHint = TranslationService.localizeValue("confirmNewPasswordHint", "change-password-page", "label");
        this.change = TranslationService.localizeValue("change", "change-password-page", "label");
    }

    validateEmptyPasswords():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.oldPassword != 'undefined' && this.oldPassword)) {
            
            message = TranslationService.localizeValue("emptyOldPassword", "change-password-page", "message");
            isValid = false;
        } else if(!(typeof this.newPassword != 'undefined' && this.newPassword)) {
            
            message = TranslationService.localizeValue("emptyNewPassword", "change-password-page", "message");
            isValid = false;
        } else if(!(typeof this.confirmNewPassword != 'undefined' && this.confirmNewPassword)) {
            
            message = TranslationService.localizeValue("emptyConfirmNewPassword", "change-password-page", "message");
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

        if(this.newPassword.length < 8 || this.confirmNewPassword.length < 8) {
            isValid = false;
            message = TranslationService.localizeValue("invalidNewPasswordFormat", "change-password-page", "message");            
        } else if(this.newPassword !== this.confirmNewPassword) {
            isValid = false;
            message = TranslationService.localizeValue("invalidPasswordMatch", "change-password-page", "message");            
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
