import { LabelsAndMessages } from "../constants/labels-messages";
import { SecureStorage } from "nativescript-secure-storage";

const secureStorage = new SecureStorage();

export class TranslationService {
    static localizeValue(fieldName: string, pageName: string, type: string): string {
        switch(type) {
            case "label": {
                let language = secureStorage.getSync({key: "language" });
                return language ? LabelsAndMessages.labels[pageName][fieldName][language] : LabelsAndMessages.labels[pageName][fieldName]["en"];
            }
            case "message":{ 
                let language = secureStorage.getSync({key: "language" });
                return language ? LabelsAndMessages.messages[pageName][fieldName][language] : LabelsAndMessages.messages[pageName][fieldName]["en"];
            }
        }
    }
}