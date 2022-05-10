// Базовая функция редиректов
function redirect(url) {
    document.location.href = url;
}
// Редирект в Отправление сообщения об ошибках
function redirect_access_error(){
    redirect('/screens/AccessError/accessError.html');
}
// Редирект в Подтверждение почты
function redirect_email(){
    redirect('/screens/email/emailConfirmation.html');
}
// Редирект в Избраннное
function redirect_favourites(){
    redirect('/screens/Favourites/favourites.html');
}
// Редирект в Забыли пароль
function redirect_forget_password(){
    redirect('/screens/ForgetPassword/forget_password.html');
}
// Редирект в Главный экран
function redirect_home(){
    redirect('/screens/Home/home.html');
}
// Редирект в Экран с лицензией
function redirect_license(){
    redirect('/screens/License/license.html');
}
// Редирект в Загрузку
function redirect_loading(){
    redirect('/screens/Loading/loading.html');
}
// Редирект в Логин
function redirect_login(){
    redirect('/screens/Login/login.html');
}
// Редирект в Подвтерждение почты
function redirect_mail_confirmation(){
    redirect('/screens/MailConfirmation/mailConfirmation.html');
}
// Редирект в Главный экран
function redirect_map(){
    redirect('/screens/Map/map.html');
}
// Редирект в Не доступно
function redirect_not_available(){
    redirect('/screens/NotAvailable/not_available.html');
}
// Редирект в Информация о парковке
function redirect_parkzone(){
    redirect('/screens/Parkzone/park_info.html');
}
// Редирект в Профиль
function redirect_profile_avatar(){
    redirect('/screens/Profile+avatar/profile_main.html');
}
// Редирект в Изменение профиля
function redirect_profile_edit(){
    redirect('/screens/ProfileEdit/profile_main.html');
}
// Редирект в Регистрация
function redirect_registration(){
    redirect('/screens/Registration/registration.html');
}
// Редирект в Отправление ошибки
function redirect_report_bug(){
    redirect('/screens/ReportBug/index.html');
}
// Редирект в Восстановление пароля
function redirect_reset_password(){
    redirect('/screens/ResetPassword/resetPassword.html');
}
// Редирект в восстановление почты
function redirect_reset_password_email(){
    redirect('/screens/ResetPasswordEmail/resetPassword.html');
}
// Редирект в выбор парковки
function redirect_add_favourite(){
    redirect('/screens/AddFavourite/home.html');
}