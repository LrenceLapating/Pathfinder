<template>
  <div class="thq-section-padding">
    <div class="testimonial17-max-width thq-section-max-width">
      <div class="testimonial17-container10">
        <h2 class="thq-heading-2">
          <slot name="heading1">
            <!--Default content for heading1-->
            <div class="testimonial17-fragment21">
              <span class="testimonial17-text35">Testimonials</span>
            </div>
          </slot>
        </h2>
        <span class="testimonial17-text11 thq-body-small">
          <slot name="content1">
            <!--Default content for content1-->
            <div class="testimonial17-fragment18">
              <span class="testimonial17-text32">
                See what educators and students are saying about PathFinder.
              </span>
            </div>
          </slot>
        </span>
      </div>
      <div class="thq-grid-2">
        <div class="thq-animated-card-bg-2">
          <div class="thq-animated-card-bg-1">
            <div data-animated="true" class="thq-card testimonial17-card1">
              <div class="testimonial17-container12">
                <img
                  :alt="author1Alt"
                  :src="author1Src"
                  class="testimonial17-image1"
                />
                <div class="testimonial17-container13">
                  <strong class="thq-body-large">
                    <slot name="author1Name">
                      <!--Default content for author1Name-->
                      <div class="testimonial17-fragment12">
                        <span class="testimonial17-text26">Ms. Johnson</span>
                      </div>
                    </slot>
                  </strong>
                  <span class="thq-body-small">
                    <slot name="author1Position">
                      <!--Default content for author1Position-->
                      <div class="testimonial17-fragment11">
                        <span class="testimonial17-text25">
                          5th Grade Teacher
                        </span>
                      </div>
                    </slot>
                  </span>
                </div>
              </div>
              <span class="testimonial17-text14 thq-body-small">
                <slot name="review1">
                  <!--Default content for review1-->
                  <div class="testimonial17-fragment20">
                    <span class="testimonial17-text34">
                      PathFinder has transformed the way my students engage with
                      learning. The personalized paths have significantly improved
                      their understanding and retention of concepts.
                    </span>
                  </div>
                </slot>
              </span>
            </div>
          </div>
        </div>
        <div class="thq-animated-card-bg-2">
          <div class="thq-animated-card-bg-1">
            <div data-animated="true" class="thq-card testimonial17-card2">
              <div class="testimonial17-container14">
                <img
                  :alt="author2Alt"
                  :src="author2Src"
                  class="testimonial17-image2"
                />
                <div class="testimonial17-container15">
                  <strong class="thq-body-large">
                    <slot name="author2Name">
                      <!--Default content for author2Name-->
                      <div class="testimonial17-fragment15">
                        <span class="testimonial17-text29">David S.</span>
                      </div>
                    </slot>
                  </strong>
                  <span class="thq-body-small">
                    <slot name="author2Position">
                      <!--Default content for author2Position-->
                      <div class="testimonial17-fragment10">
                        <span class="testimonial17-text24">
                          High School Student
                        </span>
                      </div>
                    </slot>
                  </span>
                </div>
              </div>
              <span class="testimonial17-text17 thq-body-small">
                <slot name="review2">
                  <!--Default content for review2-->
                  <div class="testimonial17-fragment14">
                    <span class="testimonial17-text28">
                      I used to struggle with staying motivated to study, but
                      PathFinder&apos;s rewards system keeps me engaged and
                      excited to learn every day.
                    </span>
                  </div>
                </slot>
              </span>
            </div>
          </div>
        </div>
        <div class="thq-animated-card-bg-2">
          <div class="thq-animated-card-bg-1">
            <div data-animated="true" class="thq-card testimonial17-card3">
              <div class="testimonial17-container16">
                <img
                  :alt="author3Alt"
                  :src="author3Src"
                  class="testimonial17-image3"
                />
                <div class="testimonial17-container17">
                  <strong class="thq-body-large">
                    <slot name="author3Name">
                      <!--Default content for author3Name-->
                      <div class="testimonial17-fragment13">
                        <span class="testimonial17-text27">Mrs. Rodriguez</span>
                      </div>
                    </slot>
                  </strong>
                  <span class="thq-body-small">
                    <slot name="author3Position">
                      <!--Default content for author3Position-->
                      <div class="testimonial17-fragment19">
                        <span class="testimonial17-text33">
                          8th Grade Teacher
                        </span>
                      </div>
                    </slot>
                  </span>
                </div>
              </div>
              <span class="testimonial17-text20 thq-body-small">
                <slot name="review3">
                  <!--Default content for review3-->
                  <div class="testimonial17-fragment22">
                    <span class="testimonial17-text36">
                      The data and insights provided by PathFinder&apos;s teacher
                      dashboard have been invaluable in tracking my students&apos;
                      progress and addressing their individual needs.
                    </span>
                  </div>
                </slot>
              </span>
            </div>
          </div>
        </div>
        <div class="thq-animated-card-bg-2">
          <div class="thq-animated-card-bg-1">
            <div data-animated="true" class="thq-card testimonial17-card4">
              <div class="testimonial17-container18">
                <img
                  :alt="author4Alt"
                  :src="author4Src"
                  class="testimonial17-image4"
                />
                <div class="testimonial17-container19">
                  <strong class="thq-body-large">
                    <slot name="author4Name">
                      <!--Default content for author4Name-->
                      <div class="testimonial17-fragment17">
                        <span class="testimonial17-text31">Emily L.</span>
                      </div>
                    </slot>
                  </strong>
                  <span class="thq-body-small">
                    <slot name="author4Position">
                      <!--Default content for author4Position-->
                      <div class="testimonial17-fragment16">
                        <span class="testimonial17-text30">
                          6th Grade Student
                        </span>
                      </div>
                    </slot>
                  </span>
                </div>
              </div>
              <span class="testimonial17-text23 thq-body-small">
                <slot name="review4">
                  <!--Default content for review4-->
                  <div class="testimonial17-fragment23">
                    <span class="testimonial17-text37">
                      I love how PathFinder adapts to my learning style. It feels
                      like having a personal tutor guiding me through each lesson.
                    </span>
                  </div>
                </slot>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Testimonial17',
  props: {
    author3Alt: {
      type: String,
      default: 'Mrs. Rodriguez Image Alt Text',
    },
    author1Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDN8fGF2YXRhcnxlbnwwfHx8fDE3MTYzODM1NTJ8MA&ixlib=rb-4.0.3&w=200',
    },
    author4Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDMxfHxhdmF0YXJ8ZW58MHx8fHwxNzE2MzgzNTY2fDA&ixlib=rb-4.0.3&w=200',
    },
    author1Alt: {
      type: String,
      default: 'Ms. Johnson Image Alt Text',
    },
    author2Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDE1fHxhdmF0YXJ8ZW58MHx8fHwxNzE2MzgzNTUyfDA&ixlib=rb-4.0.3&w=200',
    },
    author3Src: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEyfHxhdmF0YXJ8ZW58MHx8fHwxNzE2MzgzNTUyfDA&ixlib=rb-4.0.3&w=200',
    },
    author2Alt: {
      type: String,
      default: 'David S. Image Alt Text',
    },
    author4Alt: {
      type: String,
      default: 'Emily L. Image Alt Text',
    },
  },
}
</script>

<style scoped>
.testimonial17-max-width {
  display: flex;
  align-items: center;
  flex-direction: column;
}
 
.testimonial17-container10 {
  gap: var(--dl-layout-space-unit);
  display: flex;
  max-width: 600px;
  align-items: center;
  margin-bottom: var(--dl-layout-space-fourunits);
  flex-direction: column;
}
 
.testimonial17-text11 {
  text-align: center;
}
 
.testimonial17-container12 {
  gap: var(--dl-layout-space-unit);
  display: flex;
  align-self: flex-start;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}
 
.testimonial17-image1 {
  width: var(--dl-layout-size-small);
  height: var(--dl-layout-size-small);
  object-fit: cover;
  border-radius: var(--dl-layout-radius-round);
}
 
.testimonial17-container13 {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
}
 
.testimonial17-text14 {
  text-align: left;
}
 
.testimonial17-container14 {
  gap: var(--dl-layout-space-unit);
  display: flex;
  align-self: flex-start;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}
 
.testimonial17-image2 {
  width: var(--dl-layout-size-small);
  height: var(--dl-layout-size-small);
  object-fit: cover;
  border-radius: var(--dl-layout-radius-round);
}
 
.testimonial17-container15 {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
}
 
.testimonial17-text17 {
  text-align: left;
}
 
.testimonial17-container16 {
  gap: var(--dl-layout-space-unit);
  display: flex;
  align-self: flex-start;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}
 
.testimonial17-image3 {
  width: var(--dl-layout-size-small);
  height: var(--dl-layout-size-small);
  object-fit: cover;
  border-radius: var(--dl-layout-radius-round);
}
 
.testimonial17-container17 {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
}
 
.testimonial17-text20 {
  text-align: left;
}
 
.testimonial17-container18 {
  gap: var(--dl-layout-space-unit);
  display: flex;
  align-self: flex-start;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}
 
.testimonial17-image4 {
  width: var(--dl-layout-size-small);
  height: var(--dl-layout-size-small);
  object-fit: cover;
  border-radius: var(--dl-layout-radius-round);
}
 
.testimonial17-container19 {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
}
 
.testimonial17-text23 {
  text-align: left;
}
 
.testimonial17-fragment10 {
  display: contents;
}
 
.testimonial17-text24 {
  display: inline-block;
}
 
.testimonial17-fragment11 {
  display: contents;
}
 
.testimonial17-text25 {
  display: inline-block;
}
 
.testimonial17-fragment12 {
  display: contents;
}
 
.testimonial17-text26 {
  display: inline-block;
}
 
.testimonial17-fragment13 {
  display: contents;
}
 
.testimonial17-text27 {
  display: inline-block;
}
 
.testimonial17-fragment14 {
  display: contents;
}
 
.testimonial17-text28 {
  display: inline-block;
}
 
.testimonial17-fragment15 {
  display: contents;
}
 
.testimonial17-text29 {
  display: inline-block;
}
 
.testimonial17-fragment16 {
  display: contents;
}
 
.testimonial17-text30 {
  display: inline-block;
}
 
.testimonial17-fragment17 {
  display: contents;
}
 
.testimonial17-text31 {
  display: inline-block;
}
 
.testimonial17-fragment18 {
  display: contents;
}
 
.testimonial17-text32 {
  display: inline-block;
}
 
.testimonial17-fragment19 {
  display: contents;
}
 
.testimonial17-text33 {
  display: inline-block;
}
 
.testimonial17-fragment20 {
  display: contents;
}
 
.testimonial17-text34 {
  display: inline-block;
}
 
.testimonial17-fragment21 {
  display: contents;
}
 
.testimonial17-text35 {
  display: inline-block;
}
 
.testimonial17-fragment22 {
  display: contents;
}
 
.testimonial17-text36 {
  display: inline-block;
}
 
.testimonial17-fragment23 {
  display: contents;
}
 
.testimonial17-text37 {
  display: inline-block;
}
 
@media(max-width: 991px) {
  .testimonial17-container10 {
    margin-bottom: var(--dl-layout-space-threeunits);
  }
}
 
@media(max-width: 767px) {
  .testimonial17-container10 {
    margin-bottom: var(--dl-layout-space-oneandhalfunits);
  }
  .testimonial17-card1 {
    width: 100%;
  }
  .testimonial17-card2 {
    width: 100%;
  }
  .testimonial17-card3 {
    width: 100%;
  }
  .testimonial17-card4 {
    width: 100%;
  }
}
</style>
