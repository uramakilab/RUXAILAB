/**
 * Create a User.
 * @param {number} accessLevel - The accessLevel value.
 * @param {string} email - The email value.
 * @param {Object[]} notifications - An array of Notification value.
 * @param {Object[]} myAnswers - An array of UserAnswer value.
 * @param {Object[]} myTests - An array of UserTest value.
 */

export default class User {
    constructor({
        id, accessLevel, email, notifications, myAnswers, myTests,
    } = {},
    ) {
        this.id = id
        this.accessLevel = accessLevel
        this.email = email
        this.notifications = notifications
        this.myAnswers = myAnswers
        this.myTests = myTests
    }
    static toUser(data) {
        return new User({
            ...data,
        })
    }

    toFirestore() {
        return {
            accessLevel: this.accessLevel,
            email: this.email,
            notifications: this.notifications,
            myAnswers: this.myAnswers,
            myTests: this.myTests,
        }
    }
}