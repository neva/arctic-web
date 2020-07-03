var serverAddress = "http://localhost:3000";
var arcticAvailable = false;

document.addEventListener("arcticAvailable", (e) => {
    arcticAvailable = true
});
const arcticExtensionAvailable = () => {
    return new Promise((resolve) => {
        if(arcticAvailable) resolve(true);
        document.addEventListener("arcticAvailable", (e) => {
            arcticAvailable = true
            resolve(true);
        });
        setTimeout(() => {
            resolve(false);
        }, 100)
    })
}
var redirect = (url) => window.location.href = url;

var responseEvents = []
document.addEventListener("arcticResponse", (response) => responseEvents = responseEvents.filter((func) => func(response.detail)));

const triggerEvent = (eventName, data) => {
    return new Promise((resolve) => {
        const responseID = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
        const request = Object.assign(data, { responseID, action: eventName })
        const event = new CustomEvent("arctic-request", {
            "detail": request
        });
        document.dispatchEvent(event);    
        responseEvents.push((response) => {
            if(response.responseID == responseID) {
                resolve(response);
                return true;
            } else {
                return false;
            }
        })
    })
}

const arcticAddUser = async (userAccessToken) =>  {

    const available = await arcticExtensionAvailable();
    if(!available) return;

    const response = await triggerEvent("arctic-extension-add-user", { userAccessToken })
    return response;

}
const arcticAuthenticateUser = async (appID, callbackURL) => {

    const response = await triggerEvent("arctic-authenticate", {
        appID,
        callbackURL
    });
    return response;

}
const getAuthTokenFromExtension = async (appID) => {

    const response = await triggerEvent("arctic-get-authToken", {
        appID
    })
    return response.authToken;

}
const arcticLogin = async (appID, callbackURL) => {

    const available = await arcticExtensionAvailable();
    if(!available) redirect(serverAddress + "/login?app=" + appID + "&redirect=" + callbackURL);

    const response = await triggerEvent("arctic-check-if-user-is-authenticated", { appID })
    console.log("check-if-user-authenticated:", response);
    if(!response.isAuthenticated) {
        console.log("afaf")
        const response = await triggerEvent("arctic-authenticate", {
            appID,
            callbackURL
        })
        console.log("arctic-authenticate:", response);
        redirect(callbackURL + "?authToken=" + response.authToken);
        return;
    }
    const authTokenResponse = await triggerEvent("arctic-get-authToken", { appID });
    redirect(callbackURL + "?authToken=" + authTokenResponse.authToken);

}

const arcticExtensionAddUser = async (userAccessToken) => {

    const available = await arcticExtensionAvailable();
    if(!available) return {
        "error": true,
        "message": "Arctic not available!"
    }

    const result = await triggerEvent("arctic-extension-add-user", { userAccessToken })
    console.log("Result:", result);
    return result;

}
const arcticAuthenticate = async (appID, callbackURL) => {

    const available = await arcticExtensionAvailable();
    if(!available) {
        redirect(serverAddress + "/login?action=authenticate&app=" + appID + "&redirect=" + callbackURL);
        return;
    };
    
    const result = await triggerEvent("arctic-authenticate", { appID });
    if(result.error != false) {
        redirect(serverAddress + "/login?action=authenticate&app=" + appID + "&redirect=" + callbackURL)
        return;
    };
    redirect(callbackURL + "?authToken=" + result.authToken);

}