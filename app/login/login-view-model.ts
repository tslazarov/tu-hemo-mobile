import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { TranslationService } from "../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class LoginViewModel extends Observable {
    // labels
    emailHint: string;
    passwordHint: string;
    login: string;
    loginFacebook: string;
    confirm: string;
    forgotPasswordQuestion: string;
    resetPassword: string;
    noAccountQuestion: string;
    registerNow: string;

    @ObservableProperty() email: string;
    @ObservableProperty() password: string;
    feedback: Feedback;
    selectedLanguage: number;    
    languages: string[] = ["English", "Български"];
    constructor(language:string) {
        super();

        if(language && language == "bg") {
            this.selectedLanguage = 1;
        } 
        else {
            this.selectedLanguage = 0;
        }

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.emailHint = TranslationService.localizeValue("emailHint", "login-page", "label");
        this.passwordHint = TranslationService.localizeValue("passwordHint", "login-page", "label");
        this.login = TranslationService.localizeValue("login", "login-page", "label");
        this.loginFacebook = TranslationService.localizeValue("loginFacebook", "login-page", "label");
        this.confirm = TranslationService.localizeValue("confirm", "login-page", "label");
        this.forgotPasswordQuestion = TranslationService.localizeValue("forgotPasswordQuestion", "login-page", "label");
        this.resetPassword = TranslationService.localizeValue("resetPassword", "login-page", "label");
        this.noAccountQuestion = TranslationService.localizeValue("noAccountQuestion", "login-page", "label");
        this.registerNow = TranslationService.localizeValue("registerNow", "login-page", "label");
    }

    showInvalidEmailOrPasswordAndMessage():void {
        let message = TranslationService.localizeValue("invalidEmailOrPassword", "login-page", "message");

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

    validateEmptyEmailOrPassword():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.email != 'undefined' && this.email)) {
            
            message = TranslationService.localizeValue("emptyEmail", "login-page", "message");
            isValid = false;
        } else if(!(typeof this.password != 'undefined' && this.password)) {
            
            message = TranslationService.localizeValue("emptyPassword", "login-page", "message");
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
