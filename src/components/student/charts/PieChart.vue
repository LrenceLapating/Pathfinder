<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'PieChart',
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
        type: 'pie',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                usePointStyle: true
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