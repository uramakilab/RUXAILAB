/**
 * Create a Template.
 * @param {TemplateBody} body - The TemplateBody value.
 * @param {TemplateHeader} header - The TemplateHeader value.
 */

import TemplateBody from './TemplateBody'
import TemplateHeader from './TemplateHeader'

export default class Template {
  constructor({ id, header, body } = {}) {
    this.id = id
    this.header = header
    this.body = body
  }
  static toTemplate(data) {
    return new Template({
      id: data.id ?? null,
      body: TemplateBody.toTemplateBody(data.body),
      header: TemplateHeader.toTemplateHeader(data.header),
    })
  }
  toFirestore() {
    return {
      header: this.header.toFirestore(),
      body: this.body.toFirestore(),
    }
  }
}
