<template>
  <div>
    <v-overlay v-if="loading" v-model="loading" class="text-center">
      <v-progress-circular indeterminate color="#fca326" size="50" />
      <div class="white-text mt-3">
        {{ $t('HeuristicsCooperators.messages.cooperators_loading') }}
      </div>
    </v-overlay>
    <Intro
      v-if="cooperatorsEdit.length == 0 && intro && !loading && showCoops"
      @closeIntro="intro = false"
    />

    <v-row justify="center">
      <v-container class="ma-0 pa-0">
        <Snackbar />
        <!-- Leave alert dialog -->
        <v-dialog v-model="dialog" width="600" persistent>
          <LeaveAlert />
        </v-dialog>

        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              dark
              fab
              fixed
              bottom
              right
              color="#F9A826"
              v-bind="attrs"
              @click="saveInvitations()"
              v-on="on"
            >
              <v-icon large>
                mdi-email
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('HeuristicsCooperators.actions.send_invitation') }}</span>
        </v-tooltip>

        <ShowInfo :title="$t('HeuristicsCooperators.title.cooperators')">
          <div slot="content" class="ma-0 pa-0" style="background: #f5f7ff">
            <v-chip
              v-for="(coop, i) in selectedCoops"
              :key="i"
              class="ml-2 mt-2"
              close
              @click:close="removeSelectedCoops(i)"
            >
              {{ typeof coop == 'object' ? coop.email : coop }}
            </v-chip>
            <v-row class="ma-0 pa-0 pt-3" align="center">
              <v-col class="ma-0 pa-0" cols="12" md="10">
                <v-combobox
                  :key="comboboxKey"
                  ref="combobox"
                  v-model="comboboxModel"
                  :hide-no-data="false"
                  :autofocus="comboboxKey == 0 ? false : true"
                  style="background: #f5f7ff"
                  :items="users"
                  item-text="email"
                  :label="$t('HeuristicsCooperators.actions.select_cooperator')"
                  multiple
                  outlined
                  dense
                  color="#fca326"
                  class="mx-2"
                  @input="validateEmail()"
                >
                  <template v-slot:no-data>
                    {{ $t('HeuristicsCooperators.messages.no_users') }}
                  </template>
                </v-combobox>
              </v-col>
              <v-col class="ma-0 pa-0" cols="12" md="2">
                <v-select
                  v-model="selectedRole"
                  class="mx-2"
                  :label="$t('HeuristicsCooperators.headers.role')"
                  color="#fca326"
                  outlined
                  dense
                  :items="roleOptions"
                />
              </v-col>
            </v-row>
            <v-data-table
              dense
              style="background: #f5f7ff"
              :items="cooperatorsEdit"
              :headers="headers"
              height="450px"
              :items-per-page="7"
              items-per-page-text="7"
              :footer-props="{
                'items-per-page-options': [7],
              }"
            >
              <!-- Email -->
              <template v-slot:item.email="{ item }">
                <v-row align="center">
                  <v-icon class="mr-2">
                    mdi-account-circle
                  </v-icon>
                  <div>{{ item.email }}</div>
                </v-row>
              </template>

              <!-- Role -->
              <template v-slot:item.accessLevel="{ item }">
                <v-select
                  :ref="'select' + cooperatorsEdit.indexOf(item)"
                  :key="dataTableKey"
                  color="#fca326"
                  style="max-width: 200px"
                  :value="item.accessLevel"
                  return-object
                  dense
                  :items="roleOptions"
                  :v-text="item.accessLevel.text"
                  :disabled="!item.invited || item.accepted ? false : true"
                  class="mt-3"
                  @change="changeRole(item, $event)"
                />
              </template>

              <!-- Invited -->
              <template v-slot:item.invited="{ item }">
                <v-icon v-if="item.invited" color="#8EB995">
                  mdi-checkbox-marked-circle-outline
                </v-icon>
                <v-icon v-else color="#F47C7C">
                  mdi-close-circle-outline
                </v-icon>
              </template>

              <!-- Accepted -->
              <template v-slot:item.accepted="{ item }">
                <v-icon v-if="item.accepted == null" color="#F9A826">
                  mdi-checkbox-blank-circle-outline
                </v-icon>
                <v-icon v-else-if="item.accepted" color="#8EB995">
                  mdi-checkbox-marked-circle-outline
                </v-icon>
                <v-icon v-else color="#F47C7C">
                  mdi-close-circle-outline
                </v-icon>
              </template>

              <!-- More -->
              <template v-slot:item.more="{ item }">
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      link
                      @click=";(messageModel = true), (selectedUser = item)"
                    >
                      <v-list-item-title>
                        {{ $t('HeuristicsCooperators.actions.send_message') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="item.accepted == false"
                      link
                      @click="reinvite(item)"
                    >
                      <v-list-item-title>
                        {{ $t('HeuristicsCooperators.actions.reinvite') }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="item.accepted" @click="removeCoop(item)">
                      <v-list-item-title>
                        {{
                          $t('HeuristicsCooperators.actions.remove_cooperator')
                        }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      v-if="item.invited && !item.accepted"
                      @click="cancelInvitation(item)"
                    >
                      <v-list-item-title>
                        {{
                          $t('HeuristicsCooperators.actions.cancel_invitation')
                        }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </div>
        </ShowInfo>
      </v-container>
    </v-row>
    <AccessNotAllowed v-if="!loading && verified" />
    <div class="text-center">
      <v-dialog v-model="messageModel" max-width="500">
        <v-card class="rounded-lg">
          <v-card-title
            style="background-color: #F9A826; color: white;"
            class="rounded-top-lg"
          >
            <v-icon color="white" class="mr-2">
              mdi-email
            </v-icon>
            {{ $t('HeuristicsCooperators.actions.send_message') }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="messageTitle"
              required
              :label="$t('HeuristicsCooperators.headers.title')"
              :hint="$t('HeuristicsCooperators.messages.message_title_hint')"
              outlined
              class="rounded-lg mt-4"
            />
            <v-textarea
              v-model="messageContent"
              required
              :label="$t('HeuristicsCooperators.headers.content')"
              :hint="$t('HeuristicsCooperators.messages.message_content_hint')"
              outlined
              class="rounded-lg"
            />
          </v-card-text>
          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red"
              outlined
              text
              class="rounded-lg"
              @click="messageModel = false"
            >
              {{ $t('HeuristicsCooperators.actions.cancel') }}
            </v-btn>
            <v-btn
              color="orange"
              dark
              class="rounded-lg"
              @click="sendMessage(selectedUser, messageTitle, messageContent)"
            >
              {{ $t('HeuristicsCooperators.actions.send') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import ShowInfo from '@/components/organisms/ShowInfo.vue'
import Snackbar from '@/components/atoms/Snackbar'
import Intro from '@/components/molecules/IntroCoops'
import AccessNotAllowed from '@/components/atoms/AccessNotAllowed'
import LeaveAlert from '../../components/atoms/LeaveAlert.vue'
// import { cooperatorsHeaders } from '@/utils/headers'
// import { roleOptionsItems } from '@/utils/items'
import Notification from '@/models/Notification'
const UIDGenerator = require('uid-generator')
export default {
  components: {
    ShowInfo,
    Snackbar,
    Intro,
    AccessNotAllowed,
    LeaveAlert,
  },
  props: { id: { type: String, default: '' } },
  data: () => ({
    object: null,
    // headers: headers,
    // roleOptions: roleOptionsItems,
    intro: null,
    email: '',
    selectedCoops: [],
    comboboxModel: [],
    comboboxKey: 0,
    selectedRole: 1,
    showCoops: false,
    verified: false,
    dataTableKey: 0,
    messageModel: false,
    selectedUser: [],
    messageTitle: '',
    messageContent: '',
  }),
  computed: {
    dialog() {
      return this.$store.state.dialog
    },
    test() {
      return this.$store.getters.test
    },
    user() {
      return this.$store.getters.user
    },
    users() {
      return this.$store.state.Users.users
    },
    cooperatorsEdit() {
      if (this.test.cooperators) return [...this.test.cooperators]
      return []
    },
    loading() {
      return this.$store.getters.loading
    },
    headers() {
      return [
        {
          text: this.$t('HeuristicsCooperators.headers.email'),
          value: 'email',
        },
        {
          text: this.$t('HeuristicsCooperators.headers.role'),
          value: 'accessLevel',
        },
        {
          text: this.$t('HeuristicsCooperators.headers.invited'),
          value: 'invited',
          justify: 'center',
        },
        {
          text: this.$t('HeuristicsCooperators.headers.accepted'),
          value: 'accepted',
          justify: 'center',
        },
        {
          text: this.$t('HeuristicsCooperators.headers.more'),
          value: 'more',
          sortable: false,
        },
      ]
    },
    roleOptions() {
      return [
        {
          text: this.$t('HeuristicsCooperators.roles.administrator'),
          value: 0,
        },
        { text: this.$t('HeuristicsCooperators.roles.evaluator'), value: 1 },
        { text: this.$t('HeuristicsCooperators.roles.guest'), value: 2 },
      ]
    },
  },
  watch: {
    loading() {
      if (!this.loading) {
        if (this.cooperatorsEdit.length == 0) this.intro = true
        else this.intro = false
      }
    },
  },
  created() {
    this.$store.dispatch('getAllUsers')
  },
  methods: {
    removeSelectedCoops(index) {
      this.selectedCoops.splice(index, 1)
    },
    async changeRole(item, event) {
      const index = this.cooperatorsEdit.indexOf(item)
      const newCoop = Object.assign({}, item)
      newCoop.accessLevel = event.value
      const currentAccessLevelText = this.roleOptions.find(
        (r) => r.value === item.accessLevel,
      ).text
      if (item.accessLevel !== event.value) {
        const ok = confirm(
          this.$t('HeuristicsCooperators.messages.change_role', {
            email: item.email,
            old: currentAccessLevelText,
            new: event.text,
          }),
        )
        if (ok) {
          // UPDATE TEST WITH NEW COLLABORATOR ROLE
          this.test.cooperators[index] = newCoop
          await this.$store.dispatch('updateTest', this.test)
          // UPDATE COOPERATOR ARRAY 'MYANSWERS' TO HAVE NEW ACCESSROLE
          await this.$store.dispatch('updateUserAnswer', {
            testDocId: this.test.id,
            cooperatorId: newCoop.userDocId,
            data: { accessLevel: newCoop.accessLevel },
          })
        } else {
          this.dataTableKey++ //forces data table re-render without changing user role
        }
      }
    },
    async submit() {
      this.test.cooperators = [...this.cooperatorsEdit]
      await this.$store.dispatch('updateTest', this.test)
      // Notify users
      this.cooperatorsEdit.forEach((guest) => {
        if (!guest.accepted) {
          this.notifyCooperator(guest)
        }
      })
      this.selectedCoops = []
      this.$refs.combobox.blur()
    },
    notifyCooperator(guest) {
      // Notify user on the platform in case it is already registered
      if (guest.userDocId) {
        let path = ''
        if (guest.accessLevel.value >= 2) {
          path = 'testview'
        } else {
          path = 'managerview'
        }
        this.$store.dispatch('addNotification', {
          userId: guest.userDocId,
          notification: new Notification({
            title: 'Cooperation Invite!',
            description: `You have been invited to test ${this.test.testTitle}!`,
            redirectsTo: `${path}/${this.test.id}/${guest.token}`,
            author: `${this.test.testAdmin.email}`,
            read: false,
            testId: this.test.id,
            accessLevel: this.roleOptions[this.selectedRole].value,
          }),
        })
      }
      this.sendInvitationMail(guest)
    },
    sendMessage(guest, messageTitle, messageContent) {
      this.messageModel = false
      if (guest.userDocId) {
        let path = ''
        if (guest.accessLevel.value >= 2) {
          path = 'testview'
        } else {
          path = 'managerview'
        }
        this.$store.dispatch('addNotification', {
          userId: guest.userDocId,
          notification: new Notification({
            title: `${messageTitle}`,
            description: `${messageContent}`,
            redirectsTo: '/',
            read: false,
            author: `${this.test.testAdmin.email}`,
            testId: this.test.id,
          }),
        })
      }
    },
    reinvite(guest) {
      this.notifyCooperator(guest)
    },
    saveInvitations() {
      const uidgen = new UIDGenerator()
      const tokens = {}

      this.selectedCoops.forEach((coop) => {
        const token = uidgen.generateSync()
        if (!coop.id) {
          this.cooperatorsEdit.push({
            userDocId: null,
            email: coop,
            invited: true,
            accepted: false,
            accessLevel: this.roleOptions[this.selectedRole].value,
            token: token,
            progress: 0,
            updateDate: this.test.updateDate,
            testAuthorEmail: this.test.testAdmin.email,
          })
        } else {
          this.cooperatorsEdit.push({
            userDocId: coop.id,
            email: coop.email,
            invited: true,
            accepted: false,
            accessLevel: this.roleOptions[this.selectedRole].value,
            token: token, // Atribua o token gerado para este colaborador
            progress: 0,
            updateDate: this.test.updateDate,
            testAuthorEmail: this.test.testAdmin.email,
          })
        }
        tokens[coop.id || coop] = token
      })
      this.submit()
    },
    validateEmail() {
      this.email = this.comboboxModel.pop()
      this.comboboxKey++
      if (typeof this.email !== 'object' && this.email !== undefined) {
        //if is object then no need to validate
        if (this.email.length) {
          if (!this.email.includes('@') || !this.email.includes('.')) {
            this.$toast.error(this.email + ' is not a valid email')
          }
          if (!this.users.find((user) => user.email === this.email)) {
            this.$toast.error(
              this.email + ' is not a valid email or does not exist',
            )
            return
          } else if (!this.selectedCoops.includes(this.email)) {
            this.selectedCoops.push(this.email)
          }
        }
      } else if (!this.selectedCoops.includes(this.email)) {
        const alreadyInvited = this.cooperatorsEdit.find(
          (cooperator) => cooperator.email === this.email.email,
        )
        if (alreadyInvited) {
          this.$toast.warning(this.email.email + ' has already been invited')
          return
        } else {
          this.selectedCoops.push(this.email)
        }
      }
    },
    async removeCoop(coop) {
      const ok = confirm(
        this.$t('HeuristicsCooperators.messages.remove_cooperator', {
          email: coop.email,
        }),
      )
      if (ok) {
        // Remove from test
        const index = this.cooperatorsEdit.indexOf(coop)
        this.cooperatorsEdit.splice(index, 1)
        this.test.cooperators = this.cooperatorsEdit
        this.test.numberColaborators = this.test.numberColaborators - 1
        await this.$store.dispatch('updateTest', this.test)
        // Remove from cooperator
        await this.$store.dispatch('removeTestFromCooperator', {
          test: this.test,
          cooperator: coop,
        })
      }
    },
    removeFromList(coop) {
      const index = this.cooperatorsEdit.indexOf(coop)
      this.cooperatorsEdit.splice(index, 1)
    },
    async sendInvitationMail(guest) {
      let domain = window.location.href
      domain = domain.replace(window.location.pathname, '')
      let email = {
        testId: this.test.id,
        from: this.user.email,
        testTitle: this.test.testTitle,
        guest: guest,
        domain: domain,
      }
      if (guest.accessLevel === 1) {
        email = Object.assign(email, {
          path: 'testview',
          token: guest.token,
        })
      } else {
        email = Object.assign(email, {
          path: 'managerview',
          token: guest.token,
        })
      }
      await this.$store.dispatch('sendEmailInvitation', email)
    },
    async cancelInvitation(guest) {
      const ok = confirm(
        this.$t('HeuristicsCooperators.messages.cancel_invitation', {
          email: guest.email,
        }),
      )
      if (ok) {
        const index = this.cooperatorsEdit.indexOf(guest)
        this.cooperatorsEdit.splice(index, 1)
        this.test.cooperators = this.cooperatorsEdit
        await this.$store.dispatch('updateTest', this.test)
      }
    },
  },
}
</script>

<style scoped>
.titleView {
  font-style: normal;
  font-weight: 300;
  font-size: 60px;
  line-height: 70px;
  display: flex;
  align-items: center;
  color: #000000;
}
.subtitleView {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  line-height: 21px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
