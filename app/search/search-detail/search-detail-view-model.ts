import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"

export class SearchDetailViewModel extends Observable {

    @ObservableProperty() wrappedMaster: any;
    @ObservableProperty() id: string;
    @ObservableProperty() owner: any;
    @ObservableProperty() address: string;
    @ObservableProperty() date: string;
    @ObservableProperty() longitude;
    @ObservableProperty() latitude;
    @ObservableProperty() requestedBloodType;
    @ObservableProperty() requestedBloodQuantity;

    constructor() {
        super();
    }
}
