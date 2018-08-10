import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class ChangeEmailViewModel extends Observable {
        // labels
        changeEmail: string;
        newEmailHint: string;
        passwordHint: string;
        change: string;
        feedback: Feedback;

        @ObservableProperty() newEmail: string;
        @ObservableProperty() password: string;

    constructor() {
        super();
    
        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.changeEmail = TranslationService.localizeValue("changeEmail", "change-email-page", "label");
        this.newEmailHint = TranslationService.localizeValue("newEmailHint", "change-email-page", "label");
        this.passwordHint = TranslationService.localizeValue("passwordHint", "change-email-page", "label");
        this.change = TranslationService.localizeValue("change", "change-email-page", "label");
    }

    validateEmptyEmailAndPassword():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.newEmail != 'undefined' && this.newEmail)) {
            
            message = TranslationService.localizeValue("emptyNewEmail", "change-email-page", "message");
            isValid = false;
        } else if(!(typeof this.password != 'undefined' && this.password)) {
            
            message = TranslationService.localizeValue("emptyPassword", "change-email-page", "message");
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

        if(!re.test(this.newEmail.toLowerCase())){
            isValid = false;
            message = TranslationService.localizeValue("invalidEmailAddressFormat", "change-email-page", "message");
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

