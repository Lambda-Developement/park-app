

const __backend_url = "https://park.backend.xredday.ru/";
async function __basic_api_call(method, data, auth_key = null) {
    let request_body = {
        'request':
        {
            "action": method,
            "data": data,
            "user_key": auth_key,
        }
    };
    let headers = {}
    console.log("PENDING API CALL");

    return await new Promise((resolve, reject) => {
        cordovaHTTP.post(__backend_url, request_body, headers,
            function (response) {
                // Success
                // prints 200
                console.log(`=== API CALL: "action":"${method}" ===`);
                console.log(`SUCCESS:${response.status}`);
                console.log(`RESPONSE DATA:${response.data}`);
                console.log(`=== API CALL: "action":"${method}" END ===`);
                // Get JSON
                try {
                    resolve(JSON.parse(response.data));
                } catch (except) {
                    if (except instanceof SyntaxError) resolve(response.data);
                }
            },
            function (response) {
                // Fail
                // prints 403
                console.log(`=== API CALL: "action":"${method}" ===`);
                console.log(`FAIL:${response.status}`);
                console.log(`FAIL LOG:\n${response.data}\nFAIL LOG END.`);
                console.log(`=== API CALL: "action":"${method}" END ===`);
                // Callback
                reject(response.status);
            }
        );
    });
}

async function api_login(login, password) {
    // "login" api call (auth_key not required)
    // Returns auth_key
    let data = {
        'login': login,
        'pass': password,
    };
    return await __basic_api_call("login", data);
}

async function api_kval(auth_key) {
    // "kval" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'key': auth_key,
    }
    return await __basic_api_call("kval", data);
}

async function api_register(name, mail, pass) {
    // "reg" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'name': name,
        'mail': mail,
        'pass': pass,
    }
    return await __basic_api_call("reg", data);
}

async function api_regconf(conf) {
    // "regconf" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'conf': conf,
    }
    return await __basic_api_call("regconf", data);
}

async function api_remind(mail) {
    // "remind" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'mail': mail,
    }
    return await __basic_api_call("remind", data);
}

async function api_emsg(text) {
    // "emsg" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'text': text,
    }
    return await __basic_api_call("emsg", data);
}

async function api_pupd(auth_key, diff) {
    // "pupd" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    // types: name - str; gender - 0, 1 man, 2 girl; dob - ???; phone - str???; pass - str

    let data = {};
    const fields = ['name', 'gender', 'dob', 'phone', 'pass'];
    // Explicitly forbid other fields.
    fields.forEach((field) => { if (diff[field] != undefined) data[field] = diff[field] });
    return await __basic_api_call("pupd", data, auth_key);
}

async function api_userdata(auth_key) {
    // "userdata" api call (auth_key required)
    // returns [id, avatar_loc, name, gender, dob, login, phone]
    //  dob - это int, в котором 0 - н/опр, 1 - М, 2 - Ж, а для получения
    // avatar_loc, перед полученной ссылкой добавьте https://trip.backend.xredday.ru/
    let data = {
        // Empty
    }
    return await __basic_api_call("userdata", data, auth_key);
}

async function api_remindconf(pass, conf) {
    // "remindconf" api call
    // returns [id, avatar_loc, name, gender, dob, login, phone]
    let data = {
        'pass': pass,
        'conf': conf
    }
    return await __basic_api_call("remindconf", data);
}

// Getting field
// api_userdata(auth_key).then((userdata) => { var name = userdata[2]; });

// Sobaka-app
async function api_getrev(id, auth_key=null, type = 0) {
    // "getrev" api call (auth_key required)
    // returns [average, reviews[]], где average - средняя оценка экскурсии,
    // reviews[] - массив, содержащий все оценки. Массив reviews состоит из
    // [udata[], mark, review], где udata[] - массив [name, avatarloc] содержащий
    // информацию о пользователя, mark - оценка, review (может быть NULL) - текст оценки.
    let data = {
        'id': id,
        'type': type,
    }
    return await __basic_api_call("getrev", data, auth_key);
}

// Sobaka-app
async function api_groutes(auth_key) {
    // "getrev" api call (auth_key required)
    // returns [id, name, points, distance, duration, description]
    // Поле description может быть NULL.
    let data = {
        //Empty
    }
    return await __basic_api_call("groutes", data, auth_key);
}

// Sobaka-app
async function api_data(auth_key=null) {
    // "data" api call (auth_key required)
    // returns array of [lat, lon, description]
    let data = {
        // Empty
    }
    return await __basic_api_call("data", data, auth_key);
}

// Sobaka-app
async function api_tourdata(id, auth_key) {
    // "tourdata" api call (auth_key required)
    // returns array of [audio, subtitles]
    let data = {
        'id': id
    }
    return await __basic_api_call("tourdata", data, auth_key);
}

// Sobaka-app
async function api_crrev(id, mark, auth_key, review = "") {
    // "crrev" api call (auth_key required)
    // returns nothing
    let data = {
        'id': id,
        // 'type': type, // 0 for excursion, 1 for route
        'mark': mark, // 1-5
        'review': review,
    }
    return await __basic_api_call("crrev", data, auth_key);
}



function api_test() {
    // Credentials
    login = "mfh53342@jiooq.com"
    pass = "nana1231"

    // Promise common functions
    err = (err) => { console.log(`err: ${err}`) }


    // login
    api_login(login, pass).then(
        (res_key) => {
            console.log(`res_key: ${res_key}`);
            localStorage.setItem("auth_key", res_key);
            console.log(`localStorage["auth_key"]: ${localStorage.getItem("auth_key")}`);

            // kval
            api_kval(res_key).then(
                (res) => {
                    console.log(`kval: ${res == ""}`);
                }, err
            );
            // //data
            // auth_key = localStorage.getItem("auth_key");
            // api_data(auth_key).then((res) => console.log(`data: ${res}`), err);

            // //tourdata
            // id = 33
            // auth_key = localStorage.getItem("auth_key");
            // api_tourdata(id, auth_key).then((res) => console.log(`tourdata: ${res}`), err);

            // //groutes
            // auth_key = localStorage.getItem("auth_key");
            // api_tourdata(auth_key).then((res) => console.log(`groutes: ${res}`), err);

            //crrev
            id = 33
            mark = 4
            type = 0
            auth_key = localStorage.getItem("auth_key");
            review_message = `Last_auth_key: ${auth_key}`;
            api_crrev(id, type, mark, auth_key, review_message).then((res) => console.log(`crrev: ${res}`), err);

            //getrev
            id = 33
            auth_key = localStorage.getItem("auth_key");
            api_getrev(id, auth_key).then((res) => console.log(`getrev(${id}): ${res}`), err);

            //pupd
            diff = {
                phone: "+79611616996",
            };
            auth_key = localStorage.getItem("auth_key");
            api_pupd(auth_key, diff).then((res) => console.log(`pupd: ${res}`), err);

            //userdata
            auth_key = localStorage.getItem("auth_key");
            api_userdata(auth_key).then((res) => console.log(`userdata(${auth_key}): ${res}`), err);

        },
        err
    );

    // reg
    name_t = "Коков Степан";
    mail_t = "bzo07598@jiooq.com";
    pass_t = "koko3214";
    api_register(name_t, mail_t, pass_t).then(
        (res) => console.log(`reg: success ${res}`)
        , err
    );

    // //regconf
    // //no working example because you get conf in runtime
    // conf = ""
    // api_regconf().then((res) => console.log(`regconf: ${res == ""}`), err);

    //remind
    //haven't tested well...
    api_remind(mail_t).then((res) => console.log(`remind: ${res == ""}`), err);

    //emsg
    emsg = "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups";
    api_emsg(emsg).then((res) => console.log(`emsg: ${res == ""}`), err);
}
