/**
* Create a TemplateHeader.
* @param {Object} templateAuthor - The TemplateAuthor value.
* @param {string} creationDate - The creationDate value.
* @param {string} updateDate - The updateDate value.
* @param {string} templateDescription - The templateDescription value.
* @param {boolean} isTemplatePublic - The isTemplatePublic value.
* @param {string} templateTitle - The templateTitle value.
* @param {string} templateVersion - The templateVersion value.
* @param {string} templateType - The templateType value.
*/

import TemplateAuthor from './TemplateAuthor'

export default class TemplateHeader {
    constructor({
        templateAuthor, creationDate, updateDate, templateDescription, isTemplatePublic, templateTitle, templateVersion, templateType,
    } = {},
    ) {
        this.templateAuthor = templateAuthor
        this.creationDate = creationDate
        this.updateDate = updateDate
        this.templateDescription = templateDescription
        this.isTemplatePublic = isTemplatePublic ?? false
        this.templateTitle = templateTitle
        this.templateVersion = templateVersion
        this.templateType = templateType
    }
    static toTemplateHeader(data) {
        return new TemplateHeader({
            ...data,
            templateAuthor: TemplateAuthor.toTemplateAuthor(data.templateAuthor),
        })
    }
    toFirestore() {
        return {
            templateAuthor: this.templateAuthor.toFirestore(),
            creationDate: this.creationDate,
            updateDate: this.updateDate,
            templateDescription: this.templateDescription,
            isTemplatePublic: this.isTemplatePublic,
            templateTitle: this.templateTitle,
            templateVersion: this.templateVersion,
            templateType: this.templateType,
        }
    }
}