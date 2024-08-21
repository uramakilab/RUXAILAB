/**
 * Represents a test admin.
 */
export default class TestAdmin {
  /**
   * @param {Partial<TestAdmin>} partial
   */
  constructor({ email, userDocId } = {}) {
    /**
     * Defines the admin email.
     *
     * @type {string}
     */
    this.email = email

    /**
     * Defines the admin document id.
     *
     * @type {string}
     */
    this.userDocId = userDocId
  }

  /**
   * Converts a map into a test admin model.
   *
   * @param {Partial<TestAdmin>} data a map to be converted.
   * @returns a new test admin model.
   */
  static toTestAdmin(data) {
    return new TestAdmin(data)
  }

  /**
   * Creates a Firestore map from the current model.
   *
   * @returns a map that represents the current model.
   */
  toFirestore() {
    return {
      email: this.email,
      userDocId: this.userDocId,
    }
  }
}
