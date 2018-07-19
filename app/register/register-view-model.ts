import { Observable } from "data/observable";
import { ObservableProperty } from "./observable-property-decorator";

export class RegisterViewModel extends Observable {
    @ObservableProperty() password: string;
    @ObservableProperty() name: string;
    @ObservableProperty() email: string;

    constructor() {
        super();
    }

    signUp() {
        const name = this.name;
        const email = this.email;
        const password = this.password;

        /* ***********************************************************
        * Call your custom sign up logic using the email and password data.
        *************************************************************/
    }
}
