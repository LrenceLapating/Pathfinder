<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        labels: [],
        datasets: []
      })
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.createChart()
  },
  methods: {
    createChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        if (this.chart) {
          this.chart.destroy()
          this.createChart()
        }
      }
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style> 