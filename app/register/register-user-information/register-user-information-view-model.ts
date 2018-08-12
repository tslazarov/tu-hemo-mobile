import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class RegisterUserViewModel extends Observable {
    // labels
    progressValue: number = 0;
    progressMaxValue: number = 2;
    emailHint: string;
    passwordHint: string;
    confirmPasswordHint: string;
    next: string;
    userInformationHeader: string;

    @ObservableProperty() email: string;
    @ObservableProperty() password: string;
    @ObservableProperty() confirmPassword: string;
    feedback: Feedback;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.userInformationHeader = TranslationService.localizeValue("userInformationHeader", "register-page", "label")
        this.emailHint = TranslationService.localizeValue("emailHint", "register-page", "label");
        this.passwordHint = TranslationService.localizeValue("passwordHint", "register-page", "label");
        this.confirmPasswordHint = TranslationService.localizeValue("confirmPasswordHint", "register-page", "label");
        this.next = TranslationService.localizeValue("next", "register-page", "label");
    }

    validateEmptyEmailOrPassword():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.email != 'undefined' && this.email)) {
            
            message = TranslationService.localizeValue("emptyEmail", "register-page", "message");
            isValid = false;
        } else if(!(typeof this.password != 'undefined' && this.password)) {
            
            message = TranslationService.localizeValue("emptyPassword", "register-page", "message");
            isValid = false;
        } else if(!(typeof this.confirmPassword != 'undefined' && this.confirmPassword)) {
            
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

    validateFields():boolean {
        let isValid:boolean = true;
        let message:string;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(this.email.toLowerCase())){
            isValid = false;
            message = TranslationService.localizeValue("invalidEmailAddressFormat", "register-page", "message");
        } else if(this.password.length < 8 || this.confirmPassword.length < 8) {
            isValid = false;
            message = TranslationService.localizeValue("invalidPasswordFormat", "register-page", "message");            
        } else if(this.password !== this.confirmPassword) {
            isValid = false;
            message = TranslationService.localizeValue("invalidPasswordMatch", "register-page", "message");            
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
