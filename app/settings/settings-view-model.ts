import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { TranslationService } from "../utilities/translation-service"

export class SettingsViewModel extends Observable {

    // labels
    changePersonalInformation: string;
    changeEmail: string;
    changePassword: string;
    changeLanguage: string;
    deleteAccount: string;
    logOut: string;
    settings: string;

    @ObservableProperty() name: string;
    @ObservableProperty() email: string;
    @ObservableProperty() isExternal: boolean;
    @ObservableProperty() visibilityMode: string;

    constructor() {
        super();

        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.changePersonalInformation = TranslationService.localizeValue("changePersonalInformation", "settings-page", "label");
        this.changeEmail = TranslationService.localizeValue("changeEmail", "settings-page", "label");
        this.changePassword = TranslationService.localizeValue("changePassword", "settings-page", "label");
        this.changeLanguage = TranslationService.localizeValue("changeLanguage", "settings-page", "label");
        this.deleteAccount = TranslationService.localizeValue("deleteAccount", "settings-page", "label");
        this.logOut = TranslationService.localizeValue("logOut", "settings-page", "label");
        this.settings = TranslationService.localizeValue("settings", "settings-page", "label");
    }
}
