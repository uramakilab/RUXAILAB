<template>
  <div v-if="test">
    <!-- Test Start Screen -->
    <v-row
      v-if="test && start"
      class="background background-img pa-0 ma-0"
      align="center"
    >
      <v-col cols="6" class="ml-5">
        <h1 class="titleView pb-1">
          {{ test.testTitle }}
        </h1>
        <p align="justify" class="description">
          {{ test.testDescription }}
        </p>
        <v-row justify="center">
          <v-col cols="12"
            ><span
              style="font-size: 18px;"
              class="titleText mt-4 ml-0"
              v-if="!isTestAvailable"
              >The test is available at
              {{ new Date(this.testDate).toLocaleString() }}</span
            ></v-col
          >
          <v-btn
            :disabled="!isTestAvailable"
            color="white"
            outlined
            rounded
            @click="startTest()"
          >
            Start Test
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      v-else
      class="nav pa-0 ma-0"
      style="background-color: #e8eaf2;"
      dense
    >
      <v-navigation-drawer
        v-model="drawer"
        clipped
        :mini-variant="mini"
        permanent
        color="#3F3D56"
      >
        <div v-if="!mini" class="header">
          <v-list-item>
            <v-row dense align="center" justify="space-around">
              <v-col class="pa-0 ma-0" cols="8">
                <v-clamp class="titleText" autoresize :max-lines="2">
                  {{ test.testTitle }}
                </v-clamp>
              </v-col>
              <v-col>
                <v-progress-circular
                  rotate="-90"
                  :value="calculateProgress()"
                  color="#fca326"
                  :size="50"
                  class="mt-2"
                >
                  {{ Math.floor(calculateProgress()) }}%
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-list-item>
        </div>

        <v-list
          class="nav-list"
          flat
          dense
          max-height="85%"
          style="overflow-y: auto; overflow-x: hidden; padding-bottom: 100px"
        >
          <div v-for="(item, n) in items" :key="n">
            <!--Pre Test-->
            <v-list-item
              v-if="item.id == 0"
              :disabled="!isAdmin && bothConnected"
              :class="{
                'disabled-group': !isAdmin && bothConnected,
              }"
              :value="index == 0 ? true : false"
              no-action
              @click="index = item.id"
            >
              <v-list-item-icon>
                <v-icon :color="index == item.id ? '#ffffff' : '#fca326'">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  :style="index == item.id ? 'color: white' : 'color:#fca326'"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="item.id == 1"
              :value="index == 1 ? true : false"
              :class="{
                'disabled-group': !bothConnected,
              }"
              :disabled="!bothConnected"
              no-action
              @click="index = item.id"
            >
              <v-list-item-icon>
                <v-icon :color="index == item.id ? '#ffffff' : '#fca326'">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  :style="index == item.id ? 'color: white' : 'color:#fca326'"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-else-if="item.id == 2"
              :class="{
                'disabled-group': !bothConnected,
              }"
              :disabled="!bothConnected"
              @click="index = item.id"
            >
              <v-list-item-icon>
                <v-icon :color="index == item.id ? '#ffffff' : '#fca326'">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  :style="index == item.id ? 'color: white' : 'color:#fca326'"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>

        <div class="footer">
          <v-spacer />
          <v-btn icon class="mr-2" @click.stop="mini = !mini">
            <v-icon v-if="mini" color="white">
              mdi-chevron-right
            </v-icon>
            <v-icon v-else color="white">
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </div>
      </v-navigation-drawer>
      <!-- Moderator View -->
      <v-col
        v-if="index == 0 && isAdmin && !postTestFinished"
        ref="rightView"
        class="mx-15 mt-4 right-view backgroundTest"
      >
        <!-- Moderator View Content -->
        <v-card v-if="!conectionStatus" color="white" class="cards">
          <v-row justify="center" class="mt-4">
            <v-col cols="11" class="mt-3">
              <span class="cardsTitle">Confirm you are ready</span>
              <v-row justify="center" class="mt-1">
                <v-col cols="11" class="pt-0">
                  <span class="cardsSubtitle">
                    This area enables you to connect via voice and camera with
                    your evaluator so that, when ready, they can start the test.
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-4">
            <VideoCall
              ref="VideoCall"
              :index="index"
              :is-admin="isAdmin"
              @emit-confirm="confirmConnect(), (index = 1)"
            />
          </v-row>
        </v-card>
        <!-- Moderator expansion panels view -->
        <v-col v-else-if="moderatorStatus && !evaluatorStatus" class="my-12">
          <span class="cardsTitle text-center d-block"
            >Waiting the evaluator connection ...</span
          >
          <div class="dot-flashing mx-auto mt-4" />
        </v-col>
        <v-expansion-panels v-else-if="bothConnected" flat accordion>
          <v-expansion-panel
            style="border: solid 1px #71717182 !important; border-radius: 30px"
            class="mb-3"
          >
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between align-center">
                <span class="cardsTitle">Pre-Test</span>
                <v-icon
                  v-if="userTestStatus.preTestStatus == 'closed'"
                  color="green"
                  @click="changeStatus(0, 'preTest', 'open')"
                >
                  mdi-play
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.preTestStatus == 'open'"
                  color="green"
                >
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.preTestStatus == 'inProgress'"
                  color="orange"
                >
                  mdi-dots-horizontal
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.preTestStatus == 'done'"
                  color="green"
                >
                  mdi-check
                </v-icon>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="mb-6" />
              <v-row
                v-for="(item, index) in test.testStructure.preTest"
                :key="index"
              >
                <v-col cols="5" class="mx-auto py-0">
                  <p class="cardsTitle">
                    {{ item.title }}
                  </p>
                  <p v-if="item.description" class="cardsSubtitle">
                    {{ item.description }}
                  </p>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Moderator Tasks view -->
          <v-expansion-panel
            v-for="(task, index) in test.testStructure.userTasks"
            :key="index"
            style="border: solid 1px #71717182 !important; border-radius: 30px"
            class="mb-3"
          >
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between align-center">
                <span class="cardsTitle">{{ task.taskName }}</span>
                <v-icon
                  v-if="tasksStatus[index] == 'closed'"
                  color="green"
                  @click="openTask(index)"
                >
                  mdi-play
                </v-icon>
                <v-icon v-else-if="tasksStatus[index] == 'open'" color="green">
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="tasksStatus[index] == 'inProgress'"
                  color="orange"
                >
                  mdi-dots-horizontal
                </v-icon>
                <v-icon v-else-if="tasksStatus[index] == 'done'" color="green">
                  mdi-check
                </v-icon>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="mb-6" />
              <v-row class="fill-height" align="center" justify="center">
                <v-col cols="12" class="mb-0">
                  <span class="ml-4" style="color: #455a64">
                    {{ test.testStructure.userTasks[index].taskDescription }}
                  </span>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Moderator Post-Test view -->
          <v-expansion-panel
            style="border: solid 1px #71717182 !important; border-radius: 30px"
            class="mb-3"
          >
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between align-center">
                <span class="cardsTitle">Post-Test</span>
                <v-icon
                  v-if="userTestStatus.postTestStatus == 'closed'"
                  color="green"
                  @click="changeStatus(0, 'postTest', 'open')"
                >
                  mdi-play
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.postTestStatus == 'open'"
                  color="green"
                >
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.postTestStatus == 'inProgress'"
                  color="orange"
                >
                  mdi-dots-horizontal
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.postTestStatus == 'done'"
                  color="green"
                >
                  mdi-check
                </v-icon>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="mb-6" />
              <v-row
                v-for="(item, index) in test.testStructure.postTest"
                :key="index"
              >
                <v-col cols="5" class="mx-auto py-0">
                  <p class="cardsTitle">
                    {{ item.title }}
                  </p>
                  <p v-if="item.description" class="cardsSubtitle">
                    {{ item.description }}
                  </p>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- Finish button -->
      </v-col>
      <v-col
        v-if="index == 0 && postTestFinished && isAdmin"
        ref="rightView"
        class="mx-10 mt-6 right-view backgroundTest"
      >
        <v-card color="white" flat class="cards mb-6">
          <v-row justify="center" class="mt-4">
            <v-col cols="11" class="mt-3">
              <span class="cardsTitle">Evaluator concluded the test!</span>
              <br />
              <span class="cardsSubtitle">
                Here you can finilize the test, or you can keep talking with
                your evaluator until you finish!
              </span>
              <v-btn
                v-if="postTestFinished"
                class="my-6"
                color="orange"
                dark
                depressed
                block
                @click="stopRecording(), finishTest()"
              >
                Finish Test
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        v-if="index == 1 && taskIndex == 0 && isAdmin"
        ref="rightView"
        class="mx-10 mt-2 right-view backgroundTest"
      >
        <FeedbackView :index="index" :is-admin="isAdmin" />
      </v-col>
      <!-- Evaluator View -->
      <v-col
        v-if="index == 0 && taskIndex == 0 && !isAdmin"
        ref="rightView"
        class="mx-15 mt-4 right-view backgroundTest"
      >
        <!-- Evaluator View Content -->
        <v-card color="white" flat class="cards mb-6">
          <v-row justify="center" class="mt-4">
            <v-col cols="11" class="mt-3">
              <span class="cardsTitle">Welcome!</span>
              <v-row justify="center" class="mt-1">
                <v-col cols="11" class="pt-2 mb-5">
                  <span class="cardsSubtitle">
                    {{ test.testStructure.welcomeMessage }}
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <v-card color="white" flat class="cards mb-6">
          <v-row justify="center" class="mt-4">
            <v-col cols="11" class="mt-3">
              <span class="cardsTitle">We need your consentiment!</span>
              <v-row justify="center" class="mt-1">
                <v-col cols="11" class="pt-2 mb-5">
                  <span class="cardsSubtitle">
                    The information you give is used for orem ipsum lorem ipsum
                    dolor sit amet consectetur
                  </span>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="11">
                  <v-checkbox
                    v-model="currentUserTestAnswer.consentCompleted"
                    :disabled="consentCompleted"
                    color="orange"
                    class="ma-0 pa-0"
                    @click="
                      changeStatus(taskIndex, 'consent', 'done'),
                        (consentCompleted = true)
                    "
                  >
                    <template v-slot:label>
                      <span style="color: #455a64">{{
                        test.testStructure.consent
                      }}</span>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <v-card color="white" flat class="cards mb-6">
          <v-row justify="center" class="mt-4">
            <v-col cols="11" class="mt-3">
              <span class="cardsTitle">Connect with your moderator</span>
              <v-row justify="center" class="mt-1">
                <v-col cols="11" class="pt-0">
                  <span class="cardsSubtitle">
                    This area enables you to connect via voice and camera with
                    your moderator so that, when ready, they can start the test.
                  </span>
                </v-col>
                <v-col
                  v-if="moderatorStatus == false"
                  cols="4"
                  class="mt-2 mb-8 mr-8"
                >
                  <span class="cardsTitle text-center d-block"
                    >Waiting the moderator...</span
                  >
                  <div class="dot-flashing mx-auto mt-4" />
                </v-col>

                <v-col v-else cols="12" class="mr-8">
                  <VideoCall
                    ref="VideoCall"
                    :index="index"
                    :is-admin="isAdmin"
                    :consent-completed="consentCompleted"
                    @emit-confirm="confirmConnect(), (index = 2)"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Evaluator Pre-Test view -->
      <v-col
        v-if="index == 1 && !isAdmin && !postTestFinished"
        ref="rightView"
        class="mx-10 mt-6 right-view backgroundTest"
      >
        <v-expansion-panels flat accordion>
          <v-expansion-panel
            style="border: solid 1px #71717182 !important; border-radius: 30px"
            class="mb-3"
            :disabled="userTestStatus.preTestStatus == 'closed'"
            @click="setInProgress(index, 'preTest')"
          >
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between align-center">
                <span class="cardsTitle">Pre-Test</span>
                <v-icon
                  v-if="userTestStatus.preTestStatus == 'closed'"
                  color="#8D8D8D"
                >
                  mdi-lock
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.preTestStatus == 'open'"
                  color="green"
                >
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.preTestStatus == 'inProgress'"
                  color="orange"
                >
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.preTestStatus == 'done'"
                  color="green"
                >
                  mdi-check
                </v-icon>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="mb-6" />
              <v-row
                v-for="(item, index) in test.testStructure.preTest"
                :key="index"
              >
                <v-col cols="5" class="mx-auto py-0">
                  <p class="cardsTitle">
                    {{ item.title }}
                  </p>
                  <p v-if="item.description" class="cardsSubtitle">
                    {{ item.description }}
                  </p>
                  <v-textarea
                    v-if="item.textField"
                    v-model="currentUserTestAnswer.preTestAnswer[index].answer"
                    :placeholder="item.title"
                    rows="1"
                    outlined
                  />
                  <v-radio-group
                    v-if="item.selectionField"
                    v-model="currentUserTestAnswer.preTestAnswer[index].answer"
                    column
                  >
                    <v-row
                      v-for="(selection,
                      selectionIndex) in item.selectionFields"
                      :key="selectionIndex"
                    >
                      <v-radio
                        class="ml-3 mb-1"
                        :label="selection"
                        :value="selection"
                      />
                    </v-row>
                    <v-row justify="end" />
                  </v-radio-group>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="10" class="mx-4">
                  <v-btn
                    v-if="userTestStatus.preTestStatus != 'done'"
                    block
                    dark
                    style="border-radius: 10px"
                    color="orange lighten-1"
                    depressed
                    :disabled="test.userTestStatus.preTestStatus == 'closed'"
                    @click="changeStatus(taskIndex, 'preTest', 'done')"
                  >
                    {{ $t('UserTestView.buttons.done') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Evaluator Tasks view -->
          <v-expansion-panel
            v-for="(task, index) in test.testStructure.userTasks"
            :key="index"
            style="border: solid 1px #71717182 !important; border-radius: 30px"
            class="mb-3"
            :disabled="tasksStatus[index] == 'closed'"
            @click="setTaskIndex(index), setInProgress(index, 'tasks')"
          >
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between align-center">
                <span class="cardsTitle">{{ task.taskName }}</span>
                <v-icon v-if="tasksStatus[index] == 'closed'" color="#8D8D8D">
                  mdi-lock
                </v-icon>
                <v-icon v-else-if="tasksStatus[index] == 'open'" color="green">
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="tasksStatus[index] == 'inProgress'"
                  color="orange"
                >
                  mdi-lock-open
                </v-icon>
                <v-icon v-else-if="tasksStatus[index] == 'done'" color="green">
                  mdi-check
                </v-icon>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="mb-6" />
              <v-row class="fill-height" align="center" justify="center">
                <v-col cols="12" class="mb-0">
                  <span class="ml-4" style="color: #455a64">
                    {{ test.testStructure.userTasks[index].taskDescription }}
                  </span>
                </v-col>
                <v-col cols="9" class="mb-0 pb-0">
                  <v-textarea
                    :id="
                      'id-' + test.testStructure.userTasks[taskIndex].taskName
                    "
                    v-model="
                      currentUserTestAnswer.tasks[taskIndex].taskObservations
                    "
                    outlined
                    label="observation (optional)"
                  />
                </v-col>
                <v-col cols="2" class="mx-4">
                  <v-btn
                    v-if="tasksStatus[index] != 'done'"
                    block
                    dark
                    style="border-radius: 10px"
                    color="orange lighten-1"
                    depressed
                    @click="changeStatus(taskIndex, 'tasks', 'done')"
                  >
                    {{ $t('UserTestView.buttons.done') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Evaluator Post-Test view -->
          <v-expansion-panel
            style="border: solid 1px #71717182 !important; border-radius: 30px"
            class="mb-3"
            :disabled="userTestStatus.postTestStatus == 'closed'"
            @click="setInProgress(index, 'postTest')"
          >
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between align-center">
                <span class="cardsTitle">Post-Test</span>
                <v-icon
                  v-if="userTestStatus.postTestStatus == 'closed'"
                  color="#8D8D8D"
                >
                  mdi-lock
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.postTestStatus == 'open'"
                  color="green"
                >
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.postTestStatus == 'inProgress'"
                  color="orange"
                >
                  mdi-lock-open
                </v-icon>
                <v-icon
                  v-else-if="userTestStatus.postTestStatus == 'done'"
                  color="green"
                >
                  mdi-check
                </v-icon>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="mb-6" />
              <v-row
                v-for="(item, index) in test.testStructure.postTest"
                :key="index"
              >
                <v-col cols="5" class="mx-auto py-0">
                  <p>{{ item.title }}</p>
                  <p v-if="item.description">
                    {{ item.description }}
                  </p>
                  <v-textarea
                    v-if="item.textField"
                    v-model="currentUserTestAnswer.postTestAnswer[index].answer"
                    :placeholder="item.title"
                    outlined
                    rows="1"
                  />
                  <v-radio-group
                    v-if="item.selectionField"
                    v-model="currentUserTestAnswer.postTestAnswer[index].answer"
                    column
                  >
                    <v-row
                      v-for="(selection,
                      selectionIndex) in item.selectionFields"
                      :key="selectionIndex"
                    >
                      <v-radio
                        class="ml-3 mb-1"
                        :label="selection"
                        :value="selection"
                      />
                    </v-row>
                    <v-row justify="end" />
                  </v-radio-group>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="10" class="mx-4">
                  <v-btn
                    v-if="userTestStatus.postTestStatus != 'done'"
                    block
                    dark
                    style="border-radius: 10px"
                    color="orange lighten-1"
                    depressed
                    @click="changeStatus(0, 'postTest', 'done')"
                  >
                    {{ $t('UserTestView.buttons.done') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col
        v-if="index == 1 && postTestFinished && !isAdmin"
        ref="rightView"
        class="mx-10 mt-6 right-view backgroundTest"
      >
        <v-card color="white" flat class="cards mb-6">
          <v-row justify="center" class="mt-4">
            <v-col cols="11" class="mt-3">
              <span class="cardsTitle">Final Message!</span>
              <br />
              <span class="cardsSubtitle">
                Congratulations you finished this test, here you can until talk
                with your moderator or leave the test
              </span>
              <v-row justify="center" class="mt-3">
                <v-col cols="4">
                  <img
                    draggable="false"
                    src="../../../public/finalMessage.svg"
                    alt="Final test svg"
                  />
                </v-col>
                <v-col cols="6" class="pt-2 my-8">
                  <span class="cardsSubtitle">
                    {{ test.testStructure.finalMessage }}
                  </span>
                  <v-col class="mt-4" align="end">
                    <v-btn
                      color="orange"
                      depressed
                      dark
                      @click="saveAnswer(), stopRecording()"
                    >
                      Save & Exit
                    </v-btn>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Feedback View -->
      <v-col
        v-if="index == 2 && taskIndex == 0"
        ref="rightView"
        class="mx-10 mt-2 right-view backgroundTest"
      >
        <FeedbackView :index="index" :is-admin="isAdmin" />
      </v-col>
    </v-row>
    <!-- \\\\\\\\\\\\\\\\\\\\\\\ LOADING \\\\\\\\\\\\\\\\\\\\\\\ -->
    <v-overlay v-model="isLoading" class="text-center">
      <v-card class="pa-4" rounded="xl" color="grey darken-4">
        <v-progress-linear
          style="border-radius: 20px; width: 20wv;"
          :value="uploadProgress"
          color="#fca326"
          height="20"
          class="mb-2"
          ><template v-slot:default="{ value }">
            <span>{{ Math.ceil(value) }}%</span>
          </template></v-progress-linear
        >
        <div class="white-text mx-16">
          Saving Your Answer...
        </div>
      </v-card>
    </v-overlay>

    <v-dialog :value="!noExistUser && !logined" width="500" persistent>
      <v-card v-if="user">
        <v-row class="ma-0 pa-0 pt-5" justify="center">
          <v-avatar class="justify-center" color="orange lighten-4" size="150">
            <v-icon size="120" dark>
              mdi-account
            </v-icon>
          </v-avatar>
        </v-row>
        <v-card-actions class="justify-center mt-4">
          <v-btn color="#F9A826" class="white--text" @click="setTest()">
            Continue as {{ user.email }}
          </v-btn>
        </v-card-actions>
        <v-card-actions class="justify-center mt-4">
          <p>
            Not {{ user.email }}?
            <a style="color: #f9a826" @click="signOut()">Change account</a>
          </p>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <DisconnectedCard v-if="isDisconnected" />
    <video ref="remoteAudio" autoplay playsinline style="display:none;"></video>
  </div>
</template>

<script>
import VideoCall from '@/components/molecules/VideoCall.vue'
import DisconnectedCard from '@/components/atoms/DisconnectedCard.vue'
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { db } from '@/firebase'
import FeedbackView from '@/components/molecules/FeedbackView.vue'

export default {
  props: { token: { type: String, default: null } },
  components: {
    VideoCall,
    FeedbackView,
    DisconnectedCard,
  },
  data: () => ({
    conectionStatus: false,
    isAdmin: false,
    logined: null,
    selected: true,
    fromlink: null,
    drawer: true,
    start: true,
    mini: false,
    index: 0,
    noExistUser: true,
    taskIndex: 0,
    preTestIndex: null,
    items: [],
    taskAnswers: {},
    dialog: false,
    moderatorStatus: null,
    evaluatorStatus: null,
    tasksStatus: [],
    userTestStatus: {},
    postTestFinished: false,
    bothConnected: false,
    recording: false,
    recordedChunksEvaluator: [],
    recordedChunksModerator: [],
    recordedVideoEvaluator: '',
    recordedVideoModerator: '',
    videoStream: null,
    mediaRecorderEvaluator: null,
    mediaRecorderModerator: null,
    isLoading: false,
    consentCompleted: false,
    sessionCooperator: null,
    testDate: null,
    saved: false,
    uploadProgress: 0,
    backupInterval: null,
  }),
  computed: {
    test() {
      return this.$store.getters.test
    },
    user() {
      if (this.$store.getters.user) this.setExistUser()
      return this.$store.getters.user
    },
    currentUserTestAnswer() {
      return this.$store.getters.currentUserTestAnswer
    },
    cooperators() {
      return this.$store.getters.cooperators
    },
    tasks() {
      return this.$store.getters.tasks
    },
    roomTestId() {
      return this.$store.getters.test.id
    },
    localCameraStream() {
      return this.$store.getters.localCameraStream
    },
    remoteCameraStream() {
      return this.$store.getters.remoteCameraStream
    },
    isTestAvailable() {
      return new Date() > new Date(this.testDate)
    },
    isDisconnected() {
      return this.$store.getters.isDisconnected
    },
  },
  watch: {
    taskIndex() {
      this.$refs.rightView.scrollTop = 0
    },
    start() {
      if (this.start) {
        window.onbeforeunload = function() {
          return 'handle your events or msgs here'
        }
      }
      // save first to exit
    },
    async user() {
      if (this.user) {
        this.noExistUser = false
        if (this.logined) this.setTest()
      }
    },
    async localCameraStream(value) {
      if (value && !this.isAdmin) {
        this.startRecordingEvaluator()
      } else if (value && this.isAdmin) {
        this.startRecordingModerator()
      }
    },
    async remoteCameraStream(value) {
      this.setRemoteAudio()
    },
    'userTestStatus.preTestStatus': function(newValue) {
      if (newValue === 'done') {
        if (!this.isAdmin) {
          window.open(this.test.testStructure.landingPage)
        }
      }
    },

    'userTestStatus.postTestStatus': function(newValue) {
      if (newValue === 'done') {
        this.postTestFinished = true
      } else {
        this.postTestFinished = false
      }
    },
    evaluatorStatus(newValue) {
      if (newValue === true && this.moderatorStatus === true) {
        this.bothConnected = true
      }
    },
  },
  async created() {
    await this.verifyAdmin()
    if (this.token != null) {
      if (this.token == this.test.id) {
        this.$toast.info('Use a session link to access your moderated test!')
        this.$router.push('/managerview/' + this.test.id)
      }
      this.sessionCooperator = this.test.cooperators.find(
        (user) => user.userDocId === this.token,
      )
      if (this.user.id != this.token && !this.isAdmin) {
        this.$toast.error(`You don't have access to this session.`)
        this.$router.push('/testslist')
      }
      if (this.sessionCooperator.testDate) {
        this.testDate = this.sessionCooperator.testDate
      } else {
        this.$toast.warning(`Your session don't have a scheduled date`)
        this.$router.push('/managerview/' + this.test.id)
      }
    } else {
      this.$toast.info('Use a session your session link to the test')
      this.$router.push('/managerview/' + this.test.id)
    }

    if (!this.isAdmin) {
      await this.$store.dispatch('acceptTestCollaboration', {
        test: this.test,
        cooperator: this.user,
      })
    }

    await this.mappingSteps()
    this.consentCompleted = this.currentUserTestAnswer.consentCompleted
    const ref = doc(db, 'tests/', this.roomTestId)
    getDoc(ref).then((doc) => {
      if (doc.exists()) {
        const data = doc.data()
        data.userTestStatus.postTestStatus = 'closed'
        data.userTestStatus.preTestStatus = 'closed'
        data.userTestStatus.consentStatus = 'closed'
        for (let i = 0; i < this.test.testStructure.userTasks.length; i++) {
          data.testStructure.userTasks[i].taskStatus = 'closed'
        }
        return updateDoc(ref, data)
      }
    })
    onSnapshot(ref, (snapshot) => {
      this.moderatorStatus = snapshot.data().userTestStatus.moderator
      this.evaluatorStatus = snapshot.data().userTestStatus.user
      this.userTestStatus = snapshot.data().userTestStatus

      const tasks = snapshot.data().testStructure.userTasks

      const newTasksStatus = []

      tasks.forEach((task) => {
        newTasksStatus.push(task.taskStatus)
      })
      this.tasksStatus = newTasksStatus
    })
  },
  async beforeDestroy() {
    if (this.isAdmin) {
      this.disconnect()
      this.stopRecording()
      window.onbeforeunload = null
      await this.$store.dispatch('hangUp', this.roomTestId)
    } else {
      this.stopRecording()
    }
  },
  mounted() {
    if (this.user == null) {
      this.$toast.error(
        'Login to your RUXAILAB account first to access the test!',
      )
      this.$router.push('/signin')
    }
  },
  methods: {
    isSaved() {
      return this.saved
    },
    isTestNotStarted() {
      return this.start
    },
    async saveAnswer() {
      this.currentUserTestAnswer.submitted = true
      await this.$store.dispatch('saveTestAnswer', {
        data: this.currentUserTestAnswer,
        answerDocId: this.test.answersDocId,
        testType: this.test.testType,
      })
    },
    setTaskIndex(index) {
      this.taskIndex = index
    },
    openTask(id) {
      const testRef = doc(db, 'tests', this.roomTestId)

      getDoc(testRef).then((doc) => {
        if (doc.exists()) {
          const testStructure = doc.data().testStructure
          testStructure.userTasks[id].taskStatus = 'open'

          updateDoc(testRef, { testStructure })
            .then(() => {})
            .catch((error) => {
              console.error('Erro ao atualizar o status da tarefa:', error)
            })

          this.test.testStructure.userTasks[id].taskStatus = 'open'
        } else {
          console.error('Documento do teste não encontrado')
        }
      })
    },

    setInProgress(id, type) {
      const statusToUpdate = 'inProgress'
      const testRef = doc(db, 'tests', this.roomTestId)

      getDoc(testRef).then((doc) => {
        if (doc.exists()) {
          const data = doc.data()
          if (type === 'tasks') {
            if (this.tasksStatus[id] == 'open') {
              data.testStructure.userTasks[id].taskStatus = statusToUpdate
            }
          } else if (type === 'postTest') {
            if (this.userTestStatus.postTestStatus == 'open') {
              data.userTestStatus.postTestStatus = statusToUpdate
            }
          } else if (type === 'preTest') {
            if (this.userTestStatus.preTestStatus == 'open') {
              data.userTestStatus.preTestStatus = statusToUpdate
            }
          }
          updateDoc(testRef, data)
            .then(() => {})
            .catch((error) => {
              console.error(`Erro ao atualizar o status da ${type}:`, error)
            })
          if (type === 'tasks') {
            this.test.testStructure.userTasks[id].taskStatus = statusToUpdate
          } else {
            this.test.userTestStatus[`${type}Status`] = statusToUpdate
          }
        } else {
          console.error('Documento do teste não encontrado')
        }
      })
    },
    setExistUser() {
      this.noExistUser = false
    },

    changeStatus(id, type, newStatus) {
      const testRef = doc(db, 'tests', this.roomTestId)

      getDoc(testRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data()
            if (type === 'tasks') {
              data.testStructure.userTasks[id].taskStatus = newStatus
              if (newStatus == 'done')
                this.currentUserTestAnswer.tasks[id].completed = true
            } else if (type === 'postTest') {
              data.userTestStatus.postTestStatus = newStatus
              if (newStatus == 'done')
                this.currentUserTestAnswer.postTestCompleted = true
            } else if (type === 'preTest') {
              data.userTestStatus.preTestStatus = newStatus
              if (newStatus == 'done')
                this.currentUserTestAnswer.preTestCompleted = true
            } else if (type === 'consent') {
              data.userTestStatus.consentStatus = newStatus
              if (newStatus == 'done')
                this.currentUserTestAnswer.consentCompleted = true
            }
            return updateDoc(testRef, data)
          } else {
            console.error('Documento do teste não encontrado')
            throw new Error('Documento do teste não encontrado')
          }
        })
        .then(() => {
          this.calculateProgress()
        })
        .catch((error) => {
          console.error('Erro ao atualizar o status:', error)
        })
    },
    async setRemoteAudio() {
      this.$refs.remoteAudio.srcObject = this.remoteCameraStream
    },
    async uploadVideo(recordedChunks, storagePath) {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' })
      const storage = getStorage()
      const storageRef = ref(storage, storagePath)

      const uploadTask = uploadBytesResumable(storageRef, videoBlob)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploadProgress = progress
          },
          (error) => {
            console.error('Upload failed:', error)
            this.isLoading = false
          },
          async () => {
            const downloadURL = await getDownloadURL(storageRef)
            resolve(downloadURL)
          },
        )
      })
    },

    async startRecordingEvaluator() {
      this.recording = true
      this.recordedChunksEvaluator = []
      let evaluatorCamera = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      this.mediaRecorderEvaluator = new MediaRecorder(evaluatorCamera)

      this.mediaRecorderEvaluator.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunksEvaluator.push(event.data)
        }
      }

      this.mediaRecorderEvaluator.onstop = async () => {
        this.isLoading = true
        const storagePath = `tests/${this.roomTestId}/${this.token}/${this.currentUserTestAnswer.userDocId}/video/${this.recordedVideoEvaluator}`
        try {
          this.recordedVideoEvaluator = await this.uploadVideo(
            this.recordedChunksEvaluator,
            storagePath,
          )
          this.currentUserTestAnswer.cameraUrlEvaluator = this.recordedVideoEvaluator
          this.isLoading = false
          this.saved = true
          window.onbeforeunload = null
          this.$router.push('/testslist')
        } catch (error) {
          console.error('Upload failed:', error)
          this.isLoading = false
        }
      }

      this.mediaRecorderEvaluator.start()

      // Set up periodic backups
      this.backupInterval = setInterval(async () => {
        if (this.recording) {
          await this.uploadVideo(this.recordedChunksEvaluator, storagePath)
        }
      }, 300000) // 5 minutes
    },

    async startRecordingModerator() {
      this.recording = true
      this.recordedChunksModerator = []
      const storagePath = `tests/${this.roomTestId}/${this.token}/moderator/video/${this.recordedVideoModerator}`
      let moderatorCamera = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      this.mediaRecorderModerator = new MediaRecorder(moderatorCamera)

      this.mediaRecorderModerator.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunksModerator.push(event.data)
        }
      }

      this.mediaRecorderModerator.onstop = async () => {
        this.isLoading = true
        try {
          this.recordedVideoModerator = await this.uploadVideo(
            this.recordedChunksModerator,
            storagePath,
          )
          this.currentUserTestAnswer.cameraUrlModerator = this.recordedVideoModerator
          this.isLoading = false
          this.saved = true
          window.onbeforeunload = null
          this.$router.push('/testslist')
        } catch (error) {
          console.error('Upload failed:', error)
          this.isLoading = false
        }
      }

      this.mediaRecorderModerator.start()

      this.backupInterval = setInterval(async () => {
        if (this.recording) {
          await this.uploadVideo(this.recordedChunksModerator, storagePath)
        }
      }, 300000) // 5 minutes
    },

    async stopRecording() {
      if (this.mediaRecorderEvaluator) {
        this.mediaRecorderEvaluator.stop()
        this.localCameraStream.stop()
        clearInterval(this.backupInterval)
        this.recording = false
      }
      if (this.mediaRecorderModerator) {
        this.mediaRecorderModerator.stop()
        this.localCameraStream.stop()
        clearInterval(this.backupInterval)
        this.recording = false
      }
    },
    async confirmConnect() {
      const ref = doc(db, 'tests', this.roomTestId)
      if (this.isAdmin) {
        try {
          await updateDoc(ref, {
            userTestStatus: {
              moderator: true,
              user: false,
              consentStatus: 'open',
              preTestStatus: 'closed',
              postTestStatus: 'closed',
            },
          })
          this.conectionStatus = true
        } catch (e) {
          console.error('Error in connect:', e)
        }
      } else {
        try {
          await updateDoc(ref, {
            userTestStatus: {
              user: true,
              moderator: true,
              consentStatus: 'open',
              preTestStatus: 'closed',
              postTestStatus: 'closed',
            },
          })
          this.conectionStatus = true
        } catch (e) {
          console.error('Error in connect:', e)
        }
      }
    },
    async disconnect() {
      const ref = doc(db, 'tests', this.roomTestId)
      try {
        await updateDoc(ref, {
          userTestStatus: {
            moderator: false,
            user: false,
            consentStatus: 'open',
            preTestStatus: 'closed',
            postTestStatus: 'closed',
          },
        })
      } catch (e) {
        console.error('Error in connect:', e)
      }
    },
    async submitAnswer() {
      this.currentUserTestAnswer.submitted = true
      await this.saveAnswer()
    },
    startTest() {
      if (this.test.testStructure.length == 0) {
        this.$toast.info("This test don't have any task")
        this.$router.push('/managerview/' + this.test.id)
      }
      this.start = !this.start
    },
    calculateProgress() {
      const totalSteps = 3

      let completedSteps = 0

      if (this.currentUserTestAnswer.preTestCompleted) {
        completedSteps++
      }

      if (this.currentUserTestAnswer.consentCompleted) {
        completedSteps++
      }

      if (this.currentUserTestAnswer.postTestCompleted) {
        completedSteps++
      }

      const progressPercentage = (completedSteps / totalSteps) * 100
      this.currentUserTestAnswer.progress = progressPercentage
      return progressPercentage
    },
    async setTest() {
      this.logined = true
      await this.$store.dispatch('getCurrentTestAnswerDoc')
    },
    async verifyAdmin() {
      if (this.test.testAdmin.email == this.user.email) {
        this.isAdmin = true
      }
    },
    async mappingSteps() {
      if (this.isAdmin) {
        if (this.validate(this.test.testStructure.preTest)) {
          this.items.push({
            title: 'Moderator view',
            icon: 'mdi-security',
            value: this.test.testStructure.postTest,
            id: 0,
          })
        }

        if (this.validate(this.test.testStructure.preTest)) {
          if (this.items.length) {
            this.items.push({
              title: 'Feedback',
              icon: 'mdi-monitor-account',
              value: this.test.testStructure.postTest,
              id: 2,
            })
          }
        }
      } else {
        //PreTest
        if (this.validate(this.test.testStructure.preTest)) {
          this.items.push({
            title: 'Welcome Page',
            icon: 'mdi-human-greeting',
            id: 0,
          })
        }

        //Tasks
        if (this.validate(this.test.testStructure.userTasks))
          this.items.push({
            title: 'Tasks',
            icon: 'mdi-checkbox-marked-circle-auto-outline',
            id: 1,
          })

        //PostTest
        if (this.validate(this.test.testStructure.postTest))
          this.items.push({
            title: 'Feedback',
            icon: 'mdi-monitor-account',
            id: 2,
          })
      }
    },
    async finishTest() {
      await this.$store.dispatch('hangUp', this.roomTestId)
      this.saved = true
      window.onbeforeunload = null
    },
    validate(object) {
      return object !== null && object !== undefined && object !== ''
    },
  },
}
</script>

<style scoped>
.nav {
  background-color: #e8eaf2;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

/* Estilo para a lista de navegação */
.nav-list {
  max-height: 85%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 100px;
}

/* Estilo para os cartões de conteúdo */
.cards {
  margin-top: 16px;
}

/* Estilo para os campos de entrada de texto */
.text-field {
  margin-bottom: 16px;
}

/* Estilo para os botões */
.btn-done {
  border-radius: 10px;
}

/* Right side scroll bar */
/* width */
.right-view::-webkit-scrollbar {
  width: 9px;
}
/* Track */
.right-view::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
.right-view::-webkit-scrollbar-thumb {
  background: #ffcd86;
  border-radius: 2px;
}
/* Handle on hover */
.right-view::-webkit-scrollbar-thumb:hover {
  background: #fca326;
}
.cards {
  border-radius: 20px;
}
.cardsTitle {
  color: #455a64;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.cardsSubtitle {
  color: #455a64;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.v-text-field--outlined >>> fieldset {
  border-radius: 25px;
  border: 1px solid #ffceb2;
}
.disabled-group {
  pointer-events: none;
  background-color: grey;
}

body {
  overflow-y: 100vh; /* Adiciona uma barra de rolagem vertical quando necessário */
}
.background {
  background: linear-gradient(134.16deg, #ffab25 -13.6%, #dd8800 117.67%);
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.backgroundTest {
  background-color: #e8eaf2;
  height: 94%;
  overflow: scroll;
}
.background:before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(../../assets/BackgroundTestView.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right 0px top -20px;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.titleView {
  font-style: normal;
  font-weight: 300;
  font-size: 60px;
  line-height: 70px;
  display: flex;
  align-items: center;
  color: #ffffff;
}
.description {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  line-height: 21px;
  align-items: flex-end;
  color: #ffffff;
}
.nav {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.subtitleView {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}
.btn-fix:focus::before {
  opacity: 0 !important;
}
.titleText {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-left: 15px;
  padding: 10px;
  padding-left: 0px;
  padding-top: 0px;
  /*
  height: 2.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; */
}
/* Right side scroll bar */
/* width */
.right-view::-webkit-scrollbar {
  width: 9px;
}
/* Track */
.right-view::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
.right-view::-webkit-scrollbar-thumb {
  background: #ffcd8694;
  border-radius: 2px;
}
/* Handle on hover */
.right-view::-webkit-scrollbar-thumb:hover {
  background: #fda1207a;
}
/* Nav bar list scroll bar */
/* width */
.nav-list::-webkit-scrollbar {
  width: 7px;
}
/* Track */
.nav-list::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
.nav-list::-webkit-scrollbar-thumb {
  background: #c09c6b;
  border-radius: 4px;
}
/* Handle on hover */
.nav-list::-webkit-scrollbar-thumb:hover {
  background: #eba555;
  /* background: #515069; */
}
.card-title {
  font-style: normal;
  font-weight: 300;
  font-size: 48px;
  line-height: 56px;
  margin-left: 12px;
  margin-bottom: 20px;
}
.dot-flashing {
  position: relative;
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: #fca326;
  color: #fca326;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before,
.dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -25px;
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: #fca326;
  color: #fca326;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 25px;
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: #fca326;
  color: #fca326;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: #fca326;
  }
  50%,
  100% {
    background-color: rgba(252, 163, 38, 0.281);
  }
}
</style>
