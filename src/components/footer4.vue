<template>
  <footer class="footer4-footer7 thq-section-padding">
    <div class="footer4-max-width thq-section-max-width">
      <div class="footer4-content">
        <div class="footer4-logo1">
          <img :alt="logoAlt" :src="logoSrc" class="footer4-logo2" />
        </div>
        <div class="footer4-links">
          <a
            href="https://example.com"
            target="_blank"
            rel="noreferrer noopener"
            class="thq-body-small"
          >
            <slot name="link1">
              <!--Default content for link1-->
              <div class="footer4-fragment3">
                <span class="footer4-text16">About Us</span>
              </div>
            </slot>
          </a>
          <a
            href="https://example.com"
            target="_blank"
            rel="noreferrer noopener"
            class="thq-body-small"
          >
            <slot name="link2">
              <!--Default content for link2-->
              <div class="footer4-fragment5">
                <span class="footer4-text18">Contact Us</span>
              </div>
            </slot>
          </a>
          <a
            href="https://example.com"
            target="_blank"
            rel="noreferrer noopener"
            class="thq-body-small"
          >
            <slot name="link3">
              <!--Default content for link3-->
              <div class="footer4-fragment2">
                <span class="footer4-text15">FAQs</span>
              </div>
            </slot>
          </a>
          <a
            href="https://example.com"
            target="_blank"
            rel="noreferrer noopener"
            class="thq-body-small"
          >
            <slot name="link4">
              <!--Default content for link4-->
              <div class="footer4-fragment6">
                <span class="footer4-text19">Terms of Use</span>
              </div>
            </slot>
          </a>
          <a
            href="https://example.com"
            target="_blank"
            rel="noreferrer noopener"
            class="thq-body-small"
          >
            <slot name="link5">
              <!--Default content for link5-->
              <div class="footer4-fragment1">
                <span class="footer4-text14">Privacy Policy</span>
              </div>
            </slot>
          </a>
        </div>
      </div>
      <div class="footer4-credits">
        <div class="thq-divider-horizontal"></div>
        <div class="footer4-row">
          <div class="footer4-container">
            <span class="thq-body-small">© 2025 Pathfinder</span>
          </div>
          <div class="footer4-footer-links">
            <span class="footer4-text11 thq-body-small">
              <slot name="privacyLink">
                <!--Default content for privacyLink-->
                <div class="footer4-fragment8">
                  <span class="footer4-text21">Privacy Policy</span>
                </div>
              </slot>
            </span>
            <span class="thq-body-small">
              <slot name="termsLink">
                <!--Default content for termsLink-->
                <div class="footer4-fragment4">
                  <span class="footer4-text17">Terms of Use</span>
                </div>
              </slot>
            </span>
            <span class="thq-body-small">
              <slot name="cookiesLink">
                <!--Default content for cookiesLink-->
                <div class="footer4-fragment7">
                  <span class="footer4-text20">Cookies Policy</span>
                </div>
              </slot>
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer4',
  props: {
    logoAlt: {
      type: String,
      default: 'PathFinder Logo',
    },
    logoSrc: {
      type: String,
      default:
        'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    },
  },
}
</script>

<style scoped>
.footer4-footer7 {
  width: 100%;
  height: auto;
  display: flex;
  overflow: hidden;
  position: relative;
  align-items: center;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
}
 
.footer4-max-width {
  gap: var(--dl-layout-space-threeunits);
  display: flex;
  align-items: center;
  flex-direction: column;
}
 
.footer4-content {
  gap: var(--dl-layout-space-twounits);
  display: flex;
  align-items: center;
  flex-direction: column;
}
 
.footer4-logo1 {
  gap: 24px;
  display: flex;
  overflow: hidden;
  align-items: flex-start;
  flex-direction: column;
}
 
.footer4-logo2 {
  height: 2rem;
}
 
.footer4-links {
  gap: var(--dl-layout-space-twounits);
  display: flex;
  align-items: flex-start;
}
 
.footer4-credits {
  gap: var(--dl-layout-space-twounits);
  display: flex;
  align-self: stretch;
  align-items: center;
  flex-direction: column;
}
 
.footer4-row {
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  justify-content: space-between;
}
 
.footer4-container {
  display: flex;
  align-items: flex-start;
}
 
.footer4-footer-links {
  gap: 24px;
  display: flex;
  align-items: flex-start;
}
 
.footer4-text11 {
  fill: var(--dl-color-theme-neutral-dark);
  color: var(--dl-color-theme-neutral-dark);
}
 
.footer4-fragment1 {
  display: contents;
}
 
.footer4-text14 {
  display: inline-block;
}
 
.footer4-fragment2 {
  display: contents;
}
 
.footer4-text15 {
  display: inline-block;
}
 
.footer4-fragment3 {
  display: contents;
}
 
.footer4-text16 {
  display: inline-block;
}
 
.footer4-fragment4 {
  display: contents;
}
 
.footer4-text17 {
  display: inline-block;
}
 
.footer4-fragment5 {
  display: contents;
}
 
.footer4-text18 {
  display: inline-block;
}
 
.footer4-fragment6 {
  display: contents;
}
 
.footer4-text19 {
  display: inline-block;
}
 
.footer4-fragment7 {
  display: contents;
}
 
.footer4-text20 {
  display: inline-block;
}
 
.footer4-fragment8 {
  display: contents;
}
 
.footer4-text21 {
  display: inline-block;
}
 
@media(max-width: 767px) {
  .footer4-row {
    gap: var(--dl-layout-space-oneandhalfunits);
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
 
@media(max-width: 479px) {
  .footer4-max-width {
    gap: var(--dl-layout-space-oneandhalfunits);
  }
  .footer4-links {
    flex-direction: column;
  }
  .footer4-footer-links {
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
