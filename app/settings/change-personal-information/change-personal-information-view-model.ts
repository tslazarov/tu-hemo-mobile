import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class ChangePersonalInformationViewModel extends Observable {
    // labels
    changePersonalInformation: string;
    firstNameHint: string;
    lastNameHint: string;
    phoneNumberHint: string;
    ageHint: string;
    profileImage: string;
    bloodType: string;
    change: string;
    previewSize: any = 100;

    @ObservableProperty() imageSrc: any;
    @ObservableProperty() isSingleMode: boolean;
    @ObservableProperty() firstName: string;
    @ObservableProperty() lastName: string;
    @ObservableProperty() phoneNumber: string;
    @ObservableProperty() selectedBloodType: number;
    @ObservableProperty() age: string;
    @ObservableProperty() imageAsBase64: string;
    feedback: Feedback;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.changePersonalInformation = TranslationService.localizeValue("changePersonalInformation", "change-personal-information-page", "label")        
        this.firstNameHint = TranslationService.localizeValue("firstNameHint", "change-personal-information-page", "label");
        this.lastNameHint = TranslationService.localizeValue("lastNameHint", "change-personal-information-page", "label");
        this.phoneNumberHint = TranslationService.localizeValue("phoneNumberHint", "change-personal-information-page", "label");
        this.ageHint = TranslationService.localizeValue("ageHint", "change-personal-information-page", "label");
        this.profileImage = TranslationService.localizeValue("profileImage", "change-personal-information-page", "label");
        this.bloodType = TranslationService.localizeValue("bloodType", "change-personal-information-page", "label");
        this.change = TranslationService.localizeValue("change", "change-personal-information-page", "label");
    }

    validateEmptyData():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.firstName != 'undefined' && this.firstName)) {
            
            message = TranslationService.localizeValue("emptyFirstName", "change-personal-information-page", "message");
            isValid = false;
        } else if(!(typeof this.lastName != 'undefined' && this.lastName)) {
            
            message = TranslationService.localizeValue("emptyLastName", "change-personal-information-page", "message");
            isValid = false;
        } else if(!(typeof this.phoneNumber != 'undefined' && this.phoneNumber)) {
            
            message = TranslationService.localizeValue("emptyPhoneNumber", "change-personal-information-page", "message");
            isValid = false;
        } else if(!(typeof this.age != 'undefined' && this.age)) {
            
            message = TranslationService.localizeValue("emptyAge", "change-personal-information-page", "message");
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
        const nameRe = /^[^0-9\!\?\@\#\$\%\^\&\*\(\)\\\"\_\+\-\/\~]+$/;
        const phoneRe = /^[0-9]{10}$/;
        const ageRe = /^[0-9]{1,3}$/;

        if(!nameRe.test(this.firstName.toLowerCase())){
            isValid = false;
            message = TranslationService.localizeValue("invalidFirstNameFormat", "change-personal-information-page", "message");
        } else if(!nameRe.test(this.lastName.toLowerCase())) {
            isValid = false;
            message = TranslationService.localizeValue("invalidLastNameFormat", "change-personal-information-page", "message");            
        } else if(!phoneRe.test(this.phoneNumber)) {
            isValid = false;
            message = TranslationService.localizeValue("invalidPhoneFormat", "change-personal-information-page", "message");            
        }  else if(!ageRe.test(this.age)) {
            isValid = false;
            message = TranslationService.localizeValue("invalidAgeFormat", "change-personal-information-page", "message");            
        } 
        else if(+this.age < 18 || +this.age > 65) {
            isValid = false;
            message = TranslationService.localizeValue("allowedAge", "change-personal-information-page", "message"); 
        } else if(typeof this.selectedBloodType == 'undefined' || !this.selectedBloodType  || this.selectedBloodType < 1 || this.selectedBloodType > 8) {
            isValid = false;
            message = TranslationService.localizeValue("invalidBloodType", "change-personal-information-page", "message"); 
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
