     /**
     * Create a HeuristicQuestion.
     * @param {number} id - The id value.
     * @param {string} title - The title value.
     * @param {Object[]} descriptions  - An array of HeuristicQuestionDescription value.
     * @param {string} text - The text value.
     */

export default class HeuristicQuestion{
    constructor({
        id,
        title,
        descriptions,
        text,
    } = {},
    ) {
        this.id = id
        this.title = title
        this.descriptions = descriptions
        this.text = text
    }
    static toHeuristicQuestion(data) {
        return new HeuristicQuestion(data)
    }
}