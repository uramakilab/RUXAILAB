import TestView from '@/views/cardSorting/TestView.vue'
import ManagerView from '@/views/cardSorting/ManagerView'
import EditTestView from '@/views/cardSorting/EditTestView.vue'
import SettingsView from '@/views/cardSorting/SettingsView.vue'

export default [
  {
    path: '/cardSorting/managerview/:id',
    name: 'CardSortingManagerView',
    meta: { authorize: [0, 1] },
    component: ManagerView,
    props: true,
    children: [
      {
        path: '/cardSorting/edittest/:id',
        name: 'CardSortingEditTest',
        props: true,
        meta: { authorize: [0, 1] },
        component: EditTestView,
      },
      {
        path: '/cardSorting/settingsview/:id',
        name: 'CardSortingSettingsView',
        props: true,
        meta: { authorize: [0, 1] },
        component: SettingsView,
      },
    ],
  },
  {
    path: '/cardSorting/testview/:id/:token?',
    name: 'CardSortingTestView',
    props: true,
    meta: { authorize: [] },
    component: TestView,
  },
]