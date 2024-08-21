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
            label: 'Usability Percentage ',
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
            suggestedMax: 100,
          },
        },
      },
    )
  },
}
</script>
