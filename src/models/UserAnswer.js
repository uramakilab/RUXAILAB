/**
 * Create a UserAnswer.
 * @param {string} answerDocId - The answerDocId value.
 * @param {number} accessLevel - The accessLevel value.
 * @param {number} progress - The progress value.
 * @param {number} total - The total value.
 * @param {string} testType - The testType value.
 * @param {string} testTitle - The testTitle value.
 * @param {string} testDocId - The testDocId value.
 * @param {string} updateDate - The updateDate value.
 * @param {string} testAuthorEmail - The testAuthorEmail value.
 */

export default class UserAnswer {
  constructor({
    answerDocId,
    accessLevel,
    progress,
    total,
    testType,
    userTestType,
    testTitle,
    testDocId,
    updateDate,
    testAuthorEmail,
  }) {
    this.answerDocId = answerDocId
    this.accessLevel = accessLevel
    this.progress = progress
    this.total = total
    this.testType = testType
    this.userTestType = userTestType
    this.testTitle = testTitle
    this.testDocId = testDocId
    this.updateDate = updateDate
    this.testAuthorEmail = testAuthorEmail
  }
  static toUserAnswer(data) {
    return new UserAnswer(data)
  }

  toFirestore() {
    return {
      answerDocId: this.answerDocId,
      accessLevel: this.accessLevel,
      progress: this.progress,
      total: this.total,
      testType: this.testType,
      userTestType: this.userTestType,
      testTitle: this.testTitle,
      testDocId: this.testDocId,
      updateDate: this.updateDate,
      testAuthorEmail: this.testAuthorEmail,
    }
  }
}
