export default class UserTask {
  constructor({
    taskId,
    taskAnswer,
    taskObservations,
    taskTime,
    completed,
    audioRecordURL,
    screenRecordURL,
    webcamRecordURL,
    postAnswer,
  } = {}) {
    this.taskId = taskId ?? null
    this.taskAnswer = taskAnswer ?? ''
    this.taskObservations = taskObservations ?? ''
    this.taskTime = taskTime ?? null
    this.completed = completed ?? false
    this.audioRecordURL = audioRecordURL ?? null
    this.screenRecordURL = screenRecordURL ?? null
    this.webcamRecordURL = webcamRecordURL ?? null
    this.postAnswer = postAnswer ?? null
  }

  static toUserTask(data) {
    return new UserTask(data)
  }

  toFirestore() {
    return {
      taskId: this.taskId,
      taskAnswer: this.taskAnswer,
      taskObservations: this.taskObservations,
      taskTime: this.taskTime,
      completed: this.completed,
      audioRecordURL: this.audioRecordURL,
      screenRecordURL: this.screenRecordURL,
      webcamRecordURL: this.webcamRecordURL,
      postAnswer: this.postAnswer,
    }
  }
}
