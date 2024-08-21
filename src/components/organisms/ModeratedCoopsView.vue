<template>
  <div>
    <v-overlay v-if="loading" v-model="loading" class="text-center">
      <v-progress-circular indeterminate color="#fca326" size="50" />
      <div class="white-text mt-3">
        Loading Cooperators
      </div>
    </v-overlay>
    <Intro
      v-if="cooperatorsEdit.length == 0 && intro && !loading && showCoops"
      @closeIntro="intro = false"
    />

    <v-row justify="center">
      <v-container class="pa-0">
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
              :disabled="!comboboxModel.email"
              @click="openInvitationModal()"
              v-on="on"
            >
              <v-icon large>
                mdi-email
              </v-icon>
            </v-btn>
          </template>
          <span>Send invitations</span>
        </v-tooltip>

        <ShowInfo title="Cooperators">
          <div slot="content" class="ma-0 pa-0" style="background: #f5f7ff">
            <v-row class="ma-0 pa-0 pt-3" align="center">
              <v-col class="mt-1 mx-4 pa-0">
                <v-combobox
                  :menu-props="{
                    rounded: 'xl',
                  }"
                  :key="comboboxKey"
                  ref="combobox"
                  v-model="comboboxModel"
                  :hide-no-data="false"
                  :autofocus="comboboxKey == 0 ? false : true"
                  style="background: #f5f7ff;"
                  :items="users"
                  item-text="email"
                  label="Select cooperator"
                  outlined
                  rounded
                  dense
                  color="#fca326"
                  class="mx-2"
                  @input="verifyEmail()"
                >
                  <template v-slot:no-data>
                    There are no users registered with that email, press enter
                    to select anyways.
                  </template>
                </v-combobox>
              </v-col>
            </v-row>
            <v-card class="mx-6" outlined>
              <v-data-table
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
                  <v-row class="ml-3" align="center">
                    <div>{{ item.email }}</div>
                  </v-row>
                </template>

                <!-- Test Date -->
                <template v-slot:item.testDate="{ item }">
                  <div>{{ formatDate(item.testDate) }}</div>
                </template>

                <!-- Starts at -->
                <template v-slot:item.testHour="{ item }">
                  <div>{{ formatTime(item.testDate) }}</div>
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

                <!-- Session -->
                <template v-slot:item.session="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        class="ml-1"
                        v-if="item"
                        icon
                        @click="goToSession(item.userDocId)"
                        ><v-icon>mdi-file-document-arrow-right</v-icon></v-btn
                      >
                    </template>
                    <span>Go to session</span>
                  </v-tooltip>
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
                        <v-list-item-title>Send a message</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item.accepted == false"
                        link
                        @click="reinvite(item)"
                      >
                        <v-list-item-title>Re-invite</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                        v-if="item.accepted"
                        @click="removeCoop(item)"
                      >
                        <v-list-item-title>Remove cooperator</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                        v-if="item.invited && !item.accepted"
                        @click="cancelInvitation(item)"
                      >
                        <v-list-item-title>Cancel invitation</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-card>
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
            Send a Message
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="messageTitle"
              required
              label="Title"
              hint="Type a title for your message"
              outlined
              class="rounded-lg mt-4"
            />
            <v-textarea
              v-model="messageContent"
              required
              label="Content"
              hint="Type the content of your message"
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
              Cancel
            </v-btn>
            <v-btn
              color="orange"
              dark
              class="rounded-lg"
              @click="sendMessage(selectedUser, messageTitle, messageContent)"
            >
              Send
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog class="rounded-lg" v-model="inviteModal" max-width="950">
        <v-card class="rounded-xxl">
          <v-card-title style="color: #626E76;" class="rounded-top-lg">
            Invite Evaluator To Test
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="5" class="ml-4 mt-2">
                <span class="modalInternTitles">Email</span>
                <v-col cols="7" class="pa-0">
                  <v-text-field
                    :value="comboboxModel.email"
                    dense
                    disabled
                    outlined
                    background-color="#D7D7D7"
                    class="rounded-lg"
                  />
                </v-col>
                <span class="modalInternTitles">Scheduled at</span>
                <v-row justify="center" style="margin-top: -9px;">
                  <v-col cols="5" class="pr-0">
                    <v-menu
                      ref="menu"
                      :nudge-top="26"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          readonly
                          color="orange"
                          background-color="grey lighten-3"
                          v-bind="attrs"
                          v-on="on"
                          outlined
                          dense
                          class="rounded-lg"
                        />
                      </template>
                      <v-date-picker
                        :min="
                          new Date(
                            Date.now() - new Date().getTimezoneOffset() * 60000,
                          )
                            .toISOString()
                            .substring(0, 10)
                        "
                        v-model="date"
                        show-adjacent-months
                        color="orange"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4" class="mr-auto"
                    ><v-menu
                      ref="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          prepend-icon="mdi-clock-time-four-outline"
                          dense
                          background-color="grey lighten-3"
                          color="orange"
                          outlined
                          v-model="hour"
                          class="rounded-lg"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-time-picker
                        :min="minTime"
                        format="24hr"
                        color="orange"
                        v-model="hour"
                        scrollable
                      ></v-time-picker></v-menu
                  ></v-col>
                </v-row>
                <span class="modalInternTitles">Invite message</span>
                <v-row>
                  <v-col cols="9">
                    <v-textarea
                      v-model="inviteMessage"
                      color="orange"
                      background-color="grey lighten-3"
                      required
                      placeholder="Hey lets make a test..."
                      outlined
                      class="rounded-lg mt-1"
                  /></v-col>
                </v-row>
              </v-col>
              <v-col>
                <img
                  class="ml-5"
                  src="../../../public/Schedule.svg"
                  alt="Schedule"
                  height="330"
                />
                <v-row
                  ><v-col cols="9" style="text-align: center"
                    ><span class="modalInternTitles"
                      >Invite with test link will be send at to evaluator email
                      at scheduled time</span
                    >
                  </v-col>
                  <v-col cols="2"
                    ><v-btn
                      color="orange"
                      style="border-radius: 10px; text-transform: unset !important;font-weight: 600"
                      dark
                      large
                      @click="saveInvitation()"
                      >Send
                    </v-btn></v-col
                  ></v-row
                >
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
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
import { roleOptionsItems } from '@/utils/items'
import Notification from '@/models/Notification'
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
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    showTimePicker: false,
    hour: null,
    object: null,
    headers: [
      { text: 'Email', value: 'email' },
      { text: 'Test Date', value: 'testDate' },
      { text: 'Starts at', value: 'testHour' },
      { text: 'Invited', value: 'invited', justify: 'center' },
      { text: 'Accepted', value: 'accepted', justify: 'center' },
      { text: 'Session', value: 'session', justify: 'center' },
      { text: 'More', value: 'more', sortable: false },
    ],
    roleOptions: roleOptionsItems,
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
    inviteMessage: '',
    messageContent: '',
    inviteModal: false,
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
    minTime() {
      const currentDate = new Date()
      currentDate.setDate(currentDate.getDate() - 1)
      const selectedDate = new Date(this.date)

      if (
        selectedDate.toLocaleDateString() ===
          currentDate.toLocaleDateString() &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()
      ) {
        return currentDate.getHours() + ':' + currentDate.getMinutes()
      } else {
        return '00:00'
      }
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
    async saveInvitation() {
      const cooperator = this.comboboxModel
      const dateTimeString = this.date + 'T' + this.hour + ':00'
      const dateTime = new Date(dateTimeString)
      const timestamp = dateTime.toISOString()
      this.cooperatorsEdit.push({
        userDocId: cooperator.id || null,
        email: cooperator.email,
        invited: true,
        accepted: false,
        accessLevel: 1,
        testDate: timestamp,
        inviteMessage: this.inviteMessage,
        updateDate: this.test.updateDate,
        testAuthorEmail: this.test.testAdmin.email,
      })

      this.submit()
    },

    verifyEmail() {
      const alreadyInvited = this.cooperatorsEdit.find(
        (cooperator) => cooperator.email === this.comboboxModel.email,
      )
      if (alreadyInvited) {
        this.$toast.warning(
          this.comboboxModel.email + ' has already been invited',
        )
        this.comboboxModel = ''
        return
      }
    },

    async submit() {
      this.test.cooperators = [...this.cooperatorsEdit]
      await this.$store.dispatch('updateTest', this.test)
      this.cooperatorsEdit.forEach((guest) => {
        if (!guest.accepted) {
          this.notifyCooperator(guest)
        }
      })
      this.inviteModal = false
      this.hour = null
      this.date = null
      this.inviteMessage = ''
      this.comboboxModel = []
      this.$refs.combobox.blur()
    },
    goToSession(coopId) {
      this.$router.push(`/testview/${this.test.id}/${coopId}`)
    },
    notifyCooperator(guest) {
      // Notify user on the platform in case it is already registered
      if (guest.userDocId) {
        let path = 'testview'
        this.$store.dispatch('addNotification', {
          userId: guest.userDocId,
          notification: new Notification({
            accessLevel: 1,
            title: `You have been invited to test ${this.test.testTitle}!`,
            description: this.inviteMessage,
            redirectsTo: `${path}/${this.test.id}/${guest.userDocId}`,
            author: `${this.test.testAdmin.email}`,
            read: false,
            testId: this.test.id,
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
    formatDate(timestamp) {
      const date = new Date(timestamp)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    },
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const hours = date.getHours()
      const minutes = date.getMinutes()

      return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
    },
    reinvite(guest) {
      this.notifyCooperator(guest)
    },
    openInvitationModal() {
      this.inviteModal = true
    },
    async removeCoop(coop) {
      const ok = confirm(
        `Are you sure you want to remove ${coop.email} from your cooperators?`,
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
      console.log(guest)
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
          token: guest.userDocId,
        })
      } else {
        email = Object.assign(email, {
          path: 'managerview',
          token: guest.userDocId,
        })
      }
      await this.$store.dispatch('sendModeratedEmailInvitation', email)
    },
    async cancelInvitation(guest) {
      const ok = confirm(
        `Are you sure you want to cancel ${guest.email} from your cooperators?`,
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
.modalInternTitles {
  max-width: 270px;
  color: #626e76;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.v-application .v-autocomplete__content.menuable__content__active {
  border-radius: 20px !important;
}
.v-dialog {
  border-radius: 20px !important;
}
</style>
