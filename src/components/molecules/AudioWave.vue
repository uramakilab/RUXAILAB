<template>
  <div class="waveform-container">
    <!-- audioFile: {{ file }} -->
    <!-- <h6> Regions: {{ this.regions }}</h6> -->

    <!-- Wave Reference -->
    <div ref="waveform" />


    <!-- Controls -->
    <v-row align="center" no-gutters class="controls-row">
      <!-- Play -->
      <v-col cols="auto">
        <v-btn icon @click="playPause">
          <v-icon>{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
      </v-col>

      <!-- Speed -->
      <v-col cols="auto">
        <v-btn @click="changeSpeed">
          {{ speedText }}
        </v-btn>
      </v-col>

      <!-- Volume -->
      <v-col cols="auto" class="volume-col">
        <v-icon> mdi-volume-high</v-icon>
        <v-slider
          v-model="volume"
          min="0"
          max="1"
          step="0.01"
          hide-details
          @change="setVolume"
          class="volume-slider"
        />
      </v-col>
      
    </v-row>

  </div>
</template>

<script>
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'



// Components

export default {
  components: {},
  props: {
    file: {
      type: String,
      required: false, // allowing for the file to be undefined
      default: null,
    },
    regions: {
      type: Array,
      default: () => [],
    },
    newRegion: {
      type: Object,
      default: () => ({ start: 0, end: 10 }),
    }
  },
  data() {
    return {
      wave_surfer: null,
      playing: false,      
      volume: 1, // Volume level (0 to 1)
      speedText: '1x', // Display text for speed
    }
  },

  watch: {
    file: 'loadAudioFile',
  },

  mounted() {
    // Regions
    this.regionsPlugin = RegionsPlugin.create()


    // Timeline
    this.timelinePlugin = TimelinePlugin.create({
      height: 12,  
      timeInterval: 1,
      primaryLabelInterval: 10,
      secondaryLabelInterval:10,
      style: {
        fontSize: '10px',
        // color: '#6A3274',
    }
    })
    

    // Initialize WaveSurfer
    this.initWaveSurfer()

    console.log('Wave Surfer Mounted')

  },
  methods: {
      // WaveSurfer Initializer
      initWaveSurfer() {
        this.wave_surfer = WaveSurfer.create({
          container: this.$refs.waveform,
          waveColor: 'orange',
          progressColor: '#666',
          cursorColor: '#666',
          barWidth: 2,
          barRadius: 3,

          minPxPerSec: 10,
          dragToSeek: true,

          // plugins: [this.regionsPlugin,this.timelinePlugin],
          plugins: [this.regionsPlugin,this.timelinePlugin],
          // cursorWidth: 1,
          // height: 500,
      })

      // Update play/pause state when WaveSurfer's playback state changes
      this.wave_surfer.on('play', () => (this.playing = true))
      this.wave_surfer.on('pause', () => (this.playing = false))


      // When the audio is both decoded and can play
      this.wave_surfer.on('ready', () => {
        // The ready event in WaveSurfer.js is triggered when the audio file has been completely loaded, decoded, and is ready for playback.
        // This means that:
        // - The audio file is fully loaded: The waveform is generated and displayed.
        // - The audio data is decoded: The audio data is processed into a format that can be played back.

        console.log('Ready')

        // Add Regions
        // 1. Initialize any existing regions
        this.regions.forEach(region => {
          this.regionsPlugin.addRegion({
            start: region.start,
            end: region.end,
            color: (region.sentiment == 'POS') 
            ? 'rgba(0, 255, 0, 0.2)' // Green color for positive sentiment
            : (region.sentiment == 'NEG')
            ? 'rgba(255, 0, 0, 0.2)' // Red color for negative sentiment
            : (region.sentiment == 'NEU')
            ? 'rgba(0, 0, 255, 0.2)' // Blue color for neutral sentiment
            : 'rgba(0, 0, 0, 0.2)', // Default color            
            drag: false,
            resize: false,
          });
        });

        // 2. Add a new region [intial region]
        const initialRegion = this.regionsPlugin.addRegion({
          start: this.newRegion.start,
          end: this.newRegion.end,
          // color: 'rgba(0, 123, 255, 0.3)',
          color: 'rgba(0, 0, 255, 0.1)',
          drag: true,
          resize: true,
        });

        // Listen to updates on the region and emit the changes
        initialRegion.on('update-end', () => {
          this.$emit('update:newRegion', {
            start: initialRegion.start,
            end: initialRegion.end,
          });
        });
      })

      // When the audio has been decoded
      this.wave_surfer.on('decode', () => {
        console.log('Decoded')
      })

      // Load Audio File
      this.loadAudioFile()

    },
    
    // Play/Pause
    playPause() {
      if (!this.wave_surfer) return

      if (this.wave_surfer.isPlaying()) {
        this.wave_surfer.pause()
      } else {
        this.wave_surfer.play()
      }
    },

    // Function to play a specific segment of the audio
    playSegment(start, end) {
      if (!this.wave_surfer) return;
      console.log("playing segment",start,end)

       
      // Seek to the start position
      this.wave_surfer.seekTo(start / this.wave_surfer.getDuration());
        
      // Start playing from the specified start time
      this.wave_surfer.play();

      // Stop the playback when it reaches the end time
      this.wave_surfer.on('audioprocess', () => {
        // console.log(this.wave_surfer.getCurrentTime());
        // console.log(end);
        if (this.wave_surfer.getCurrentTime() >= end) {
          this.wave_surfer.pause();
          // console.log('Stopping')
        }
        else{
          // console.log('Playing')
        }
      });
    },

    changeSpeed() {
      const speeds = [0.5,1, 1.5, 2]
      let currentSpeedIndex = speeds.indexOf(this.wave_surfer.getPlaybackRate())
      currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length
      const newSpeed = speeds[currentSpeedIndex]
      this.wave_surfer.setPlaybackRate(newSpeed)
      this.speedText = `${newSpeed}x` // Update the speed display text
    },

    setVolume() {
      if (this.wave_surfer) {
        this.wave_surfer.setVolume(this.volume)
      }
    },
  
    async loadAudioFile() {
      if (!this.wave_surfer){
        console.error('Wave Surfer not initialized')
        return
      }

      if (!this.file) {
        console.error('No audio file provided')
        return
      }

      // Clear regions
      if (this.regionsPlugin) {
        this.regionsPlugin.clearRegions()
      }

      // Get Audio File URL
      const storage = getStorage()
      const fileRef = ref(storage, this.file)
      getDownloadURL(fileRef)
        .then(async (url) => {
          if (url) {
            console.log('URL:', url)

            // Load the audio file
            this.wave_surfer.load(url)         
          }
        })
        .catch((error) => {
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              console.error('File does not exist')
              break
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.error('User does not have permission to access the object')
              break
            case 'storage/canceled':
              // User canceled the upload
              console.error('User canceled the upload')
              break
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              console.error('Unknown error occurred, inspect the server response')
              break
          }
          console.error(error)
        })
    },
  },
}
</script>

<style scoped>
.custom-btn {
  text-transform: none; /* Preserve the original text case */
}

.controls-row {
  margin-top: 16px;
}

.volume-col {
  flex: 1;
  max-width: 300px;
}

.volume-slider {
  width: 100%;
}

/* .waveform-container { */
/* height: 100px; */
/* Additional styles can be added here */
/* border: 1px solid #ccc; Example border */
/* background-color: #f9f9f9; Example background color */
/* } */
</style>
