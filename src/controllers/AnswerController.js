// import Answer from "@/models/Answer"

import Controller from '@/controllers/BaseController'
import Answer from '@/models/Answer'
import UserController from './UserController'
const COLLECTION = 'answers'

const userController = new UserController()

export default class AnswerController extends Controller {
  async getAllAnswers() {
    const res = await super.readAll(COLLECTION)

    return res.map((a) => new Answer({ ...a, id: a.id }))
  }

  async getAnswerById(payload) {
    const res = await super.readOne(COLLECTION, payload)
    return new Answer({ id: res.id, ...res.data() })
  }

  async createAnswer(payload) {
    return super.create(COLLECTION, payload.toFirestore())
  }

  async updateUserAnswer(payload) {
    const userToUpdate = await userController.getById(payload.cooperatorId)

    // const index = userToUpdate.myAnswers.findIndex((a) => a.testDocId === payload.testDocId)
    // userToUpdate.myAnswers[index] = Object.assign(userToUpdate.myAnswers[index], payload.data)

    userToUpdate.myAnswers[`${payload.testDocId}`] = Object.assign(
      userToUpdate.myAnswers[`${payload.testDocId}`],
      payload.data,
    )
    return userController.update(userToUpdate.id, userToUpdate.toFirestore())
  }

  async removeUserAnswer(payload) {
    const userToUpdate = await userController.getById(payload.cooperatorId)
    // const index = userToUpdate.myAnswers.findIndex((a) => a.testDocId === payload.testDocId)

    // Delete answers document
    // const answerDocumentId = userToUpdate.myAnswers[index].answerDocId
    const answerDocumentId =
      userToUpdate.myAnswers[`${payload.testDocId}`].testDocId
    await super.delete(COLLECTION, answerDocumentId)

    // Remove it from user
    // userToUpdate.myAnswers.splice(index, 1)
    delete userToUpdate.myAnswers[`${payload.testDocId}`]
    return userController.update(userToUpdate.id, userToUpdate.toFirestore())
  }

  async saveTestAnswer(payload, answerDocId, testType) {
    payload.lastUpdate = Date.now()

    const fieldToUpdate = {}

    if (testType === 'HEURISTICS') {
      fieldToUpdate[
        `heuristicAnswers.${payload.userDocId}`
      ] = payload.toFirestore()
    } else if (testType === 'User') {
      fieldToUpdate[`taskAnswers.${payload.userDocId}`] = payload.toFirestore()
    }
    await super.update(COLLECTION, answerDocId, fieldToUpdate)
  }
}
