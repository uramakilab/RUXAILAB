/**
 * Represents the test structure.
 */
export default class TestStructure {
  /**
   * @param {Partial<TestStructure>} partial
   */
  constructor({ heuristicList, options, userTasks } = {}) {
    /**
     * Defines an array of Heuristic value.
     *
     * @type {Heuristic>[]}
     */
    this.heuristicList = heuristicList ?? []

    /**
     * Defines an array of test structure options.
     *
     * @type {TestStructureOptions}
     */
    this.options = options

    /**
     * Defines an array of user tasks.
     *
     * @type {UserTask[]}
     */
    this.userTasks = userTasks
  }

  /**
   * Creates a new test structure according to the given map.
   *
   * @param {Partial<TestStructure>} map a map to be converted.
   * @returns a new test structure map.
   */
  static toTestStructure(map) {
    return new TestStructure(map)
  }
}
