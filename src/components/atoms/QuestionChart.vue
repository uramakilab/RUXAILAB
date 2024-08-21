<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      },
    },
  },
  watch: {
    data() {
      this.renderChart(
        {
          labels: [
            'Yes',
            'Neither',
            'No',
            'Not applicable-It is not a problem',
            'Not answered',
          ],
          datasets: [
            {
              label: 'Quantity answers',
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
        labels: [
          'Yes',
          'Neither',
          'No',
          'Not applicable-It is not a problem',
          'Not answered',
        ],
        datasets: [
          {
            label: 'Quantity answers',
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
