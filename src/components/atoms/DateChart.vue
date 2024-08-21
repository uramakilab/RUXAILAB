<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveData],
  props: {
    taskAnswers: {
      type: Array,
      default:() => [],
    },
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Answers',
            data: [],
            borderColor: 'orange',
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      chartOptions: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'week',
                displayFormats: {
                  week: 'DD/MM',
                },
              },
              title: {
                display: true,
                text: 'Data',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  mounted() {
    this.processDataForChart()
    this.renderChart(this.chartData, this.chartOptions)
  },
  methods: {
    processDataForChart() {
      const currentDate = new Date()
      const MonthsAgo = new Date(currentDate)
      MonthsAgo.setMonth(currentDate.getMonth() - 2)

      const validAnswers = this.taskAnswers.filter((answer) => answer.lastUpdate)
      const filteredAnswers = validAnswers.filter((answer) => new Date(answer.lastUpdate) >= MonthsAgo)
      filteredAnswers.sort((a, b) => new Date(a.lastUpdate) - new Date(b.lastUpdate))

      const testsPerDay = {}
      const currentDateIterator = new Date(MonthsAgo)

      // Inicializar o objeto testsPerDay com zero para todos os dias no período
      while (currentDateIterator <= currentDate) {
        const dateKey = currentDateIterator.toISOString().split('T')[0]
        testsPerDay[dateKey] = 0
        currentDateIterator.setDate(currentDateIterator.getDate() + 1)
      }

      // Preencher testsPerDay com os dados reais
      filteredAnswers.forEach((answer) => {
        const dateKey = new Date(answer.lastUpdate).toISOString().split('T')[0]
        testsPerDay[dateKey]++
      })

      this.chartData.labels = Object.keys(testsPerDay)
      this.chartData.datasets[0].data = Object.values(testsPerDay)

      // Calcular o número máximo de testes e adicionar uma folga
      const maxTests = Math.max(...this.chartData.datasets[0].data)
      const suggestedMax = maxTests + 1

      // Atualizar configurações do eixo y
      this.chartOptions.scales.yAxes[0].ticks.suggestedMax = suggestedMax
    },
  },
}
</script>

<style scoped>
/* Adicione estilos específicos do componente aqui se necessário */
</style>
