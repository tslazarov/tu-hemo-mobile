 /*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
import * as app from "tns-core-modules/application/application";
import "./bundle-config";
import { ThirdPartyCredentials } from "./constants/third-party-credentials";

import { init, requestReadPermissions } from "nativescript-facebook";
 
app.on(app.launchEvent, function (args) {
    init(ThirdPartyCredentials.FacebookAPIId);
});

// app.start({ moduleName: "app-root/app-root-page" });
// app.start({ moduleName: "register/register-user-information/register-user-page" });
app.start({ moduleName: "forgot-password/initial/forgot-password-initial-page" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
