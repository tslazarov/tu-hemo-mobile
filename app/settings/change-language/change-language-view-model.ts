import { Observable } from "tns-core-modules/data/observable/observable";
import { TranslationService } from "../../utilities/translation-service"
import { ObservableProperty } from "../../shared/observable-property-decorator";

export class ChangeLanguageViewModel extends Observable {
    // labels
    changeLanguage: string;
    change: string;
    languages: string[] = ["English", "Български"];

    @ObservableProperty() selectedLanguage: number;    

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
        this.changeLanguage = TranslationService.localizeValue("changeLanguage", "change-language-page", "label");
        this.change = TranslationService.localizeValue("change", "change-language-page", "label");
    }
}
