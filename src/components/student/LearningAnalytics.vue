<template>
  <div class="learning-analytics">
    <div class="analytics-header">
      <h2>Learning Analytics</h2>
      <div class="time-range-selector">
        <button 
          v-for="range in timeRanges" 
          :key="range"
          :class="['range-btn', { active: selectedRange === range }]"
          @click="selectRange(range)"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <!-- Performance Summary -->
    <div class="summary-section">
      <div class="summary-card improvement">
        <div class="card-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="card-content">
          <h3>Overall Improvement</h3>
          <div class="improvement-stats">
            <div class="stat">
              <span class="value">{{ overallImprovement }}%</span>
              <span class="label">Average Improvement</span>
            </div>
            <div class="stat">
              <span class="value">{{ totalStudyHours }}</span>
              <span class="label">Study Hours</span>
            </div>
          </div>
          <div class="trend-indicator" :class="improvementTrend">
            <i :class="trendIcon"></i>
            {{ trendMessage }}
          </div>
        </div>
      </div>
    </div>

    <!-- Subject Performance -->
    <div class="performance-grid">
      <div v-for="subject in subjectPerformance" 
           :key="subject.id" 
           class="subject-card">
        <div class="subject-header">
          <h3>{{ subject.name }}</h3>
          <span :class="['trend-badge', subject.trend]">
            {{ formatTrend(subject.trend) }}
          </span>
        </div>
        <div class="performance-chart">
          <line-chart :data="subject.chartData" />
        </div>
        <div class="subject-stats">
          <div class="stat-item">
            <span class="label">Average Score</span>
            <span class="value">{{ subject.averageScore }}%</span>
          </div>
          <div class="stat-item">
            <span class="label">Time Spent</span>
            <span class="value">{{ subject.timeSpent }}h</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Habits -->
    <div class="habits-section">
      <h3>Learning Habits Analysis</h3>
      
      <!-- Study Time Distribution -->
      <div class="habit-card">
        <h4>Peak Study Hours</h4>
        <div class="time-distribution">
          <div class="time-block" 
               v-for="(block, index) in studyTimeDistribution" 
               :key="index"
               :style="{ height: block.percentage + '%' }"
               :class="{ 'peak-time': block.isPeak }"
               :title="block.timeRange + ': ' + block.percentage + '%'">
          </div>
        </div>
        <p class="habit-insight">
          <i class="fas fa-lightbulb"></i>
          {{ studyTimeInsight }}
        </p>
      </div>

      <!-- Study Streak -->
      <div class="habit-card">
        <h4>Study Streak</h4>
        <div class="streak-calendar">
          <div v-for="(day, index) in studyStreak" 
               :key="index"
               :class="['day-block', { active: day.studied }]"
               :title="day.date + (day.studied ? ': Studied' : ': No activity')">
          </div>
        </div>
        <p class="streak-count">
          Current Streak: {{ currentStreakCount }} days
        </p>
      </div>

      <!-- Subject Focus -->
      <div class="habit-card">
        <h4>Subject Focus Distribution</h4>
        <div class="focus-chart">
          <pie-chart :data="subjectFocusData" />
        </div>
        <p class="habit-insight">
          <i class="fas fa-lightbulb"></i>
          {{ focusDistributionInsight }}
        </p>
      </div>
    </div>

    <!-- Weekly Report -->
    <div class="weekly-report" v-if="showWeeklyReport">
      <h3>Weekly Performance Summary</h3>
      <div class="report-content">
        <div class="report-metrics">
          <div class="metric" v-for="metric in weeklyMetrics" :key="metric.label">
            <span class="metric-value">{{ metric.value }}</span>
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-change" :class="metric.changeType">
              {{ metric.change }}
            </span>
          </div>
        </div>
        <div class="report-highlights">
          <h4>Key Insights</h4>
          <ul>
            <li v-for="(insight, index) in weeklyInsights" 
                :key="index"
                :class="insight.type">
              <i :class="insight.icon"></i>
              {{ insight.text }}
            </li>
          </ul>
        </div>
      </div>
      <div class="report-actions">
        <button @click="downloadReport" class="download-btn">
          <i class="fas fa-download"></i>
          Download Report
        </button>
        <button @click="shareReport" class="share-btn">
          <i class="fas fa-share"></i>
          Share Progress
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './charts/LineChart.vue'
import PieChart from './charts/PieChart.vue'

export default {
  name: 'LearningAnalytics',
  components: {
    LineChart,
    PieChart
  },
  data() {
    return {
      timeRanges: ['Week', 'Month', 'Quarter', 'Year'],
      selectedRange: 'Week',
      overallImprovement: 15,
      totalStudyHours: 24,
      improvementTrend: 'positive',
      subjectPerformance: [
        {
          id: 1,
          name: 'Mathematics',
          trend: 'increasing',
          averageScore: 85,
          timeSpent: 8,
          chartData: {/* Chart data structure */}
        },
        // ... other subjects
      ],
      studyTimeDistribution: [
        { timeRange: '6-9 AM', percentage: 30, isPeak: true },
        { timeRange: '9-12 PM', percentage: 45, isPeak: true },
        { timeRange: '12-3 PM', percentage: 25, isPeak: false },
        { timeRange: '3-6 PM', percentage: 35, isPeak: false },
        { timeRange: '6-9 PM', percentage: 40, isPeak: false },
        { timeRange: '9-12 AM', percentage: 20, isPeak: false }
      ],
      studyStreak: Array(30).fill().map((_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        studied: Math.random() > 0.3
      })),
      subjectFocusData: {/* Pie chart data structure */},
      weeklyMetrics: [
        {
          label: 'Tasks Completed',
          value: 15,
          change: '+3',
          changeType: 'positive'
        },
        {
          label: 'Average Score',
          value: '85%',
          change: '+5%',
          changeType: 'positive'
        },
        {
          label: 'Study Hours',
          value: '24h',
          change: '+2h',
          changeType: 'positive'
        }
      ],
      weeklyInsights: [
        {
          type: 'achievement',
          icon: 'fas fa-trophy',
          text: 'Highest math score this quarter'
        },
        {
          type: 'improvement',
          icon: 'fas fa-arrow-up',
          text: '25% improvement in response time'
        },
        {
          type: 'suggestion',
          icon: 'fas fa-lightbulb',
          text: 'Consider increasing practice in Physics'
        }
      ]
    }
  },
  computed: {
    trendIcon() {
      return this.improvementTrend === 'positive' 
        ? 'fas fa-arrow-up' 
        : 'fas fa-arrow-down'
    },
    trendMessage() {
      return this.improvementTrend === 'positive'
        ? 'Improving steadily'
        : 'Needs attention'
    },
    currentStreakCount() {
      let count = 0
      for (const day of this.studyStreak) {
        if (!day.studied) break
        count++
      }
      return count
    },
    studyTimeInsight() {
      const peakTimes = this.studyTimeDistribution
        .filter(block => block.isPeak)
        .map(block => block.timeRange)
        .join(' and ')
      return `You're most productive during ${peakTimes}`
    },
    focusDistributionInsight() {
      // Generate insight based on subject focus distribution
      return 'Mathematics receives most of your attention. Consider balancing with other subjects.'
    },
    showWeeklyReport() {
      return this.selectedRange === 'Week'
    }
  },
  methods: {
    selectRange(range) {
      this.selectedRange = range
      this.loadAnalytics()
    },
    formatTrend(trend) {
      const trends = {
        increasing: '↑ Improving',
        decreasing: '↓ Declining',
        stable: '→ Stable'
      }
      return trends[trend] || trend
    },
    async loadAnalytics() {
      try {
        // Fetch analytics data based on selected range
        const response = await this.$api.analytics.get({
          range: this.selectedRange
        })
        // Update component data with response
      } catch (error) {
        console.error('Error loading analytics:', error)
      }
    },
    async downloadReport() {
      try {
        // Generate and download PDF report
        const report = await this.$api.reports.generate({
          range: this.selectedRange,
          type: 'performance'
        })
        // Trigger download
      } catch (error) {
        console.error('Error downloading report:', error)
      }
    },
    shareReport() {
      // Implement sharing functionality
    }
  },
  mounted() {
    this.loadAnalytics()
  }
}
</script>

<style scoped>
.learning-analytics {
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.time-range-selector {
  display: flex;
  gap: 0.5rem;
  background: #F8FAFC;
  padding: 0.25rem;
  border-radius: 8px;
}

.range-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.range-btn.active {
  background: #C84C1C;
  color: white;
}

.summary-section {
  margin-bottom: 2rem;
}

.summary-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #F8FAFC;
  border-radius: 12px;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: rgba(200, 76, 28, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C84C1C;
  font-size: 1.2rem;
}

.improvement-stats {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat .value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1A1A1A;
}

.stat .label {
  font-size: 0.9rem;
  color: #666;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.trend-indicator.positive {
  color: #10B981;
}

.trend-indicator.negative {
  color: #EF4444;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.subject-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.5rem;
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.trend-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.trend-badge.increasing {
  background: #D1FAE5;
  color: #065F46;
}

.trend-badge.decreasing {
  background: #FEE2E2;
  color: #991B1B;
}

.trend-badge.stable {
  background: #E2E8F0;
  color: #475569;
}

.habits-section {
  margin-bottom: 2rem;
}

.habit-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.time-distribution {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin: 1rem 0;
}

.time-block {
  flex: 1;
  background: #E2E8F0;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.time-block.peak-time {
  background: #C84C1C;
}

.streak-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin: 1rem 0;
}

.day-block {
  aspect-ratio: 1;
  background: #E2E8F0;
  border-radius: 4px;
}

.day-block.active {
  background: #C84C1C;
}

.habit-insight {
  margin: 1rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.weekly-report {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 1.5rem;
}

.report-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1A1A1A;
}

.metric-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0;
}

.metric-change {
  font-size: 0.8rem;
  font-weight: 500;
}

.metric-change.positive {
  color: #10B981;
}

.metric-change.negative {
  color: #EF4444;
}

.report-highlights {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.report-highlights ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.report-highlights li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E2E8F0;
}

.report-highlights li:last-child {
  border-bottom: none;
}

.report-highlights li i {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.report-highlights li.achievement i {
  background: #FEF3C7;
  color: #92400E;
}

.report-highlights li.improvement i {
  background: #D1FAE5;
  color: #065F46;
}

.report-highlights li.suggestion i {
  background: #E0E7FF;
  color: #3730A3;
}

.report-actions {
  display: flex;
  gap: 1rem;
}

.report-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.download-btn {
  background: #C84C1C;
  color: white;
}

.share-btn {
  background: #F8FAFC;
  color: #1A1A1A;
  border: 1px solid #E2E8F0;
}

.report-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .learning-analytics {
    padding: 1rem;
  }

  .analytics-header {
    flex-direction: column;
    gap: 1rem;
  }

  .time-range-selector {
    width: 100%;
    justify-content: center;
  }

  .improvement-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .report-actions {
    flex-direction: column;
  }
}
</style> 