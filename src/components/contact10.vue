<template>
  <div class="contact10-container1 thq-section-padding">
    <div class="contact10-max-width thq-section-max-width">
      <div class="contact10-content1 thq-flex-row">
        <div class="contact10-content2">
          <h2 class="thq-heading-2">
            <slot name="heading1">
              <!--Default content for heading1-->
              <div class="contact10-fragment3">
                <span class="contact10-text18">Contact Us</span>
              </div>
            </slot>
          </h2>
          <p class="thq-body-large">
            <slot name="content1">
              <!--Default content for content1-->
              <div class="contact10-fragment1">
                <span class="contact10-text16">
                  Have questions or need support? Reach out to us!
                </span>
              </div>
            </slot>
          </p>
        </div>
      </div>
      <div class="contact10-content3 thq-flex-row">
        <div class="contact10-container2">
          <img
            :alt="location1ImageAlt"
            :src="location1ImageSrc"
            class="contact10-image1 thq-img-ratio-16-9"
          />
          <h3 class="contact10-text12 thq-heading-3">
            <slot name="location1">
              <!--Default content for location1-->
              <div class="contact10-fragment5">
                <span class="contact10-text20">
                  Email: support@pathfinder.com
                </span>
              </div>
            </slot>
          </h3>
          <p class="thq-body-large">
            <slot name="location1Description">
              <!--Default content for location1Description-->
              <div class="contact10-fragment2">
                <span class="contact10-text17">
                  Drop us an email anytime, and we&apos;ll get back to you as soon
                  as possible.
                </span>
              </div>
            </slot>
          </p>
          <div class="contact10-container3">
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer noopener"
              class="thq-button-flat thq-body-small"
            >
              Get directions
            </a>
          </div>
        </div>
        <div class="contact10-container4">
          <img
            :alt="location2ImageAlt"
            :src="location2ImageSrc"
            class="contact10-image2 thq-img-ratio-16-9"
          />
          <h3 class="contact10-text14 thq-heading-3">
            <slot name="location2">
              <!--Default content for location2-->
              <div class="contact10-fragment6">
                <span class="contact10-text21">Phone: 123-456-7890</span>
              </div>
            </slot>
          </h3>
          <p class="thq-body-large">
            <slot name="location2Description">
              <!--Default content for location2Description-->
              <div class="contact10-fragment4">
                <span class="contact10-text19">
                  Give us a call during our office hours for immediate assistance.
                </span>
              </div>
            </slot>
          </p>
          <div class="contact10-container5">
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer noopener"
              class="thq-button-flat thq-body-small"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact10',
  props: {
    location2ImageSrc: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1571979195097-59d223315d89?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDMxfHxidWNoYXJlc3R8ZW58MHx8fHwxNzE2Mjg2MzE3fDA&ixlib=rb-4.0.3&w=1400',
    },
    location1ImageSrc: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1588694926280-3ae414d06ccb?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEzfHxjbHVqfGVufDB8fHx8MTcxNjI4NjI4N3ww&ixlib=rb-4.0.3&w=1400',
    },
    location2ImageAlt: {
      type: String,
      default: 'Phone Icon',
    },
    location1ImageAlt: {
      type: String,
      default: 'Email Icon',
    },
  },
}
</script>

<style scoped>
.contact10-container1 {
  display: flex;
  position: relative;
  align-items: flex-start;
  flex-direction: column;
}
 
.contact10-max-width {
  align-self: center;
}
 
.contact10-content1 {
  width: 100%;
  margin-bottom: var(--dl-layout-space-threeunits);
  justify-content: flex-start;
}
 
.contact10-content2 {
  gap: var(--dl-layout-space-unit);
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  flex-direction: column;
}
 
.contact10-content3 {
  width: 100%;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
}
 
.contact10-container2 {
  gap: var(--dl-layout-space-oneandhalfunits);
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
}
 
.contact10-image1 {
  object-fit: cover;
}
 
.contact10-text12 {
  text-align: center;
}
 
.contact10-container3 {
  flex: 0 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
 
.contact10-container4 {
  gap: var(--dl-layout-space-oneandhalfunits);
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
}
 
.contact10-image2 {
  object-fit: cover;
}
 
.contact10-text14 {
  text-align: center;
}
 
.contact10-container5 {
  flex: 0 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
 
.contact10-fragment1 {
  display: contents;
}
 
.contact10-text16 {
  display: inline-block;
}
 
.contact10-fragment2 {
  display: contents;
}
 
.contact10-text17 {
  display: inline-block;
}
 
.contact10-fragment3 {
  display: contents;
}
 
.contact10-text18 {
  display: inline-block;
}
 
.contact10-fragment4 {
  display: contents;
}
 
.contact10-text19 {
  display: inline-block;
}
 
.contact10-fragment5 {
  display: contents;
}
 
.contact10-text20 {
  display: inline-block;
}
 
.contact10-fragment6 {
  display: contents;
}
 
.contact10-text21 {
  display: inline-block;
}
 
@media(max-width: 991px) {
  .contact10-content1 {
    align-items: flex-start;
    justify-content: flex-start;
  }
  .contact10-content3 {
    position: relative;
    align-items: center;
    flex-direction: column;
  }
}
 
@media(max-width: 767px) {
  .contact10-content1 {
    gap: var(--dl-layout-space-oneandhalfunits);
  }
  .contact10-image1 {
    width: 100%;
  }
  .contact10-image2 {
    width: 100%;
  }
}
</style>
