import Controller from '@/controllers/BaseController'
import Template from '@/models/Template'
const COLLECTION = 'templates'

export default class TemplateController extends Controller {
  constructor() {
    super()
  }

  async createTemplate(data) {
    return super.create(COLLECTION, data.toFirestore())
  }

  async getPublicTemplates() {
    const q = {
      field: 'header.isTemplatePublic',
      value: true,
      condition: '==',
    }
    const res = await super.query(COLLECTION, q)
    return res.docs.map((t) =>
      Template.toTemplate(Object.assign({ id: t.id }, t.data())),
    )
  }

  async getTemplatesOfUser(userDocId) {
    const q = {
      field: 'header.templateAuthor.userDocId',
      value: userDocId,
      condition: '==',
    }
    const res = await super.query(COLLECTION, q)
    return res.docs.map((t) =>
      Template.toTemplate(Object.assign({ id: t.id }, t.data())),
    )
  }

  async deleteTemplate(templateId) {
    return await super.delete(COLLECTION, templateId)
  }
}
