import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Label } from "ui/label";
import { Button } from "tns-core-modules/ui/button/button";
import { ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../constants/api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { DateFormatter } from "../utilities/date-formatter";
import { SecureStorage } from "nativescript-secure-storage";
import { MessageService } from "../utilities/message-service";
import { TranslationService } from "../utilities/translation-service"
import { RequestViewModel } from "./request-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    console.log('navigated');

    page.addCssFile("./request/request-page.css");

    page.bindingContext = new RequestViewModel();

    populateList(page.bindingContext);
}

export function populateList(viewModel: RequestViewModel) {
    getItems(0)
        .then((response) => {
            if (response && response.length > 0) {
                response.forEach(item => {
                    viewModel.items.push({ 
                        "id": item.id, 
                        "bloodType": viewModel.bloodTypes[item.bloodType], 
                        "date": DateFormatter.toDate(item.date),
                        "requestedBloodQuantity": item.requestedBloodQuantity, 
                        "bloodTypeLabel": viewModel.bloodTypeLabel,
                        "requestedBloodQuantityLabel": viewModel.requestedBloodQuantityLabel,
                        "dateLabel": viewModel.dateLabel
                    });
                });
            }
        }, (reject) => {

        });
}

export function onLoadMoreItemsRequested(args: ListViewEventData) {
    const page = <Page>args.object.page;
    let viewModel = <RequestViewModel>page.bindingContext;

    const that = new WeakRef(this);
    setTimeout(function () {
        const listView: RadListView = args.object;
        
        getItems(viewModel.items.length)
            .then((response) => {
                if (response && response.length > 0) {
                    response.forEach(item => {
                        viewModel.items.push({ 
                            "id": item.id, 
                            "bloodType": viewModel.bloodTypes[item.bloodType], 
                            "date": DateFormatter.toDate(item.date),
                            "requestedBloodQuantity": item.requestedBloodQuantity, 
                            "bloodTypeLabel": viewModel.bloodTypeLabel,
                            "requestedBloodQuantityLabel": viewModel.requestedBloodQuantityLabel,
                            "dateLabel": viewModel.dateLabel
                        });
                    });
                }
                else {
                    listView.loadOnDemandMode = ListViewLoadOnDemandMode[ListViewLoadOnDemandMode.None];
                }
            }, (reject) => {

            });

        listView.notifyLoadOnDemandFinished();
    }, 1000);
    args.returnValue = true;
}

export function getItems(skip: Number): Promise<any> {
    return new Promise<any>(
        (resolve, reject) => {
            let url = `${APIConstants.Domain}/${APIConstants.RequestsGetListEndpoint}?skip=${skip}&take=5`;
    
            HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
            .then((response) => {
                const result = response.content.toJSON();
                resolve(result);
            }, (reject) => {
                reject(reject);
            });
        }
    );
}

export function onFabCreateTap(args: EventData) {
    const button = <Button>args.object;
    const viewModel = <RequestViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "request/request-create-edit/request-create-edit-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onEditTap(args: EventData) {
    const button = <Button>args.object;
    const card = button.parent.parent.parent;
    const id = card.id;

    const navigationEntry = {
        moduleName: "request/request-create-edit/request-create-edit-page",
        context: {
            "container": {
                "isEditMode": true,
                "id": id
            }
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onDeleteTap(args: EventData) {
    const label = <Label>args.object;
    const viewModel = <RequestViewModel>label.bindingContext;

    const card = label.parent.parent.parent;
    const id = card.id;

    let message;
    let url = `${APIConstants.Domain}/${APIConstants.RequestsDeleteRequestEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ 
        "id": id
    });

    HttpClient.putRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();
        console.log(result);
        console.log(response.statusCode);
        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {

            if(result["isSuccessful"]) {

                message = TranslationService.localizeValue("deleteRequestSuccess", "request-page", "message");
                console.log(message);
                console.log(viewModel.feedback);
                MessageService.showSuccess(message, viewModel.feedback);

                const navigationEntry = {
                    moduleName: "request/request-page",
                    clearHistory: true,
                    animated: false
                };
            
                topmost().navigate(navigationEntry);
            }
        }
    }, (reject) => {

    });
}

export function onItemTap(args) {
    const viewModel = <RequestViewModel>args.object.page.bindingContext;
    callDetailPage(args.object.id, viewModel);
}

export function callDetailPage(id:string, viewModel: RequestViewModel)
{
    const navigationEntry = {
        moduleName: "request/request-detail/request-detail-page",
        context: {
            "id": id
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}