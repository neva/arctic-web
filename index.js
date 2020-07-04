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
const arcticBackgroundAuthentification = async (appID) => {

    const available = await arcticExtensionAvailable();
    if(!available) return {
        "error": true
    };

    const result = await triggerEvent("arctic-authenticate", { appID })
    return result;

}