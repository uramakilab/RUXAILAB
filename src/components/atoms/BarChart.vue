<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    labels: {
      type: String,
      default: 'Data One',
    },
    data: {
      type: Array,
      default: () => [],
    },
    legend: {
      type: String,
      default: 'Legend',
    },
  },
  watch: {
    data() {
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              label: this.legend,
              backgroundColor: '#f87979',
              data: this.data,
            },
          ],
        },
        { responsive: true, maintainAspectRatio: false },
      )
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: this.legend,
            backgroundColor: '#f87979',
            data: this.data,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false },
    )
  },
}
</script>
