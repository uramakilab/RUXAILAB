/**
 * Represents the test structure options.
 */
export default class TestStructureOptions {
  /**
   * @param {Partial<TestStructureOptions>} partial
   */
  constructor({ text, value } = {}) {
    /**
     * Defines the option text.
     *
     * @type {string}
     */
    this.text = text

    /**
     * Defines the option value.
     *
     * @type {number}
     */
    this.value = value ?? ''
  }

  /**
   * Creates a new text structure option model from the given map.
   * @param {Partial<TestStructureOptions>} map a map to be converted.
   * @returns a new text structure option model.
   */
  static toTestStructureOptions(map) {
    return new TestStructureOptions(map)
  }
}
