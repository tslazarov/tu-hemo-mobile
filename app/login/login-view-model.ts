import { Observable } from "data/observable";
import { ObservableProperty } from "./observable-property-decorator";
import { TranslationService } from "../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

export class LoginViewModel extends Observable {
    // labels
    emailHint: string;
    passwordHint: string;
    signIn: string;
    signInFacebook: string;

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
        this.signIn = TranslationService.localizeValue("signIn", "login-page", "label");
        this.signInFacebook = TranslationService.localizeValue("signInFacebook", "login-page", "label");
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

    validateEmptyEmailOrPassword(email: string, password: string):boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof email != 'undefined' && email)) {
            
            message = TranslationService.localizeValue("emptyEmail", "login-page", "message");
            isValid = false;
        } else if(!(typeof password != 'undefined' && password)) {
            
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
