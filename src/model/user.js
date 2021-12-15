class UserModal {
    constructor(
        firstname = "",
        lastname = "",
        username = "",
        avatar_url = "",
        password = "",
        isVerified = false,
        emailToken = "",
        id = null) {
        this.id = firstname
        this.lastname = lastname
        this.avatar_url = avatar_url
        this.username = username
        this.password = password
        this.id = id
        this.isVerified = isVerified
        this.emailToken = emailToken

    }
    setVerified = (isVerified) => this.isVerified = isVerified
    setMailToken = (emailToken) => this.emailToken = emailToken
}
exports.UserModal = UserModal