<template>
  <div class="performance-analytics">
    <div class="page-header">
      <h1>Performance Analytics</h1>
    </div>
    
    <div class="filters-card">
      <div class="filter-group">
        <label for="subject-filter">Subject</label>
        <select id="subject-filter" v-model="filters.subject">
          <option value="">All Subjects</option>
          <option v-for="subject in subjects" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="classroom-filter">Classroom</label>
        <select id="classroom-filter" v-model="filters.classroom">
          <option value="">All Classrooms</option>
          <option v-for="classroom in filteredClassrooms" :key="classroom.id" :value="classroom.id">
            {{ classroom.subject }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="date-range">Date Range</label>
        <select id="date-range" v-model="filters.dateRange">
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
      
      <button class="apply-filters" @click="applyFilters">
        <i class="fas fa-filter"></i> Apply Filters
      </button>
    </div>
    
    <div class="charts-grid">
      <div class="chart-card">
        <div class="card-header">
          <h2>Class Performance Over Time</h2>
          <div class="card-actions">
            <button class="btn-icon" title="Download Chart" @click="downloadChart('performance')">
              <i class="fas fa-download"></i>
            </button>
            <button class="btn-icon" title="Refresh Data" @click="refreshChart('performance')">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="performanceChart"></canvas>
        </div>
      </div>
      
      <div class="chart-card">
        <div class="card-header">
          <h2>Topic-wise Performance Distribution</h2>
          <div class="card-actions">
            <button class="btn-icon" title="Download Chart" @click="downloadChart('topic')">
              <i class="fas fa-download"></i>
            </button>
            <button class="btn-icon" title="Refresh Data" @click="refreshChart('topic')">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="topicChart"></canvas>
        </div>
      </div>
      
      <div class="chart-card">
        <div class="card-header">
          <h2>Mastery Distribution</h2>
          <div class="card-actions">
            <button class="btn-icon" title="Download Chart" @click="downloadChart('mastery')">
              <i class="fas fa-download"></i>
            </button>
            <button class="btn-icon" title="Refresh Data" @click="refreshChart('mastery')">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        <div class="chart-container pie-container">
          <canvas ref="masteryChart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="insights-card">
      <div class="card-header">
        <h2>Key Insights</h2>
      </div>
      <div class="insights-content">
        <div v-for="(insight, index) in insights" :key="index" class="insight-item">
          <div class="insight-icon" :class="insight.type">
            <i :class="insight.icon"></i>
          </div>
          <div class="insight-content">
            <h3>{{ insight.title }}</h3>
            <p>{{ insight.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'PerformanceAnalytics',
  
  data() {
    return {
      filters: {
        subject: '',
        classroom: '',
        dateRange: 'month'
      },
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      classrooms: [
        {
          id: 1,
          subject: 'Mathematics 101',
          subjectCategory: 'Mathematics'
        },
        {
          id: 2,
          subject: 'Physics Advanced',
          subjectCategory: 'Physics'
        },
        {
          id: 3,
          subject: 'Chemistry Basics',
          subjectCategory: 'Chemistry'
        }
      ],
      charts: {
        performance: null,
        topic: null,
        mastery: null
      },
      insights: [
        {
          type: 'positive',
          icon: 'fas fa-arrow-up',
          title: 'Overall Improvement',
          description: 'Average class performance has improved by 12% over the past month.'
        },
        {
          type: 'negative',
          icon: 'fas fa-exclamation-triangle',
          title: 'Struggling Area',
          description: 'Students are showing difficulty with Calculus concepts. Consider assigning additional study guides.'
        },
        {
          type: 'neutral',
          icon: 'fas fa-info-circle',
          title: 'Consistent Performance',
          description: 'Geometry performance has remained stable, with most students maintaining mastery above 75%.'
        }
      ]
    };
  },
  
  computed: {
    filteredClassrooms() {
      if (!this.filters.subject) {
        return this.classrooms;
      }
      
      return this.classrooms.filter(
        classroom => classroom.subjectCategory === this.filters.subject
      );
    }
  },
  
  mounted() {
    this.initCharts();
  },
  
  methods: {
    initCharts() {
      // Line chart for performance over time
      const performanceCtx = this.$refs.performanceChart.getContext('2d');
      this.charts.performance = new Chart(performanceCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Average Score',
            data: [65, 68, 72, 75, 82, 85],
            borderColor: '#3b7ddd',
            backgroundColor: 'rgba(59, 125, 221, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
      
      // Bar chart for topic-wise performance
      const topicCtx = this.$refs.topicChart.getContext('2d');
      this.charts.topic = new Chart(topicCtx, {
        type: 'bar',
        data: {
          labels: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'],
          datasets: [{
            label: 'Average Mastery',
            data: [78, 82, 65, 90, 72],
            backgroundColor: [
              'rgba(59, 125, 221, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
      
      // Pie chart for mastery distribution
      const masteryCtx = this.$refs.masteryChart.getContext('2d');
      this.charts.mastery = new Chart(masteryCtx, {
        type: 'pie',
        data: {
          labels: ['Strong', 'Average', 'Weak'],
          datasets: [{
            data: [65, 25, 10],
            backgroundColor: [
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)'
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    },
    
    applyFilters() {
      // In a real app, this would fetch new data based on filters
      // For this demo, we'll just simulate updating the charts
      
      // Update line chart with new random data
      const performanceData = Array.from({length: 6}, () => Math.floor(Math.random() * 40) + 60);
      this.charts.performance.data.datasets[0].data = performanceData;
      this.charts.performance.update();
      
      // Update bar chart with new random data
      const topicData = Array.from({length: 5}, () => Math.floor(Math.random() * 40) + 60);
      this.charts.topic.data.datasets[0].data = topicData;
      this.charts.topic.update();
      
      // Update pie chart with new data
      const strong = Math.floor(Math.random() * 30) + 50;
      const average = Math.floor(Math.random() * 20) + 20;
      const weak = 100 - strong - average;
      this.charts.mastery.data.datasets[0].data = [strong, average, weak];
      this.charts.mastery.update();
      
      // Generate new insights based on the data
      this.generateInsights(performanceData, topicData, [strong, average, weak]);
    },
    
    refreshChart(chartName) {
      if (this.charts[chartName]) {
        // Generate new random data
        const data = Array.from(
          {length: this.charts[chartName].data.labels.length}, 
          () => Math.floor(Math.random() * 40) + 60
        );
        
        this.charts[chartName].data.datasets[0].data = data;
        this.charts[chartName].update();
      }
    },
    
    downloadChart(chartName) {
      if (this.charts[chartName]) {
        const canvas = this.charts[chartName].canvas;
        const image = canvas.toDataURL('image/png');
        
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = image;
        link.download = `${chartName}-chart.png`;
        link.click();
      }
    },
    
    generateInsights(performanceData, topicData, masteryData) {
      // Calculate insights based on the data
      const currentAvg = performanceData[performanceData.length - 1];
      const prevAvg = performanceData[performanceData.length - 2];
      const percentChange = ((currentAvg - prevAvg) / prevAvg * 100).toFixed(1);
      
      // Find weakest topic
      const minTopicValue = Math.min(...topicData);
      const weakestTopicIndex = topicData.indexOf(minTopicValue);
      const weakestTopic = this.charts.topic.data.labels[weakestTopicIndex];
      
      // Find strongest topic
      const maxTopicValue = Math.max(...topicData);
      const strongestTopicIndex = topicData.indexOf(maxTopicValue);
      const strongestTopic = this.charts.topic.data.labels[strongestTopicIndex];
      
      // Update insights
      this.insights = [
        {
          type: percentChange >= 0 ? 'positive' : 'negative',
          icon: percentChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
          title: percentChange >= 0 ? 'Overall Improvement' : 'Performance Decline',
          description: `Average class performance has ${percentChange >= 0 ? 'improved' : 'decreased'} by ${Math.abs(percentChange)}% recently.`
        },
        {
          type: 'negative',
          icon: 'fas fa-exclamation-triangle',
          title: 'Struggling Area',
          description: `Students are showing difficulty with ${weakestTopic} concepts (${minTopicValue}%). Consider assigning additional study guides.`
        },
        {
          type: 'positive',
          icon: 'fas fa-star',
          title: 'Strong Performance',
          description: `${strongestTopic} shows the highest mastery at ${maxTopicValue}%. Students are doing well in this area.`
        }
      ];
    }
  }
};
</script>

<style scoped>
.performance-analytics {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  position: relative;
}

.page-header h1:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #C84C1C;
  border-radius: 2px;
}

.filters-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.filter-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background-color: white;
  transition: border-color 0.3s;
}

.filter-group select:focus {
  border-color: #3b7ddd;
}

.apply-filters {
  padding: 10px 20px;
  background-color: #3b7ddd;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.apply-filters:hover {
  background-color: #3366cc;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #f3f4f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-icon:hover {
  background-color: #e5e7eb;
}

.chart-container {
  height: 300px;
  padding: 20px;
  position: relative;
}

.pie-container {
  display: flex;
  justify-content: center;
}

.insights-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 30px;
}

.insights-content {
  padding: 20px;
}

.insight-item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.insight-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.insight-icon.positive {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.insight-icon.negative {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.insight-icon.neutral {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.insight-content h3 {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 600;
}

.insight-content p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-card {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .apply-filters {
    width: 100%;
    justify-content: center;
  }
}
</style> 