<script>
import { Radar } from 'vue-chartjs'

export default {
  extends: Radar,
  props: {
    labels: {
      type: Array,
      required: true,
      default: function() {
        return []
      },
    },
    data: {
      type: Array,
      required: true,
      default: function() {
        return []
      },
    },
  },
  computed: {
    heuristics() {
      return this.testAll.testStructure || []
    },
  },
  watch: {
    data() {
      this.$data._chart.update()
    },
  },

  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: 'Importance ',
            backgroundColor: 'rgba(249, 152, 38,0.24)',
            borderColor: 'rgba(255, 81, 47,1)',
            pointBackgroundColor: 'rgba(255, 81, 47,1)',
            data: this.data,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        scale: {
          ticks: {
            suggestedMin: 0,
            suggestedMax: this.maxvalue,
            display: true,
          },
        },

        legend: {
          display: true,
          labels: {
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            fontSize: 20,
          },
        },
      },
    )
  },
}
</script>
