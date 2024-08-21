     /**
     * Create a UserTemplate.
     * @param {string} templateDocid - The templateDocid value.
     * @param {string} templateTitle - The templateTitle value.
     * @param {string} templateType - The templateType value.
     * @param {string} templateVersion - The templateVersion value.
     * @param {string} creationDate - The creationDate value.
     * @param {string} updateDate - The updateDate value.
     * @param {string} templateDescription - The templateDescription value.
     * @param {boolean} isPublic - The isPublic value.
     */

export default class UserTemplate{
    constructor({
        templateDocid, templateTitle, templateType, templateVersion, creationDate, updateDate, templateDescription, isPublic,
    } = {},
    ) {
        this.templateDocid = templateDocid
        this.templateTitle = templateTitle
        this.templateType = templateType
        this.templateVersion = templateVersion
        this.creationDate = creationDate
        this.updateDate = updateDate
        this.templateDescription = templateDescription
        this.isPublic = isPublic
    }
    static toUserTemplate(data) {
        return new UserTemplate(data)
    }
}