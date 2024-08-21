// imports

import Controller from '@/controllers/BaseController'
import User from '@/models/UserModel'
const COLLECTION = 'users'

export default class UserController extends Controller {
  constructor() {
    super()
  }
  async create(payload) {
    const user = new User({
      email: payload.email,
      accessLevel: 1,
      myTests: {},
      myAnswers: {},
      notifications: [],
    }).toFirestore()
    return super.set(COLLECTION, payload.id, user)
  }

  async update(docId, payload) {
    return super.update(COLLECTION, docId, payload)
  }

  async readAll() {
    const docs = await super.readAll(COLLECTION)
    return docs.map((doc) => new User(doc))
  }

  async getById(docId) {
    const res = await super.readOne(COLLECTION, docId)
    return new User.toUser(Object.assign({ id: res.id }, res.data()))
  }

  async addNotification(payload) {
    // Add Notification to User
    const userToUpdate = await this.getById(payload.userId)
    userToUpdate.notifications.push(payload.notification.toFirestore())
    return this.update(payload.userId, userToUpdate.toFirestore())
  }

  async markNotificationAsRead(payload) {
    const userToUpdate = new User(payload.user)
    const index = userToUpdate.notifications.findIndex(
      (n) => n.createdDate === payload.notification.createdDate,
    )
    if (index !== -1) {
      userToUpdate.notifications[index].read = true

      userToUpdate.notifications.splice(index, 1)

      const updatedUser = await this.update(
        userToUpdate.id,
        userToUpdate.toFirestore(),
      )
      return updatedUser
    } else {
      throw new Error('Notification not found.')
    }
  }
  async removeNotificationsForTest(testId, cooperators) {
    try {
      for (let cooperator = 0; cooperator < cooperators.length; cooperator++) {
        const userDocID = cooperators[cooperator].userDocId

        // Lê o documento do usuário diretamente
        const userDoc = await super.readOne('users', userDocID)

        // Verifica se o documento do usuário existe
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const userId = userDoc.id

          // Verificar se o usuário tem notificações
          if (userData.notifications && userData.notifications.length > 0) {
            // Filtrar notificações que têm o testId correspondente
            userData.notifications = userData.notifications.filter(
              (notification) => notification.testId !== testId,
            )
            // Atualizar o documento do usuário com as notificações filtradas
            await super.update('users', userId, {
              notifications: userData.notifications,
            })
          }
        } else {
          console.log(`User document with ID ${userDocID} not found.`)
        }
      }

      console.log(`Notifications for test ${testId} removed from all users.`)
    } catch (error) {
      console.error('Error removing notifications for the test:', error)
      throw error
    }
  }

  async removeTestFromUser(userId, testIdToRemove) {
    try {
      const userDoc = await super.readOne('users', userId)

      if (!userDoc.exists()) {
        console.log('User not found.')
        return
      }
      const userData = userDoc.data()
      console.log(userData)

      if (userData.myTests[testIdToRemove]) {
        delete userData.myTests[testIdToRemove]
      }
      if (userData.myAnswers[testIdToRemove]) {
        delete userData.myAnswers[testIdToRemove]
      }

      await super.update('users', userId, userData)

      console.log(`Test ${testIdToRemove} removed from user ${userId}'s data.`)
    } catch (error) {
      console.error('Error removing test from user:', error)
      throw error
    }
  }
}
