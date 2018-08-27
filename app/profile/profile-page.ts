import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { SegmentedBar } from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { APIConstants } from "../constants/api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { DateFormatter } from "../utilities/date-formatter";
import { SecureStorage } from "nativescript-secure-storage";
import { ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";

import { ProfileViewModel } from "./profile-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    page.addCssFile("./profile/profile-page.css");

    page.bindingContext = new ProfileViewModel();

    page.bindingContext.visibility1 = true;
    page.bindingContext.visibility2 = false;
    page.bindingContext.selectedBarIndex = 0;

    populateTracking(page.bindingContext);
}

export function populateTracking(viewModel: ProfileViewModel) {
    let url = `${APIConstants.Domain}/${APIConstants.TrackingsGetStatisticsEndpoint}`;

    HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();

        if(result.hasOwnProperty("latestRequestDonation")){
            let latestRequestDonation = result["latestRequestDonation"];

            if(latestRequestDonation.hasOwnProperty("id")){
                viewModel.latestDonationId = latestRequestDonation.id;
                viewModel.latestDonationBloodType = viewModel.bloodTypes[latestRequestDonation.bloodType];
                viewModel.latestDonationDate = DateFormatter.toDate(latestRequestDonation.date);
                viewModel.latestDonationRequestedBloodQuantity = latestRequestDonation.requestedBloodQuantity;
            }
        }

        if(result.hasOwnProperty("locations")) {
            Object.keys(result.locations).forEach(key => {
                viewModel.locationsPieSource.push({ "City": key, "Amount": result.locations[key] });
            });
        }

        if(result.hasOwnProperty("annualDonations")) {
            Object.keys(result.annualDonations).forEach(key => {
                console.log(key);
                console.log(result.annualDonations[key]);
                viewModel.annualDonationsCartesianSource.push({ "Year": key, "Amount": result.annualDonations[key] });
            });
        }

        console.log(result);
    }, (reject) => {
    });
}


export function populateHistoryList(viewModel: ProfileViewModel) {
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
                        "dateLabel": viewModel.dateLabel,
                        "requestedBloodQuantityLabel": viewModel.requestedBloodQuantityLabel
                    });
                });
            }
        }, (reject) => {
    });
}
 
export function getItems(skip: number): Promise<any> {
    return new Promise<any>(
        (resolve, reject) => {
            let url = `${APIConstants.Domain}/${APIConstants.TrackingsGetHistoryEndpoint}?skip=${skip}&take=5`;

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

export function onLoadMoreItemsRequested(args: ListViewEventData) {
    const page = <Page>args.object.page;
    let viewModel = <ProfileViewModel>page.bindingContext;

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
                            "dateLabel": viewModel.dateLabel,
                            "requestedBloodQuantityLabel": viewModel.requestedBloodQuantityLabel
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


export function onSbLoaded(args) {
    const segmentedBarComponent = args.object;
    segmentedBarComponent.on("selectedIndexChange", (sbargs) => {
        let segmentedBar = <SegmentedBar>sbargs.object;
        this.selectedIndex = segmentedBar.selectedIndex;
        let viewModel = <ProfileViewModel>segmentedBar.page.bindingContext;
        switch (this.selectedIndex) {
            case 0:
                viewModel.visibility1 = true;
                viewModel.visibility2 = false;
                break;
            case 1:
                viewModel.visibility1 = false;
                viewModel.visibility2 = true;
                if(viewModel.items.length == 0){
                    populateHistoryList(viewModel);
                }
                break;
            default:
                break;
        }
    })
}
