import { Observable } from "data/observable";
import { ObservableProperty } from "./observable-property-decorator";

export class LoginViewModel extends Observable {
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
    }
}
