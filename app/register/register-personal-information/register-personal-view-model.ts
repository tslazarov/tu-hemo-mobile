import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback } from "nativescript-feedback";
import { MessageService } from "../../utilities/message-service";

export class RegisterPersonalViewModel extends Observable {
    // labels
    personalInformationHeader: string;
    progressValue: number = 1;
    progressMaxValue: number = 2;
    firstNameHint: string;
    lastNameHint: string;
    phoneNumberHint: string;
    ageHint: string;
    bloodType: string;
    register: string;

    @ObservableProperty() firstName: string;
    @ObservableProperty() lastName: string;
    @ObservableProperty() phoneNumber: string;
    @ObservableProperty() selectedBloodType: number;
    @ObservableProperty() age: string;
    @ObservableProperty() email: string;
    @ObservableProperty() password: string;
    @ObservableProperty() isExternal: string;
    @ObservableProperty() userExternalId: string;
    @ObservableProperty() externalAccessToken: string;
    feedback: Feedback;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.personalInformationHeader = TranslationService.localizeValue("personalInformationHeader", "register-page", "label")        
        this.firstNameHint = TranslationService.localizeValue("firstNameHint", "register-page", "label");
        this.lastNameHint = TranslationService.localizeValue("lastNameHint", "register-page", "label");
        this.phoneNumberHint = TranslationService.localizeValue("phoneNumberHint", "register-page", "label");
        this.ageHint = TranslationService.localizeValue("ageHint", "register-page", "label");
        this.bloodType = TranslationService.localizeValue("bloodType", "register-page", "label");
        this.register = TranslationService.localizeValue("register", "register-page", "label");
    }

    validateEmptyData():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.firstName != 'undefined' && this.firstName)) {
            
            message = TranslationService.localizeValue("emptyFirstName", "register-page", "message");
            isValid = false;
        } else if(!(typeof this.lastName != 'undefined' && this.lastName)) {
            
            message = TranslationService.localizeValue("emptyLastName", "register-page", "message");
            isValid = false;
        } else if(!(typeof this.phoneNumber != 'undefined' && this.phoneNumber)) {
            
            message = TranslationService.localizeValue("emptyPhoneNumber", "register-page", "message");
            isValid = false;
        } else if(!(typeof this.age != 'undefined' && this.age)) {
            
            message = TranslationService.localizeValue("emptyAge", "register-page", "message");
            isValid = false;
        }
        if(!isValid) {
            MessageService.showError(message, this.feedback);
        }

        return isValid;
    }

    
    validateFields():boolean {
        let isValid:boolean = true;
        let message:string;
        const nameRe = /^[^0-9\!\?\@\#\$\%\^\&\*\(\)\\\"\_\+\-\/\~]+$/;
        const phoneRe = /^[0-9]{10}$/;
        const ageRe = /^[0-9]{1,3}$/;

        if(!nameRe.test(this.firstName.toLowerCase())){
            isValid = false;
            message = TranslationService.localizeValue("invalidFirstNameFormat", "register-page", "message");
        } else if(!nameRe.test(this.lastName.toLowerCase())) {
            isValid = false;
            message = TranslationService.localizeValue("invalidLastNameFormat", "register-page", "message");            
        } else if(!phoneRe.test(this.phoneNumber)) {
            isValid = false;
            message = TranslationService.localizeValue("invalidPhoneFormat", "register-page", "message");            
        }  else if(!ageRe.test(this.age)) {
            isValid = false;
            message = TranslationService.localizeValue("invalidAgeFormat", "register-page", "message");            
        } 
        else if(+this.age < 18 || +this.age > 65) {
            isValid = false;
            message = TranslationService.localizeValue("allowedAge", "register-page", "message"); 
        } else if(typeof this.selectedBloodType == 'undefined' || !this.selectedBloodType  || this.selectedBloodType < 0 || this.selectedBloodType > 7) {
            isValid = false;
            message = TranslationService.localizeValue("invalidBloodType", "register-page", "message"); 
        }

        if(!isValid) {
            MessageService.showError(message, this.feedback);
        }

        return isValid;
    }
}
