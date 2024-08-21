/**
 * Represents the cooperators model.
 */
export default class Cooperators {
  /**
   * @param {Partial<Cooperators>} partial
   */
  constructor({
    userDocId,
    email,
    accessLevel,
    invited,
    accepted,
    progress,
    updateDate,
    testAuthorEmail,
    token,
  } = {}) {
    /**
     * Defines the user document id.
     *
     * @type {string}
     */
    this.userDocId = userDocId

    /**
     * Defines the user email.
     *
     * @type {string}
     */
    this.email = email

    /**
     * Defines the cooperator access level.
     *
     * @type {number}
     */
    this.accessLevel = accessLevel

    /**
     * Defines whether the cooperator was invited.
     *
     * @type {boolean}
     */
    this.invited = invited

    /**
     * Defines whether the cooperator was accepted.
     *
     * @type {boolean}
     */
    this.accepted = accepted

    /**
     * Defines the cooperator progress.
     *
     * @type {number}
     */
    this.progress = progress

    /**
     * Defines a timestamp of the cooperator last updated date.
     *
     * @type {number}
     */
    this.updateDate = updateDate

    /**
     * Defines a timestamp of the cooperator last updated date.
     *
     * @type {String}
     */
    this.testAuthorEmail = testAuthorEmail

    /**
     * Defines a timestamp of the cooperator last updated date.
     *
     * @type {String}
     */
    this.token = token
  }

  /**
   * Creates a new cooperators model from the given map.
   * @param {Partial<Cooperators>} map the map to be converted.
   * @returns a new cooperators model.
   */
  static toCooperators(map) {
    return new Cooperators(map)
  }

  /**
   * Creates a Firestore map from the current model.
   *
   * @returns a map that represents the current model.
   */
  toFirestore() {
    return {
      userDocId: this.userDocId,
      email: this.email,
      accessLevel: this.accessLevel,
      invited: this.invited,
      accepted: this.accepted,
      progress: this.progress,
      updateDate: this.updateDate,
      testAuthorEmail: this.testAuthorEmail,
      token: this.token,
    }
  }
}