<template>
  <div class="hero17-header78">
    <div class="hero17-column thq-section-padding thq-section-max-width">
      <div class="hero17-content1">
        <h1 class="hero17-text1 thq-heading-1">
          <slot name="heading1">
            <!--Default content for heading1-->
            <div class="hero17-fragment3">
              <span class="hero17-text7">
                Medium length hero headline goes here
              </span>
            </div>
          </slot>
        </h1>
        <p class="hero17-text2 thq-body-large">
          <slot name="content1">
            <!--Default content for content1-->
            <div class="hero17-fragment4">
              <span class="hero17-text8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique. Duis cursus,
                mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
                libero vitae erat.
              </span>
            </div>
          </slot>
        </p>
      </div>
      <div class="hero17-actions">
        <button class="thq-button-filled hero17-button1">
          <span class="thq-body-small">
            <slot name="action1">
              <!--Default content for action1-->
              <div class="hero17-fragment2">
                <span class="hero17-text6">Main action</span>
              </div>
            </slot>
          </span>
        </button>
        <button class="thq-button-outline hero17-button2">
          <span class="thq-body-small">
            <slot name="action2">
              <!--Default content for action2-->
              <div class="hero17-fragment1">
                <span class="hero17-text5">Secondary action</span>
              </div>
            </slot>
          </span>
        </button>
      </div>
    </div>
    <div class="hero17-content2">
      <div
        class="hero17-row-container1 thq-animated-group-container-horizontal thq-mask-image-horizontal"
      >
        <div class="thq-animated-group-horizontal">
          <img
            :alt="image1Alt"
            :src="image1Src"
            class="hero17-placeholder-image10 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image2Alt"
            :src="image2Src"
            class="hero17-placeholder-image11 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image3Alt"
            :src="image3Src"
            class="hero17-placeholder-image12 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image4Alt"
            :src="image4Src"
            class="hero17-placeholder-image13 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image5Alt"
            :src="image5Src"
            class="hero17-placeholder-image14 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image6Alt"
            :src="image6Src"
            class="hero17-placeholder-image15 thq-img-scale thq-img-ratio-1-1"
          />
        </div>
        <div class="thq-animated-group-horizontal">
          <img
            :alt="image1Alt"
            :src="image1Src"
            class="hero17-placeholder-image16 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image2Alt"
            :src="image2Src"
            class="hero17-placeholder-image17 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image3Alt"
            :src="image3Src"
            class="hero17-placeholder-image18 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image4Alt"
            :src="image4Src"
            class="hero17-placeholder-image19 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image5Alt"
            :src="image5Src"
            class="hero17-placeholder-image20 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            alt="Hero Image"
            src="https://images.unsplash.com/photo-1534312527009-56c7016453e6?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDIxfHxhYnN0cmFjdHxlbnwwfHx8fDE3MTA4NzA5MzB8MA&amp;ixlib=rb-4.0.3&amp;w=1500"
            class="hero17-placeholder-image21 thq-img-scale thq-img-ratio-1-1"
          />
        </div>
      </div>
      <div
        class="hero17-row-container2 thq-animated-group-container-horizontal thq-mask-image-horizontal"
      >
        <div class="thq-animated-group-horizontal-reverse">
          <img
            :alt="image7Alt"
            :src="image7Src"
            class="hero17-placeholder-image22 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image8Alt"
            :src="image8Src"
            class="hero17-placeholder-image23 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image9Alt"
            :src="image9Src"
            class="hero17-placeholder-image24 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image10Alt"
            :src="image10Src"
            class="hero17-placeholder-image25 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image11Alt"
            :src="image11Src"
            class="hero17-placeholder-image26 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image12Alt"
            :src="image12Src"
            class="hero17-placeholder-image27 thq-img-scale thq-img-ratio-1-1"
          />
        </div>
        <div class="thq-animated-group-horizontal-reverse">
          <img
            :alt="image7Alt"
            :src="image7Src"
            class="hero17-placeholder-image28 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image8Alt"
            :src="image8Src"
            class="hero17-placeholder-image29 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image9Alt"
            :src="image9Src"
            class="hero17-placeholder-image30 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image10Alt"
            :src="image10Src"
            class="hero17-placeholder-image31 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            :alt="image11Alt"
            :src="image11Src"
            class="hero17-placeholder-image32 thq-img-scale thq-img-ratio-1-1"
          />
          <img
            alt="Hero Image"
            src="https://images.unsplash.com/photo-1568214379698-8aeb8c6c6ac8?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEyfHxncmFmaWN8ZW58MHx8fHwxNzE1Nzk0OTk5fDA&amp;ixlib=rb-4.0.3&amp;w=1500"
            class="hero17-placeholder-image33 thq-img-scale thq-img-ratio-1-1"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="hero17-container2">
        <DangerousHTML
          html="<style>
    @keyframes scroll-x {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(calc(-100% - 16px));
      }
    }
  
    @keyframes scroll-y {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(calc(-100% - 16px));
      }
    }
  </style>
  "
        ></DangerousHTML>
      </div>
    </div>
  </div>
</template>

<script>
import DangerousHTML from 'dangerous-html/vue'

export default {
  name: 'Hero17',
  props: {
    image3Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2NXw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image8Alt: {
      type: String,
      default: 'Hero Image',
    },
    image2Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1718083011244-f25862f196b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2NXw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image6Alt: {
      type: String,
      default: 'Hero Image',
    },
    image11Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1656378130547-003a265a05e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2Nnw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image5Alt: {
      type: String,
      default: 'Hero Image',
    },
    image1Alt: {
      type: String,
      default: 'Hero Image',
    },
    image7Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1620254519036-454ef6a9f6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2Nnw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image7Alt: {
      type: String,
      default: 'Hero Image',
    },
    image12Alt: {
      type: String,
      default: 'Hero Image',
    },
    image2Alt: {
      type: String,
      default: 'Hero Image',
    },
    image6Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1509088960169-ecb53eda6ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2Nnw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image12Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1578593139939-cccb1e98698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2N3w&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image3Alt: {
      type: String,
      default: 'Hero Image',
    },
    image9Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1637148734636-906c24feeb55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2OHw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image11Alt: {
      type: String,
      default: 'Hero Image',
    },
    image8Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1426024120108-99cc76989c71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2OHw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image5Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1667613373454-8bba9d94a9be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2OHw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image4Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1601890596438-5ac9be4e1340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2OXw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image10Alt: {
      type: String,
      default: 'Hero Image',
    },
    image4Alt: {
      type: String,
      default: 'Hero Image',
    },
    image10Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE2OXw&ixlib=rb-4.1.0&q=80&w=1080',
    },
    image9Alt: {
      type: String,
      default: 'Hero Image',
    },
    image1Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1560785496-3c9d27877182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzg4MTE3MHw&ixlib=rb-4.1.0&q=80&w=1080',
    },
  },
  components: {
    DangerousHTML,
  },
}
</script>

<style scoped>
.hero17-header78 {
  gap: var(--dl-layout-space-threeunits);
  width: 100%;
  height: auto;
  display: flex;
  overflow: hidden;
  position: relative;
  align-items: center;
  flex-shrink: 0;
  flex-direction: column;
}
 
.hero17-column {
  gap: var(--dl-layout-space-oneandhalfunits);
  width: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: var(--dl-layout-space-unit);
}
 
.hero17-content1 {
  gap: var(--dl-layout-space-oneandhalfunits);
  display: flex;
  align-self: stretch;
  align-items: center;
  flex-direction: column;
}
 
.hero17-text1 {
  text-align: center;
}
 
.hero17-text2 {
  text-align: center;
}
 
.hero17-actions {
  gap: var(--dl-layout-space-unit);
  display: flex;
  align-items: flex-start;
  padding-top: var(--dl-layout-space-unit);
}
 
.hero17-content2 {
  gap: var(--dl-layout-space-oneandhalfunits);
  width: 100%;
  display: flex;
  position: relative;
  align-items: flex-start;
  flex-direction: column;
}
 
.hero17-row-container1 {
  width: 100%;
}
 
.hero17-placeholder-image10 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image11 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image12 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image13 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image14 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image15 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image16 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image17 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image18 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image19 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image20 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image21 {
  width: 400px;
  height: 400px;
}
 
.hero17-row-container2 {
  width: 100%;
}
 
.hero17-placeholder-image22 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image23 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image24 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image25 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image26 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image27 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image28 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image29 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image30 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image31 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image32 {
  width: 400px;
  height: 400px;
}
 
.hero17-placeholder-image33 {
  width: 400px;
  height: 400px;
}
 
.hero17-container2 {
  display: contents;
}
 
.hero17-fragment1 {
  display: contents;
}
 
.hero17-text5 {
  display: inline-block;
}
 
.hero17-fragment2 {
  display: contents;
}
 
.hero17-text6 {
  display: inline-block;
}
 
.hero17-fragment3 {
  display: contents;
}
 
.hero17-text7 {
  display: inline-block;
}
 
.hero17-fragment4 {
  display: contents;
}
 
.hero17-text8 {
  display: inline-block;
}
 
@media(max-width: 767px) {
  .hero17-content2 {
    width: 100%;
  }
}
 
@media(max-width: 479px) {
  .hero17-actions {
    width: 100%;
    flex-direction: column;
  }
  .hero17-button1 {
    width: 100%;
  }
  .hero17-button2 {
    width: 100%;
  }
}
</style>
