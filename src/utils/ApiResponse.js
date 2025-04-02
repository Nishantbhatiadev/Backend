class apiResponse {
    constructor(statusCode, data, messase = "success") {
        this.statusCode = statusCode
        this.data = data
        this.messase = messase
        this.success = statusCode < 400
    }
}


export { apiResponse }