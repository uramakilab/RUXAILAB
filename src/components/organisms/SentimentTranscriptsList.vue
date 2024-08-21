<template>
    <v-container>
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <h3>Transcripts</h3>
          <v-divider />
        </v-col>
      </v-row>

      {{ selected }}

      <!-- <v-btn @click="playSegment(10, 15)">
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>   -->

      <!-- Scrollable List -->
      <v-row>
        <v-col cols="12">
        <v-list two-line>
          <v-list-item-group
            v-model="selected"
            active-class="orange--text"
            class="scrollable-list"
          >
            <template v-for="(region, index) in regions">
              <v-list-item :key="region.title"> 
                <!-- <template v-slot:default="{ active }"> -->
                <template>
                  <!-- Left Item: Avatar or Icon -->
                  <v-list-item-icon class="play-segment-container">
                    <!-- Play Button -->
                    <v-btn icon @click="playSegment(region.start, region.end)">
                      <v-icon color="orange" large >mdi-play</v-icon>
                    </v-btn>

                    <!-- Start and End Times -->
                    <v-list-item-subtitle class="segment-time">
                      {{ region.start.toFixed(2) }} - {{ region.end.toFixed(2) }}
                    </v-list-item-subtitle>
                  </v-list-item-icon>

                  <!-- List Item Content -->
                  <v-list-item-content>
                    <!-- <v-list-item-title v-text="'item.title'"></v-list-item-title> -->

                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="region.transcript"
                    ></v-list-item-subtitle>

                    <!-- <v-list-item-subtitle v-text="region.transcript"></v-list-item-subtitle> -->
                  </v-list-item-content>

                  <v-list-item-action>
                    <!-- The <v-list-item-action> is a Vuetify component that is typically used inside a <v-list-item> to align content to the right side of the list item. -->
                    <div class="icon-and-confidence">
                      <!-- Face Icon based on sentiment -->
                      <v-icon v-if="region.sentiment === 'POS'" color="green">
                        mdi-emoticon-happy-outline
                      </v-icon>
                      <v-icon v-else-if="region.sentiment === 'NEU'" color="blue">
                        mdi-emoticon-neutral-outline
                      </v-icon>
                      <v-icon v-else-if="region.sentiment === 'NEG'" color="red">
                        mdi-emoticon-sad-outline
                      </v-icon>

                      <!-- Confidence Value Below the Icon -->
                      <v-list-item-action-text v-text="(region.confidence*100).toFixed(2) + '%'"></v-list-item-action-text>
                    </div>

                    </v-list-item-action>             
                     <v-list-item-action>

                    <!-- Delete Icon Button -->
                    <v-btn icon @click="deleteRegion(region)">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                   
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < regions.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>

        </v-col>
      </v-row>  
    </v-container>
</template>


<script>
// import SentimentTranscript from '@/components/molecules/SentimentTranscript.vue';

export default {
  components: {
    // SentimentTranscript,
  },
  props: {
    regions: {
      type: Array,
      default: () => [],
    },
    playSegment: {
      type: Function,
      default: () => {},
    },
    deleteRegion: {
      type: Function,
      default: () => {},
    },
  },

  data: () => ({
      selected: null,
    }),

  methods: {
    
  },
}
</script>



<style scoped>
h3 {
  font-style: normal;
  font-weight: 300;
  color: #000000;
}

.scrollable-list {
  /* background-color: red; */
  height: 250px;
  overflow-y: auto;
  /* Custom scrollbar styles */
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* For Firefox */
}

.scrollable-list::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
}

.scrollable-list::-webkit-scrollbar-track {
  background: transparent; /* Track background */
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3); /* Scrollbar color */
  border-radius: 10px; /* Rounded corners */
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5); /* Darker color on hover */
}


.play-segment-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.segment-time {
  font-size: 10px;
  color: grey;
  margin-top: 4px;
}

.icon-and-confidence{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>