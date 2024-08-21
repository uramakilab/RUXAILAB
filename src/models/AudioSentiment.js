/**
 * Create an Audio Sentiment Object for Unmoderated Test (Evaluator Side).
 * @param {string} answerDocId - The document ID related to the audio answer.
 * @param {Object[]} regions - An array of sentiment regions in the audio.
 * @param {number} regions[].start - The start time of the sentiment region (in seconds).
 * @param {number} regions[].end - The end time of the sentiment region (in seconds).
 * @param {string} regions[].transcipt - The transcipt of the sentiment region.
 * @param {string} regions[].sentiment - The sentiment expressed in this region.
 * @param {number} regions[].confidence - The sentiment confidence for the region.
 */

export default class AudioSentiment {
    /**
     * Constructs an instance of AudioSentiment.
     * @param {Object} params - The parameters for the AudioSentiment instance.
     * @param {string} [params.id=null] - The unique ID of the document (optional).
     * @param {string} params.answerDocId - The Answer document ID.
     * @param {string} params.userDocId - The User document ID.
     * @param {number} regionsCount - The number of sentiment regions in the audio.
     * @param {Object[]} params.regions - An array of sentiment regions in the audio.
     * @param {number} params.regions[].idx - The index of the sentiment region.
     * @param {number} params.regions[].start - The start time of the sentiment region (in seconds).
     * @param {number} params.regions[].end - The end time of the sentiment region (in seconds).
     * @param {string} params.regions[].transcript - The transcript of the sentiment region.
     * @param {string} params.regions[].sentiment - The sentiment expressed in this region.
     * @param {number} params.regions[].confidence - The sentiment confidence for the region.
     */
    constructor({ id = null, answerDocId, userDocId, regionsCount, regions } = {}) {

        /**
         * The unique ID of the document (optional)
         * @type {string|null}
         */
        this.id = id;

        /**
         * The Answer document ID
         * @type {string}
         */
        this.answerDocId = answerDocId;

        /**
         * The User document ID
         * @type {string}
         */
        this.userDocId = userDocId;

        /**
         * The number of sentiment regions in the audio.
         * @type {number}
         */
        this.regionsCount = regionsCount;

        /**
         * An array of sentiment regions in the audio.
         * @type {Object[]}
         */
        this.regions = regions;
    }

    /**
     * Creates a new AudioSentiment instance from a plain object (e.g., from Firestore).
     * Converts a plain object (often from a database or API response) into an instance of AudioSentiment.
     * 
     * @param {Object} data - The raw data to convert into an AudioSentiment instance.
     * @param {string} data.id - The unique ID of the document.
     * @param {string} data.answerDocId - The Answer document ID.
     * @param {string} data.userDocId - The User document ID.
     * @param {Object[]} data.regions - An array of sentiment regions in the audio.
     * @param {number} data.regions[].start - The start time of the sentiment region (in seconds).
     * @param {number} data.regions[].end - The end time of the sentiment region (in seconds).
     * @param {string} data.regions[].transcript - The transcript of the sentiment region.
     * @param {string} data.regions[].sentiment - The sentiment expressed in this region.
     * @param {number} data.regions[].confidence - The sentiment confidence for the region.
     * @returns {AudioSentiment} - The newly created AudioSentiment instance.
     */
    static toAudioSentiment(data) {
        return new AudioSentiment({
            id: data.id, // Include the ID here
            answerDocId: data.answerDocId,
            userDocId: data.userDocId,
            regionsCount: data.regionsCount,
            regions: data.regions.map(region => ({
                idx: region.idx,
                start: region.start,
                end: region.end,
                transcript: region.transcript, // Fixed typo here
                sentiment: region.sentiment,
                confidence: region.confidence
            }))
        });
    }

    /**
     * Converts the AudioSentiment instance to a format suitable for Firestore.  []
     * 
     * @returns {Object} - The object representation of the AudioSentiment instance.
     * @returns {string} - The Answer document ID.
     * @returns {string} - The User document ID.
     * @returns {number} - The number of sentiment regions in the audio.
     * @returns {Object[]} - An array of sentiment regions in the audio.
     * @returns {number} - The index of the sentiment region.
     * @returns {number} - The start time of the sentiment region (in seconds).
     * @returns {number} - The end time of the sentiment region (in seconds).
     * @returns {string} - The transcript of the sentiment region.
     * @returns {string} - The sentiment expressed in this region.
     * @returns {number} - The sentiment confidence for the region.
     * 
     * Note: The document ID is not included in the returned object as Firestore manages it separately.
     */
    toFirestore() {
        return {
            answerDocId: this.answerDocId,
            userDocId: this.userDocId,
            regionsCount: this.regionsCount,
            regions: this.regions.map(region => ({
                idx: region.idx,
                start: region.start,
                end: region.end,
                transcript: region.transcript,
                sentiment: region.sentiment,
                confidence: region.confidence
            }))
        };
    }
};