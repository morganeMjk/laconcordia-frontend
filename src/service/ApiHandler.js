import axios from 'axios';


class ApiHandler {
    constructor(accessToken) {
        this.baseUrl = "http://localhost:3032";
        this.accessToken = accessToken || null;
        if (!accessToken) {
            return false
        }
    }

    #POST_REQUEST = (endpoint, data, accessToken, options) => {
        if (!endpoint) {
            return { error: true, message: "aucun endpoint a été défini" }
        }
        const reqOptions = {
            method: "POST",
            data: data || {},
            headers: {}
        }
        if (accessToken) {
            reqOptions.headers.Authorization = `Bearer ${accessToken}`
        }

        if (options) {
            if (options.multipart) {
                reqOptions.headers["Content-Type"] = "multipart/form-data"
            }
        }


        return axios(`${this.baseUrl}${endpoint}`, reqOptions)
            .then((res) => res.data)
            .catch((error) => error?.response?.data || { data: { error: true, message: "une erreur est survenue" } })
    }

    #GET_REQUEST = (endpoint, id, options) => {
        if (!endpoint) {
            return { error: true, message: "aucun endpoint a été défini" }
        }

        const reqOptions = {
            method: "GET",
            headers: {}
        }

        // console.log(options)

        if (options) {
            if (options.accessToken) {
                reqOptions.headers.Authorization = `Bearer ${options.accessToken}`
            }
        }

        const apiUrl = !id ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}${endpoint}/${id}`

        return axios(apiUrl, reqOptions)
            .then((res) => res.data)
            .catch((error) => error?.response?.data || { data: { error: true, message: "une erreur est survenue" } })
    }

    #PATCH_REQUEST = (endpoint, data, accessToken, options) => {
        if (!endpoint) {
            return { error: true, message: "aucun endpoint a été défini" }
        }

        // console.log(options)

        const reqOptions = {
            method: "PATCH",
            data: data || {},
            headers: {}
        }

        if (options) {
            if (options.multipart) {
                reqOptions.headers["Content-Type"] = "multipart/form-data"
            }
        }

        if (accessToken) {
            reqOptions.headers.Authorization = `Bearer ${accessToken}`
        }

        return axios(`${this.baseUrl}${endpoint}`, reqOptions)
            .then((res) => res.data)
            .catch((error) => error?.response?.data || { data: { error: true, message: "une erreur est survenue" } })
    }

    #DELETE_REQUEST = (endpoint, data, accessToken) => {
        if (!endpoint) {
            return { error: true, message: "aucun endpoint a été défini" }
        }
        const reqOptions = {
            method: "DELETE",
            data: data || {},
            headers: {}
        }
        if (accessToken) {
            reqOptions.headers.Authorization = `Bearer ${accessToken}`
        }


        return axios(`${this.baseUrl}${endpoint}`, reqOptions)
            .then((res) => res)
            .catch((error) => error?.response?.data || { error: true, message: "une erreur est survenue" })
    }









    // User methods
    user = {
        SignUp: async (data) => {
            // console.log(data)
            return await this.#POST_REQUEST("/user/signup", data)
        },
        SignIn: async (data) => {
            return await this.#POST_REQUEST("/user/signin", data)
        },
        GetProfile: async () => {
            return await this.#POST_REQUEST("/user/profile", {}, this.accessToken)
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/user/all", null, { accessToken: this.accessToken })
        },
        GetBase: async () => {
            return await this.#GET_REQUEST("/user/allbase")
        },
        ArchiveUser: async (data) => {
            return await this.#PATCH_REQUEST("/user/archive", data, this.accessToken)
        },
        UserNotification: async (data) => {
            return await this.#PATCH_REQUEST("user/notification", data, this.accessToken)
        },
        GetById: async (data) => {
            return await this.#POST_REQUEST("/user/find", data, this.accessToken)
        },
        UserUpdate: async (data) => {
            return await this.#PATCH_REQUEST("/user/update", data, this.accessToken)
        },
        UpdatePassword: async (data) => {
            return await this.#PATCH_REQUEST("/user/update-password", data, this.accessToken);
        },
        UpdateNotification: async (data) => {
            return await this.#PATCH_REQUEST("/user/update-notification", data, this.accessToken);
        },
        ResetPassword: async (data) => {
            return await this.#POST_REQUEST("/user/reset-password", data);
        },
        CheckResetCode: async (data) => {
            return await this.#POST_REQUEST("/user/check-reset-code", data);
        },
        UpdateResetPassword: async (data) => {
            return await this.#POST_REQUEST("/user/update-reset-password", data);
        },
        VerifyAccount: async (data) => {
            return await this.#POST_REQUEST("/user/verify", data);
        },
        ResendVerificationCode: async (data) => {
            return await this.#POST_REQUEST("/user/verify-resend", data);
        }
    }

    // Roles methods
    roles = {
        GetAll: async () => {
            return await this.#GET_REQUEST("/role")
        }
    }

    // Status methods
    status = {
        GetAll: async () => {
            return await this.#GET_REQUEST("/status")
        }
    }

    // UserStatus methods
    userStatus = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/user-status/create", data, this.accessToken)
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/user-status")
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/user-status/delete", data, this.accessToken)
        }
    }

    // UserRoles methods
    userRoles = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/user-role/create", data, this.accessToken)
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/user-role")
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/user-role/delete", data, this.accessToken)
        }
    }

    // Instruments methods
    instruments = {
        GetAll: async () => {
            return await this.#GET_REQUEST("/instrument")
        },
        GetById: async (data) => {
            return await this.#POST_REQUEST("/instrument/find", data, this.accessToken)
        },
    }

    // UserInstruments methods
    userInstruments = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/user-instrument/create", data, this.accessToken)
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/user-instrument")
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/user-instrument/delete", data, this.accessToken)
        },
        GetByUserId: async (data) => {
            return await this.#POST_REQUEST("/user-instrument/find-by-user", data, this.accessToken)
        },
    }

    // Messages methods
    message = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/message/create", data, this.accessToken)
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/message", null, { accessToken: this.accessToken })
        },
        ArchiveMessage: async (data) => {
            return await this.#PATCH_REQUEST("/message/archive", data, this.accessToken)
        },
        IsReadMessage: async (data) => {
            return await this.#PATCH_REQUEST("/message/read", data, this.accessToken)
        }
    }


    // News methods
    news = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/news/create", data, this.accessToken, { multipart: true })
        },
        Update: async (data) => {
            return await this.#PATCH_REQUEST("/news/update", data, this.accessToken, { multipart: data.thumbnail ? true : false })
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/news")
        },
        GetById: async (data) => {
            return await this.#POST_REQUEST("/news/find", data)
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/news/delete", data, this.accessToken)
        }
    }


    // Events methods
    events = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/event/create", data, this.accessToken, { multipart: true })
        },
        Update: async (data) => {
            return await this.#PATCH_REQUEST("/event/update", data, this.accessToken, { multipart: data.thumbnail ? true : false })
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/event")
        },
        GetById: async (data) => {
            return await this.#POST_REQUEST("/event/find", data)
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/event/delete", data, this.accessToken)
        }
    }


    // Albums methods
    albums = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/album/create", data, this.accessToken, { multipart: true })
        },
        Update: async (data) => {
            return await this.#PATCH_REQUEST("/album/update", data, this.accessToken, { multipart: data.thumbnail ? true : false })
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/album")
        },
        GetById: async (data) => {
            return await this.#POST_REQUEST("/album/find", data)
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/album/delete", data, this.accessToken)
        }
    }

    // Medias methods
    medias = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/media/create", data, this.accessToken, { multipart: true })
        },
        GetById: async (data) => {
            return await this.#POST_REQUEST("/media/find", data)
        },
        GetByAlbumId: async (data) => {
            return await this.#POST_REQUEST("/media/find-by-album", data, this.accessToken)
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/media")
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/media/delete", data, this.accessToken)
        }
    }

    // Sheets methods
    sheets = {
        Create: async (data) => {
            return await this.#POST_REQUEST("/sheet/create", data, this.accessToken, { multipart: true })
        },
        GetAll: async () => {
            return await this.#GET_REQUEST("/sheet")
        },
        GetById: async (data) => {
            return await this.#POST_REQUEST("/sheet/find", data)
        },
        Update: async (data) => {
            return await this.#PATCH_REQUEST("/sheet/update", data, this.accessToken, { multipart: data.sheetFile ? true : false })
        },
        Delete: async (data) => {
            return await this.#DELETE_REQUEST("/sheet/delete", data, this.accessToken)
        }
    }


    updateAccessToken = (token) => {
        // localStorage.setItem("accessToken", token)
        return this.accessToken = token
    }
}

export default ApiHandler;