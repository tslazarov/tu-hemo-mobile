export class APIConstants {
    static readonly Domain : string = "http://192.168.100.3";
    static readonly AuthorizeEndpoint : string = "authorize";
    
    static readonly UsersExistEndpoint : string = "api/users/exist";
    static readonly UsersCreateEndpoint : string = "api/users/create";
    static readonly UsersSendResetCodeEndpoint : string = "api/users/sendResetCode";
    static readonly UsersResetPasswordEndpoint : string = "api/users/resetPassword";
    static readonly UsersBasicProfileEndpoint : string = "api/users/basicProfile";
    static readonly UsersFullProfileEndpoint : string = "api/users/fullProfile";
    static readonly UsersPreferredLanguageEndpoint : string = "api/users/preferredLanguage";
    static readonly UsersGetUserEndpoint : string = "api/users";

    static readonly SettingsChangePersonalInformationEndpoint : string = "api/settings/changePersonalInformation";
    static readonly SettingsChangePasswordEndpoint : string = "api/settings/changePassword";
    static readonly SettingsChangeEmailEndpoint : string = "api/settings/changeEmail";
    static readonly SettingsChangeLanguageEndpoint : string = "api/settings/changeLanguage";
    static readonly SettingsDeleteAccountEndpoint : string = "api/settings/deleteAccount";

    static readonly RequestsCreateRequestEndpoint : string = "api/requests/create";
    static readonly RequestsEditRequestEndpoint : string = "api/requests/edit";
    static readonly RequestsDeleteRequestEndpoint : string = "api/requests/delete";
    static readonly RequestsGetListEndpoint : string = "api/requests";
    static readonly RequestsGetListFullEndpoint : string = "api/requests/full";
    static readonly RequestGetRequestEndpoint : string = "api/requests";
    static readonly RequestAddDonatorEndpoint : string = "api/requests/addDonator";
    static readonly RequestRemoveDonatorEndpoint : string = "api/requests/removeDonator";
    static readonly RequestConfirmDonatorEndpoint : string = "api/requests/confirmDonator";
    static readonly RequestDisconfirmDonatorEndpoint : string = "api/requests/disconfirmDonator";

    static readonly MedCentersGetListFullEndpoint : string = "api/centers";
    static readonly MedCentersGetCenterEndpoint : string = "api/centers";

    static readonly TrackingsGetStatisticsEndpoint : string = "api/trackings";
    static readonly TrackingsGetHistoryEndpoint : string = "api/trackings/history";

}