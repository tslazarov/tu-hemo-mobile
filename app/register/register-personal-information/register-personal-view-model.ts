import { Observable } from "data/observable";
import { ObservableProperty } from "../observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

export class RegisterPersonalViewModel extends Observable {
    // labels
    firstNameHint: string;
    lastNameHint: string;
    phoneNumberHint: string;
    register: string;

    @ObservableProperty() firstName: string;
    @ObservableProperty() lastName: string;
    @ObservableProperty() phoneNumber: string;
    feedback: Feedback;

    constructor() {
        super();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.firstNameHint = TranslationService.localizeValue("firstNameHint", "register-page", "label");
        this.lastNameHint = TranslationService.localizeValue("lastNameHint", "register-page", "label");
        this.phoneNumberHint = TranslationService.localizeValue("phoneNumberHint", "register-page", "label");
        this.register = TranslationService.localizeValue("register", "register-page", "label");
    }

    validateEmptyData(firstName: string, lastName: string, phoneNumber: string):boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof firstName != 'undefined' && firstName)) {
            
            message = TranslationService.localizeValue("emptyFirstName", "register-page", "message");
            isValid = false;
        } else if(!(typeof lastName != 'undefined' && lastName)) {
            
            message = TranslationService.localizeValue("emptyLastName", "register-page", "message");
            isValid = false;
        } else if(!(typeof phoneNumber != 'undefined' && phoneNumber)) {
            
            message = TranslationService.localizeValue("emptyPhoneNumber", "register-page", "message");
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
