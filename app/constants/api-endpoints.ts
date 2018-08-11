export class APIConstants {
    static readonly Domain : string = "http://192.168.100.4";
    static readonly AuthorizeEndpoint : string = "authorize";
    
    static readonly UsersExistEndpoint : string = "api/users/exist";
    static readonly UsersCreateEndpoint : string = "api/users/create";
    static readonly UsersBasicProfileEndpoint : string = "api/users/basicProfile";
    static readonly UsersPreferredLanguageEndpoint : string = "api/users/preferredLanguage";

    static readonly ChangePasswordEndpoint : string = "api/settings/changePassword";
    static readonly ChangeEmailEndpoint : string = "api/settings/changeEmail";
    static readonly ChangeLanguageEndpoint : string = "api/settings/changeLanguage";
    static readonly DeleteAccountEndpoint : string = "api/settings/deleteAccount";

}