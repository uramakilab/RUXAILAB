/**
 * Represents the test template document.
 */
export default class TestTemplateDoc {
  /**
   * @param {Partial<TestTemplateDoc>} partial
   */
  constructor({ templateDocId, templateName, fromTemplate } = {}) {
    /**
     * Defines the template document id.
     *
     * @type {string}
     */
    this.templateDocId = templateDocId

    /**
     * Defines the template name.
     *
     * @type {string}
     */
    this.templateName = templateName

    /**
     * Defines whether the document is from a template.
     *
     * @type {boolean}
     */
    this.fromTemplate = fromTemplate
  }

  /**
   * Creates a new test template document model from the given map.
   * @param {Partial<TestTemplateDoc>} data a map to be converted.
   * @returns a new test template document model.
   */
  static toTestTemplateDoc(data) {
    return new TestTemplateDoc(data)
  }
}
