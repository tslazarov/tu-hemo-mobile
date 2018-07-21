import { Observable } from "data/observable";
import { ObservableProperty } from "./observable-property-decorator";
import { TranslationService } from "../utilities/translation-service"

export class LoginViewModel extends Observable {
    // labels
    emailHint: string;
    passwordHint: string;
    signIn: string;

    @ObservableProperty() email: string;
    @ObservableProperty() password: string;
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

        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.emailHint = TranslationService.localizeValue("emailHint", "login-page", "label");
        this.passwordHint = TranslationService.localizeValue("passwordHint", "login-page", "label");
        this.signIn = TranslationService.localizeValue("signIn", "login-page", "label");
    }
}
