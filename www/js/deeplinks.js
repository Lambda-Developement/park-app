// setTimeout(() => {
document.addEventListener('deviceready', () => {

    // Deeplinks
    universalLinks.subscribe(null, function (eventData) {
        console.log(eventData);
        console.log('Link: ' + eventData.url);
        console.log('Args: ' + eventData.params);

        if (eventData.url.includes('password')) {
            // Смена пароля
            localStorage.conf = eventData.url.split("/")[eventData.url.split("/").length - 1];

            redirect("/screens/ResetPassword/resetPassword.html");
        }
        else if (eventData.url.includes('mail')) {
            // Подтверждение регистрации
            conf = eventData.url.split("/")[eventData.url.split("/").length - 1];
            console.log(`api_regconf(${conf})`);
            api_regconf(conf).then(
                (success) => {
                    redirect("/screens/MailConfirmation/mailConfirmation.html");
                }
                , (fail) => {
                    redirect("/screens/MailConfirmation/mailConfirmationFail.html");
                });
        }
    });

    // Forbid changing orientation
    window.screen.orientation.lock('portrait');

    // Redirect to login if invalid key and skip login if key
    try {
        if (isIndex) redirect("/screens/Login/login.html");
    } catch (except) { }
    var cur_page = location.href.split('/').slice(-1)[0];
    const no_redirect = [
        "login.html",
        "resetPassword.html",
        "forgetPassword.html",
        "registration.html",
        "resetPassword.html",
        "mailConfirmation.html",
        "mailConfirmationInfo.html",
        "index.html"
    ];
    api_kval(localStorage.getItem('auth_key')).then(
        () => { if (cur_page == "login.html") redirect("../Map/map.html") },
        () => { if (!no_redirect.includes(cur_page)) redirect_login(); });
});
// }, 3000);