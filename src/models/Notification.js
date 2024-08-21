/**
 * Create a Notification.
 * @param {string} title - The title value.
 * @param {string} description - The description value.
 */

export default class Notification {
  constructor({
    title,
    description,
    redirectsTo,
    author,
    read,
    testId,
    accessLevel,
  } = {}) {
    this.title = title
    this.description = description
    this.redirectsTo = redirectsTo
    this.createdDate = Date.now()
    this.author = author
    this.read = read
    this.testId = testId
    this.accessLevel = accessLevel ?? null
  }
  static toNotification(data) {
    return new Notification(data)
  }

  toFirestore() {
    return {
      title: this.title,
      description: this.description,
      redirectsTo: this.redirectsTo,
      createdDate: this.createdDate,
      author: this.author,
      read: this.read,
      testId: this.testId,
      accessLevel: this.accessLevel,
    }
  }
}
