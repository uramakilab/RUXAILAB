<template>
  <div v-if="usersID">
    <!-- testDocument: {{ testDocument }} -->
    <!-- answersDocument: {{answersDocument}} -->
    <!-- selectedAnswerDocument "{{selectedAnswerDocument}} -->

    <ShowInfo title="Sentiment Analysis">
      <div slot="content">
        <v-card flat class="task-container">
          <v-row class="ma-0 pa-0">
            <!-- Evaluators List -->
            <v-col class="ma-0 pa-0 task-list" cols="3">
              <v-list dense class="list-scroll">
                <v-subheader>Evaluators</v-subheader>
                <v-divider />
                <v-list-item-group v-model="userSelect" color="#fca326">
                  <v-list-item v-for="(item, i) in usersID" :key="i">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ getCooperatorEmail(item) }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-divider vertical inset />

            <!-- Answer Sentiment -->
            <v-col class="ma-0 pa-1 answer-list" cols="9">
              <!-- Co-operators -->              
              <ModeratedTestCard
                :moderator="{ name: testDocument ? testDocument.testAdmin.email : '<Error>' }"
                :evaluator="{ name: selectedAnswerDocument ? getCooperatorEmail(selectedAnswerDocument.userDocId) : '<Error>' }"
              />              
    

              <!-- Audio Wave -->
              <AudioWave 
                ref="audioWave"
                :file="selectedAnswerDocument.cameraUrlEvaluator" 
                :regions="selectedAnswerSentimentDocument ? selectedAnswerSentimentDocument.regions || [] : []" 
                :newRegion.sync="newRegion"
              />


              <!-- Control Wave -->

              <v-row class="align-center justify-space-between pa-3">
                <!-- Left Text -->
                <v-col cols="12" md="8">
                  <span class="text--secondary caption">
                    Drag the sliders to adjust the start and end points or enter the exact times in the input fields.
                  </span>
                </v-col>

                <!-- Right Controls -->
                <v-col cols="12" md="4" class="text-right">
                  <v-btn color="orange" class="white--text" @click="analyzeTimeStamp()">
                    + Analyze
                  </v-btn>
                </v-col>
              </v-row>
              <!-- <v-btn
                color="#F9A826"
                class="white--text custom-btn"
                @click="analyzeTimeStamp()"
              >
                + Analyze
              </v-btn>


              {{ newRegion.start }} - {{ newRegion.end }}
 -->

              <!-- Transcripts -->
              <SentimentTranscriptsList
              :playSegment="playSegmentInAudioWave"
              :regions="selectedAnswerSentimentDocument ? selectedAnswerSentimentDocument.regions || [] : []" 
              :deleteRegion="deleteRegion"
              />
              <!-- <div>Transcript</div> -->


            </v-col>
          </v-row>
        </v-card>
      </div>
    </ShowInfo>



    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
      <h3>Analyzing ... </h3>
    </v-overlay>

    <v-snackbar
    v-model="snackbar.visible"
    :color="snackbar.color"
    :timeout="4000"
    >
      {{ snackbar.text }}
      <template v-slot:action>
        <v-btn color="white" text @click="snackbar.visible = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>

// External Libraries
import axios from 'axios'

// Components
import ShowInfo from '@/components/organisms/ShowInfo.vue'
import ModeratedTestCard from '@/components/molecules/ModeratedTestCard.vue';
import AudioWave from '@/components/molecules/AudioWave.vue'
import SentimentTranscriptsList from './SentimentTranscriptsList.vue';


// Controller
import AudioSentimentController from '@/controllers/AudioSentimentController';
import { evaluatorStatisticsHeaders } from '@/utils/headers';

const audioSentimentController = new AudioSentimentController()

export default {
  components: {
    ShowInfo,
    ModeratedTestCard,
    AudioWave,
    SentimentTranscriptsList
  },
  data: () => ({
    userSelect: 0, // Index of the selected answer [Based on the usersID array]
    usersID: [], // Array of users IDs
    regions:[],


    selectedAnswerSentimentDocument: null,


    // New Region Data
    newRegion: {
      start: 0,
      end: 5,
    },

    // State Management
    overlay: false,
    snackbar: {
      visible: false,
      text: '',
      color: '' // Use a valid color name or hex code
    },
    isFetchingSentimentDocument: false,
      
  }),
  watch: {
    selectedAnswerDocument: 'fetchSelectedAnswerSentimentDocument',
  },

  mounted() {

  },

  computed: {
    testDocument() {
      return this.$store.getters.test
    },

    answersDocument() {
      if (!this.$store.getters.testAnswerDocument) {
        return {}
      }
      return this.$store.getters.testAnswerDocument.taskAnswers
    },

    selectedAnswerDocument() {
      if (this.usersID.length > 0 && this.userSelect !== null) {
        return this.answersDocument[this.usersID[this.userSelect]]
      }
      return null
    },
  },

  created() {
    // Reset usersID array in case created is called multiple times
    this.usersID = []
    // Check if answersDocument is not empty
    if (this.answersDocument) {
      // Iterate over the keys of the answersDocument object
      Object.keys(this.answersDocument).forEach((key, index) => {
        // populate the usersID array
        this.usersID.push(this.answersDocument[key].userDocId)
      })
    }
  },

  methods: {
    getCooperatorEmail(userDocId) {
      let cooperatorEmail = null
      if (
        this.testDocument.cooperators &&
        Array.isArray(this.testDocument.cooperators)
      ) {
        for (const element of this.testDocument.cooperators) {
          if (element && element.email && element.userDocId === userDocId) {
            cooperatorEmail = element.email
          }
        }
      }
      return cooperatorEmail
    },

    // Fetch the sentiment document for the selected answer [Firebase]
    async fetchSelectedAnswerSentimentDocument() {
        // Prevent multiple fetches
        if (this.isFetchingSentimentDocument) return;
        this.isFetchingSentimentDocument = true;

        console.log('Fetching Sentiment Document..............................')
        if (this.selectedAnswerDocument) {
            const answerDocId = this.testDocument.answersDocId;
            const userDocId = this.usersID[this.userSelect];
            
            try {
                // Try to get the sentiment document
                let result = await audioSentimentController.getByAnswerDocIdandUserDocId(answerDocId, userDocId);
                
                if (!result) {
                    // Document does not exist, create it
                    console.warn(`Sentiment document for answerDocId ${answerDocId} and userDocId ${userDocId} does not exist. Creating new document.`);
                    const payload = {
                        answerDocId: answerDocId,
                        userDocId: userDocId,
                    };
                    result = await audioSentimentController.create(payload);
                    console.warn(`Created new sentiment document with ID ${result.id}.`);
                }

                // Set the result to the selectedAnswerSentimentDocument
                this.selectedAnswerSentimentDocument = result;

            } catch (error) {
                this.selectedAnswerSentimentDocument = null;
                console.error('Error fetching sentiment document:', error);
            } finally {
              // Reset fetching flag
              this.isFetchingSentimentDocument = false;
            }
        } else {
            this.selectedAnswerSentimentDocument = null;
            this.isFetchingSentimentDocument = false;
        }
    },


    // Analyze the timestamp of the selected answer [AI Service]
    async analyzeTimeStamp() {
      console.log('Analyzing Timestamp..............................')
  
      // Show the overlay
      this.overlay = true

      axios.post('http://localhost:8000/sentiment-analysis-timestamped/whisper', 
      {
        url: this.selectedAnswerDocument.cameraUrlEvaluator,
        start_time: this.newRegion.start,
        end_time: this.newRegion.end,
        whisper_model_size:"base",
        
      }).then(async(response) => {
        // Hide the overlay
        this.overlay = false

        // Show the snackbar
        this.snackbar['visible']=true
        this.snackbar['color']='success'
        this.snackbar['text']='Analysis Completed'


        const utterances_sentiment = response.data.utterances_sentiment
        // console.log(utterances_sentiment)

        // Add this Region to the sentiment document for the selected answer [Firebase]
        const answerSentimentDocId = this.selectedAnswerSentimentDocument.id
        // console.log(answerSentimentDocId)

       
        for (const utterance of utterances_sentiment) {
          const res = await audioSentimentController.addSentimentRegion(answerSentimentDocId,
            {
              "start": utterance.timestamp[0],
              "end": utterance.timestamp[1],
              "transcript": utterance.text,
              "sentiment": utterance.sentiment,
              "confidence": utterance.confidence
            }
          )
        }


        // Fetch the updated sentiment document
        // await this.fetchSelectedAnswerSentimentDocument()

      }).catch((error) => {
        // Hide the overlay
        this.overlay = false

        // Show the snackbar
        this.snackbar['visible']=true
        this.snackbar['color']='error'
        this.snackbar['text']='Analysis Failed'
      

        // Log the error
        console.error(error)
      })
    },

    playSegmentInAudioWave(start, end) {
      this.$refs.audioWave.playSegment(start, end)
    },


    async deleteRegion(region) {
      // Confirm the deletion
      if (!confirm('Are you sure you want to delete this region?')) return;

      // Show the overlay
      this.overlay = !this.overlay

      try{

        const result = await audioSentimentController.deleteSentimentRegion(this.selectedAnswerSentimentDocument.id, region.idx);

        // Hide the overlay
        this.overlay = false

        // Show the snackbar
        this.snackbar['visible']=true
        this.snackbar['color']='success'
        this.snackbar['text']='Region Deletec Successfully'


        
        // Fetch the updated sentiment document
        // await this.fetchSelectedAnswerSentimentDocument()
      }
      catch(error){
        console.error('Error deleting region:', error);

        // Hide the overlay
        this.overlay = false

        // Show the snackbar
        this.snackbar['visible']=true
        this.snackbar['color']='error'
        this.snackbar['text']='Error Deleting Region'
      }   
    }
  },
}
</script>

<style>
.cardsTitle {
  color: #455a64;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.list-scroll {
  height: 508px;
  overflow: auto;
}

/* Nav bar list scroll bar */
/* width */
.list-scroll::-webkit-scrollbar {
  width: 7px;
}

/* Track */
.list-scroll::-webkit-scrollbar-track {
  background: none;
}

/* Handle */
.list-scroll::-webkit-scrollbar-thumb {
  background: #ffcd86;
  border-radius: 4px;
}

/* Handle on hover */
.list-scroll::-webkit-scrollbar-thumb:hover {
  background: #fca326;
  /* background: #515069; */
}
</style>
