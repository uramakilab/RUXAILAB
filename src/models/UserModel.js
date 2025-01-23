/**
 * Create a User.
 * @param {number} accessLevel - The accessLevel value.
 * @param {string} email - The email value.
 * @param {Object[]} notifications - An array of Notification value.
 * @param {Object[]} myAnswers - An array of UserAnswer value.
 * @param {Object[]} myTests - An array of UserTest value.
 * @param {Object[]} inbox - An array of past Notification values.
 */

export default class User {
    constructor({
        id, accessLevel, email, notifications = [], myAnswers = [], myTests = [], inbox = [],
    } = {}) {
        this.id = id
        this.accessLevel = accessLevel
        this.email = email
        this.notifications = notifications
        this.myAnswers = myAnswers
        this.myTests = myTests
        this.inbox = inbox // Add inbox field
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
            inbox: this.inbox, // Include inbox in Firestore representation
        }
    }

    /**
     * Move all current notifications to the inbox.
     */
    archiveNotifications() {
        this.inbox = [...this.inbox, ...this.notifications] // Add notifications to inbox
        this.notifications = [] // Clear current notifications
    }
}
