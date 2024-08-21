/**
 * Create a HeuristicAnswer.
 * @param {Object[]} heuristicQuestions  - An array of HeuristicQuestionAnswer value.
 * @param {number} progress - The progress value.
 * @param {number} total - The total value.
 * @param {boolean} submitted - The submitted value.
 * @param {string} userDocId - The userDocId value.
 * @param {number} lastUpdate - The date of the last update.
 */

import Heuristic from '@/models/Heuristic'

export default class HeuristicAnswer {
  constructor({
    heuristicQuestions,
    progress,
    total,
    submitted,
    userDocId,
    lastUpdate,
  } = {}) {
    this.heuristicQuestions = heuristicQuestions ?? []
    this.progress = progress ?? 0
    this.total = total ?? 0
    this.submitted = submitted ?? false
    this.userDocId = userDocId ?? null
    this.lastUpdate = lastUpdate ?? 0
  }
  static toHeuristicAnswer(data, testOptions) {
    return new HeuristicAnswer({
      ...data,
      heuristicQuestions: data.heuristicQuestions.map((h) =>
        Heuristic.toHeuristic(h, testOptions),
      ),
    })
  }

  toFirestore() {
    return {
      heuristicQuestions: this.heuristicQuestions.map((h) => h.toFirestore()),
      progress: this.progress,
      total: this.total,
      submitted: this.submitted,
      userDocId: this.userDocId,
      lastUpdate: this.lastUpdate,
    }
  }
}
