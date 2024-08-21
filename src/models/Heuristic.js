/**
 * Create a Heuristic.
 * @param {number} id - The heuristicId value.
 * @param {string} title - The heuristicTitle value.
 * @param {Object[]} questions  - An array of HeuristicQuestion value.
 * @param {number} total -Total number of heuristics
 */

import HeuristicQuestionAnswer from './HeuristicQuestionAnswer'

export default class Heuristic {
    constructor({
        heuristicId,
        heuristicTitle,
        heuristicQuestions,
        heuristicTotal,
    } = {}) {
        this.heuristicId = heuristicId
        this.heuristicTitle = heuristicTitle
        this.heuristicQuestions = heuristicQuestions
        this.heuristicTotal = heuristicTotal
    }
    static toHeuristic(data, testOptions) {
        return new Heuristic({
            ...data,
            heuristicQuestions: data.heuristicQuestions.map((h) => HeuristicQuestionAnswer.toHeuristicQuestionAnswer(h, testOptions)),
        })
    }

    toFirestore() {
        return {
            heuristicId: this.heuristicId,
            heuristicTitle: this.heuristicTitle,
            heuristicQuestions: this.heuristicQuestions.map((h) => h.toFirestore()),
            heuristicTotal: this.heuristicTotal,
        }
    }
}
