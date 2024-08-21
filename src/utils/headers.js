const cooperatorsHeaders = [
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'accessLevel' },
  { text: 'Invited', value: 'invited', justify: 'center' },
  { text: 'Accepted', value: 'accepted', justify: 'center' },
  { text: 'More', value: 'more', sortable: false },
]

const heuristicsStatisticsHeaders = [
  { text: 'HEURISTICS', align: 'start', sortable: false, value: 'name' },
  { text: 'Percentage of use', value: 'max', align: 'center', sortable: false },
  { text: 'Standard deviation', value: 'sd', align: 'center', sortable: false },
  { text: 'Average', value: 'average', align: 'center', sortable: false },
  { text: 'Max', value: 'max', align: 'center', sortable: false },
  { text: 'Min', value: 'min', align: 'center', sortable: false },
]

const evaluatorStatisticsHeaders = [
  { text: 'Evaluator', align: 'start', sortable: false, value: 'evaluator' },
  { text: 'Usability Percentage', value: 'result', align: 'center' },
  { text: 'Applicable Question(s)', value: 'aplication', align: 'center' },
  { text: 'No Applicable Question(s)', value: 'noAplication', align: 'center' },
  { text: 'Conclusion Percentage', value: 'answered', align: 'center' },
]

const reportHeaders = [
  { text: 'Evaluator', value: 'email' },
  { text: 'Last Update', value: 'log.date' },
  { text: 'Progress', value: 'progress', justify: 'center' },
  { text: 'Status', value: 'log.status' },
  { text: 'More', value: 'more', justify: 'end' },
]

const userHeaders = [
  {
    text: 'Id',
    align: 'start',
    value: 'id',
  },
  { text: 'E-mail', value: 'email', align: 'center' },
  { text: 'Access Level', value: 'accessLevel', align: 'center' },
  { text: 'Actions', value: 'actions', align: 'end', sortable: false },
]

const testsHeaders = [
  {
    text: 'Title',
    align: 'start',
    value: 'title',
  },
  { text: 'Created by', value: 'admin.email' },
  { text: 'Actions', value: 'actions', align: 'end', sortable: false },
]
export {
  cooperatorsHeaders,
  heuristicsStatisticsHeaders,
  evaluatorStatisticsHeaders,
  reportHeaders,
  userHeaders,
  testsHeaders,
}
