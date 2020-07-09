window.onload = () => {

    document.getElementsById("arctic-login").addEventListener("onclick", () => {
        // This code will be executed everytime the person clicks on the Login Button

        const app = "your-appID" // you can paste your appID here, it will be needed to authenticate the user

        // here you can paste the URL the user should be redirect to when he's authenticated
        // the URL should led to server in which arctic-node is installed, so the user information can be parsed
        const callback = "paste-server-url-here"

        await arctic.authenticate(app, callback);

    })

}