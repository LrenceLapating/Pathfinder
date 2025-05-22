<template>
  <div class="ai-tutor" :class="{ 'minimized': isMinimized }">
    <div class="tutor-header">
      <div class="tutor-branding">
        <div class="tutor-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="tutor-info">
          <h3>AI Tutor</h3>
          <span class="status-badge">Online</span>
        </div>
      </div>
      <div class="tutor-controls">
        <button class="control-btn" @click="toggleMinimize">
          <i :class="isMinimized ? 'fas fa-expand' : 'fas fa-minus'"></i>
        </button>
        <button class="control-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    
    <div class="tutor-content" v-if="!isMinimized">
      <div class="conversation-container" ref="conversationContainer">
        <div class="conversation-welcome">
          <h3>Welcome to your AI Tutor!</h3>
          <p>I'm here to help with your learning journey. Ask me any questions about your assignments, coursework, or study strategies.</p>
        </div>
        
        <div class="messages-list">
          <transition-group name="message-fade">
            <div v-for="message in messages" :key="message.id" 
                :class="['message', message.sender === 'user' ? 'user-message' : 'tutor-message']">
              <div class="message-avatar" v-if="message.sender === 'tutor'">
                <i class="fas fa-robot"></i>
              </div>
              <div class="message-content">
                <p v-html="formatMessage(message.text)"></p>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
            </div>
          </transition-group>
        </div>
        
        <div class="typing-indicator" v-if="isTyping">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div class="suggestion-chips" v-if="suggestions.length > 0 && !hasUserSentMessage">
        <button v-for="suggestion in suggestions" :key="suggestion" 
                class="suggestion-chip"
                @click="sendMessage(suggestion)">
          {{ suggestion }}
        </button>
      </div>
      
      <div class="message-input">
        <textarea 
          v-model="newMessage" 
          placeholder="Ask me anything..."
          @keydown.enter.prevent="sendMessage"
          ref="messageInput"
          :disabled="isTyping">
        </textarea>
        <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim() || isTyping">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AITutor',
  data() {
    return {
      isMinimized: false,
      messages: [],
      newMessage: '',
      isTyping: false,
      messageIdCounter: 1,
      suggestions: [
        "Help me understand fractions",
        "What's the best way to study for a test?",
        "Can you explain photosynthesis?",
        "How do I write a good essay?"
      ],
      hasUserSentMessage: false
    }
  },
  methods: {
    toggleMinimize() {
      this.isMinimized = !this.isMinimized
      if (!this.isMinimized) {
        this.$nextTick(() => {
          this.$refs.messageInput.focus()
          this.scrollToBottom()
        })
      }
    },
    sendMessage(text = null) {
      const messageToSend = text || this.newMessage.trim()
      
      if (!messageToSend) return
      
      // Add user message
      this.addMessage({
        id: this.messageIdCounter++,
        sender: 'user',
        text: messageToSend,
        timestamp: new Date()
      })
      
      this.hasUserSentMessage = true
      this.newMessage = ''
      
      // Simulate AI response
      this.isTyping = true
      
      setTimeout(() => {
        this.respondToMessage(messageToSend)
        this.isTyping = false
      }, 1500)
    },
    addMessage(message) {
      this.messages.push(message)
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    respondToMessage(userMessage) {
      let response = ''
      
      // Simple response logic - in a real app this would call an AI service
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = "Hello! How can I help with your learning today?"
      } else if (userMessage.toLowerCase().includes('fraction')) {
        response = "Fractions represent parts of a whole. For example, in the fraction 3/4, the numerator (3) tells us how many parts we have, and the denominator (4) tells us how many equal parts make up the whole. Would you like me to explain how to add, subtract, multiply, or divide fractions?"
      } else if (userMessage.toLowerCase().includes('study')) {
        response = "Effective study techniques include:<br>1. Spaced repetition: Study in short bursts over time<br>2. Active recall: Test yourself rather than just reviewing<br>3. Teaching concepts to others<br>4. Using mnemonic devices for complex information<br>5. Taking breaks and getting enough sleep<br><br>Would you like more specific tips for your upcoming tests?"
      } else if (userMessage.toLowerCase().includes('photosynthesis')) {
        response = "Photosynthesis is the process by which plants convert light energy into chemical energy. The basic equation is:<br><br>Carbon dioxide + Water + Light energy → Glucose + Oxygen<br><br>Plants capture sunlight using chlorophyll in their chloroplasts, then use that energy to combine CO₂ and water into glucose (sugar) while releasing oxygen as a byproduct."
      } else if (userMessage.toLowerCase().includes('essay')) {
        response = "A good essay typically has:<br>1. A clear thesis statement that presents your main argument<br>2. Well-structured paragraphs with topic sentences<br>3. Supporting evidence and examples<br>4. Smooth transitions between ideas<br>5. A conclusion that reinforces your thesis<br><br>Would you like help with a specific part of essay writing?"
      } else {
        response = "That's an interesting question! I'm designed to help with academic subjects like math, science, language arts, and study skills. Could you tell me more about what you're working on, and I'll do my best to assist you?"
      }
      
      this.addMessage({
        id: this.messageIdCounter++,
        sender: 'tutor',
        text: response,
        timestamp: new Date()
      })
    },
    scrollToBottom() {
      const container = this.$refs.conversationContainer
      container.scrollTop = container.scrollHeight
    },
    formatTime(timestamp) {
      const now = new Date()
      const messageTime = new Date(timestamp)
      
      if (now.toDateString() === messageTime.toDateString()) {
        return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        return messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
               ' ' + messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    },
    formatMessage(text) {
      // Simple link detection for demonstration
      return text.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      )
    },
    open() {
      this.isMinimized = false
      this.$nextTick(() => {
        this.$refs.messageInput.focus()
      })
    }
  },
  mounted() {
    // Add initial tutor message
    setTimeout(() => {
      this.addMessage({
        id: this.messageIdCounter++,
        sender: 'tutor',
        text: "Hi there! 👋 I'm your AI Tutor. I can help explain concepts, solve problems, or give you study tips. What would you like help with today?",
        timestamp: new Date()
      })
    }, 500)
  }
}
</script>

<style scoped>
.ai-tutor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: calc(100vh - 120px);
}

.ai-tutor.minimized {
  width: 300px;
  height: auto;
}

.tutor-header {
  padding: 1rem 1.5rem;
  background: #1A1A1A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tutor-branding {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.tutor-avatar {
  width: 36px;
  height: 36px;
  background: #C84C1C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.tutor-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  font-size: 0.7rem;
  background: rgba(52, 211, 153, 0.2);
  color: #10B981;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  margin-top: 0.2rem;
}

.tutor-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.tutor-content {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: calc(100vh - 180px);
}

.conversation-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-behavior: smooth;
}

.conversation-welcome {
  text-align: center;
  padding: 1.5rem;
  background: #F8FAFC;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.conversation-welcome h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #1A1A1A;
}

.conversation-welcome p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.8rem;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.tutor-message {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  background: #C84C1C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.message-content {
  background: #F8FAFC;
  padding: 0.8rem 1rem;
  border-radius: 16px;
  position: relative;
}

.user-message .message-content {
  background: #C84C1C;
  color: white;
  border-bottom-right-radius: 4px;
}

.tutor-message .message-content {
  background: #F8FAFC;
  color: #1A1A1A;
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.message-content a {
  color: inherit;
  text-decoration: underline;
}

.message-time {
  display: block;
  text-align: right;
  font-size: 0.7rem;
  margin-top: 0.3rem;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: #F8FAFC;
  border-radius: 16px;
  width: fit-content;
  margin-top: 0.5rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #C84C1C;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.4;
  animation: typing 1.5s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.suggestion-chips {
  padding: 0 1.5rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-chip {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: #1A1A1A;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.suggestion-chip:hover {
  background: #C84C1C;
  color: white;
  border-color: #C84C1C;
}

.message-input {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.message-input textarea {
  flex: 1;
  min-height: 24px;
  max-height: 120px;
  border: none;
  border-radius: 20px;
  background: #F8FAFC;
  padding: 0.8rem 1.2rem;
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.3s ease;
}

.message-input textarea:focus {
  background: #F1F5F9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.message-input textarea::placeholder {
  color: #94A3B8;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #C84C1C;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(200, 76, 28, 0.3);
}

.send-btn:disabled {
  background: #CBD5E1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Animations */
.message-fade-enter-active, .message-fade-leave-active {
  transition: all 0.3s;
}
.message-fade-enter-from, .message-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive Styles */
@media (max-width: 576px) {
  .ai-tutor {
    width: calc(100% - 40px);
    height: 80vh;
    max-height: 80vh;
    bottom: 10px;
    right: 20px;
  }

  .ai-tutor.minimized {
    width: 90%;
  }
  
  .tutor-content {
    height: auto;
    max-height: none;
    flex: 1;
  }
}
</style> 