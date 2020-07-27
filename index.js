var serverAddress = "http://arcticxyz.ddns.net";

// arcticExtensionAvailable
var arcticExtensionAvailableState = false;
document.addEventListener("arcticAvailable", () => arcticExtensionAvailableState = true );
const arcticExtensionAvailable = () => {
    return new Promise((resolve) => {

        if(arcticExtensionAvailableState) resolve(true);

        document.addEventListener("arcticAvailable", (e) => {
            arcticExtensionAvailableState = true
            resolve(true);
        });
        setTimeout(() => {
            resolve(false);
        }, 100)

    })
}

// DOM interaction
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

const extensionAddUser = async (userAccessToken) => {

    const available = await arcticExtensionAvailable();
    if(!available) return {
        "error": true,
        "message": "Arctic not available!"
    }

    const result = await triggerEvent("arctic-extension-add-user", { userAccessToken })
    return result;

}
const authenticate = async (appID, callbackURL) => {

    const available = await arcticExtensionAvailable();
    if(!available) {
        window.location.href = serverAddress + "/login?action=authenticate&app=" + appID + "&redirect=" + callbackURL;
        return;
    };
    
    const result = await triggerEvent("arctic-authenticate", { appID });
    if(result.error != false) {
        window.location.href = serverAddress + "/login?action=authenticate&app=" + appID + "&redirect=" + callbackURL;
        return;
    };
    window.location.href = callbackURL + "?authToken=" + result.authToken;

}
const backgroundAuthentification = async (appID) => {

    const available = await arcticExtensionAvailable();
    if(!available) return {
        "error": true
    };

    const result = await triggerEvent("arctic-authenticate", { appID })
    return result;

}

// exposed functions
const arctic = {
    backgroundAuthentification,
    authenticate,
    extensionAddUser
}