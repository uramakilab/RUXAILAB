/**
* Create a TemplateBody.
* @param {string} testDescription - The testDescription value.
* @param {string} testTitle - The testTitle value.
* @param {string} testType - The testType value.
* @param {Object} testStructure - The TestStructure value.
*/

export default class TemplateBody {
    constructor({
        testDescription, testTitle, testType, testStructure, testOptions,
    } = {},
    ) {
        this.testDescription = testDescription
        this.testTitle = testTitle
        this.testType = testType
        this.testStructure = testStructure
        this.testOptions = testOptions
    }
    static toTemplateBody(data) {
        return new TemplateBody(data)
    }
    toFirestore() {
        return {
            testDescription: this.testDescription,
            testTitle: this.testTitle,
            testType: this.testType,
            testStructure: this.testStructure,
            testOptions: this.testOptions,
        }
    }
}