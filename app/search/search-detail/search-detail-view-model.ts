import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"

export class SearchDetailViewModel extends Observable {

    @ObservableProperty() wrappedMaster: any;
    @ObservableProperty() id: string;

    constructor() {
        super();
    }
}
