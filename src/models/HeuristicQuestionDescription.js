     /**
     * Create a HeuristicQuestionDescription.
     * @param {string} text - The text value.
     * @param {string} title - The title value.
     */

export default class HeuristicQuestionDescription{
    constructor({
        text,
        title,
    } = {},
    ) {
        this.text = text
        this.title = title
    }
    static toHeuristicQuestionDescription(data) {
        return new HeuristicQuestionDescription(data)
    }
}