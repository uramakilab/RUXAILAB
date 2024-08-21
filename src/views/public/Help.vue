<template>
  <div>
    <v-card
      align="center"
      img="https://theme.zdassets.com/theme_assets/717481/e805a01ba4ee2b0b1d0aa58dca3eb97f54c31e95.png"
      height="250"
      elevation="0"
      rounded="0"
    >
      <v-col
        cols="12"
        xs="4"
        sm="8"
        md="6"
        lg="6"
        xl="6"
        style="user-select: none;"
      >
        <div
          class="mt-12 display-3 bold font-weight-bold"
          style="color: white;"
        >
          Help Center
        </div>
        <div class="mt-3 display-2 bold font-weight-bold" style="color: white;">
          How can we help?
        </div>
      </v-col>
    </v-card>

    <v-container>
      <v-row>
        <v-col cols="12" xs="4" sm="8" md="6" lg="6" xl="6">
          <v-list outlined rounded>
            <v-list-item v-for="(item, index) in itemsLeft" :key="index">
              <v-list-item-content>
                <v-list-item-title class="title" @click="toggleCollapse(index)">
                  <v-icon v-if="!item.isCollapsed" small>
                    mdi-chevron-down
                  </v-icon>
                  <v-icon v-else small>
                    mdi-chevron-right
                  </v-icon>
                  {{ item.title }}
                </v-list-item-title>
                <v-expand-transition>
                  <v-row v-if="!item.isCollapsed">
                    <v-col
                      cols="6"
                      xs="4"
                      sm="6"
                      md="6"
                      lg="7"
                      xl="6"
                      align="justify"
                    >
                      <div class="subtitle-1 ml-5">
                        {{ item.content }}
                      </div>
                      <div class="ml-5">
                        <v-img
                          max-width="800"
                          :src="require(`@/assets/faqs/${item.gif}`)"
                          style="object-fit: contain"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" xs="4" sm="8" md="6" lg="6" xl="6">
          <v-list outlined rounded>
            <v-list-item v-for="(item, index) in itemsRight" :key="index">
              <v-list-item-content>
                <v-list-item-title
                  class="title"
                  @click="toggleCollapse(index + 5)"
                >
                  <v-icon v-if="!item.isCollapsed" small>
                    mdi-chevron-down
                  </v-icon>
                  <v-icon v-else small>
                    mdi-chevron-right
                  </v-icon>
                  {{ item.title }}
                </v-list-item-title>
                <v-expand-transition>
                  <v-row v-if="!item.isCollapsed">
                    <v-col
                      cols="6"
                      xs="4"
                      sm="6"
                      md="7"
                      lg="7"
                      xl="6"
                      align="justify"
                    >
                      <div class="subtitle-1 ml-5">
                        {{ item.content }}
                      </div>
                      <div class="ml-5">
                        <v-img
                          max-width="800"
                          :src="require(`@/assets/faqs/${item.gif}`)"
                          style="object-fit: contain"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'How do I create a test?',
          content:
            'To create a test, begin by clicking on the plus icon, selecting Heuristic Test. Then, specify the particulars of your project. Finally, proceed to the dedicated manager page.',
          gif: 'create_test.gif',
          isCollapsed: true, // Initially collapsed
        },
        {
          title: 'How I setup my Heuristic test?',
          content:
            'To set up your Heuristic test, start by accessing the "Edit Test" option. Then, click on the plus icon button to add a title and the question to your heuristic. Next, navigate to the options section to create the answer options and their respective values. Finally, save the modifications.',
          gif: 'hsetup.gif',
          isCollapsed: true,
        },
        {
          title: 'How I delete my test?',
          content:
            'To delete your test, navigate to the left sidebar and click on the "Settings" button. Then, select the "DELETE TEST" button.',
          gif: 'del_test.gif',
          isCollapsed: true,
        },
        {
          title: 'How to create a template?',
          content:
            'To create a template for your test, navigate to the left sidebar and click on the "Settings" button. Then, select the "CREATE TEMPLATE" option.',
          gif: 'create-temp.gif',
          isCollapsed: true,
        },
        {
          title: 'How to use a template?',
          content:
            "To utilize a template, navigate to the Tests page. Under the Create Templates section, you'll find your personal templates. Additionally, you can explore public templates.",
          gif: 'use-temp.gif',
          isCollapsed: true,
        },
        {
          title: 'How to preview your Test?',
          content:
            'On the leftside bar, click on the "Preview" option then start the test answering the questions & finally clicking the bottom right button to save and submit the preview which can be later analysed in the "Answers" section.',
          gif: 'preview_test.gif',
          isCollapsed: true,
        },
        {
          title: 'How to import my CSV?',
          content:
            'To import your CSV, navigate to the "Edit Test" section, then click the "UPDATE" button. Select your CSV file containing the heuristics.',
          gif: 'csv.gif',
          isCollapsed: true,
        },
        {
          title: 'How to invite cooperators?',
          content:
            'To invite collaborators, navigate to the manager page of your test. From there, select "Cooperators" on the left sidebar. Click on "Select cooperator" and enter the email of your collaborator. Choose the collaborator\'s role, then send the invitation by clicking on the bottom right button.',
          gif: 'sendinvite.gif',
          isCollapsed: true,
        },
        {
          title: 'How to analyse the results?',
          content:
            'To analyze your results, navigate to the manager page of your test. From there, select "Answers" on the left sidebar. Here, you can visualize statistics, evaluators, and heuristics.',
          gif: 'analytics.gif',
          isCollapsed: true,
        },
        {
          title: 'How to send a message to my cooperators?',
          content:
            'To send a message, navigate to the manager page of your test. Select "Cooperators" from the left sidebar. Click on the three dots icon next to the cooperator you want to message. Then, choose "Send a message" and write your message with a title and content.',
          gif: 'send_message.gif',
          isCollapsed: true,
        },
      ],
    }
  },

  computed: {
    itemsLeft() {
      const totalItems = this.items.length
      const halfItems = Math.ceil(totalItems / 2)
      return this.items.slice(0, halfItems)
    },
    itemsRight() {
      const totalItems = this.items.length
      const halfItems = Math.ceil(totalItems / 2)
      return this.items.slice(halfItems)
    },
  },

  methods: {
    toggleCollapse(index) {
      this.items.forEach((item, i) => {
        if (i !== index) {
          item.isCollapsed = true
        }
      })

      this.items[index].isCollapsed = !this.items[index].isCollapsed
    },
  },
}
</script>

<style></style>
