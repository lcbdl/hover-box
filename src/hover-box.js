const template = document.createElement('template');
template.innerHTML = `
  <style>
    :root {
      --border-color: #ffffff;
      --bg-color: green;
      --text-color: white;
      --box-width: 600px;
      --box-top: 0px;
      --box-left: 100px;
    }

    @layer base {
      html {
        @apply bg-cyan-100;
      }
      h1 {
        @apply text-4xl font-bold mt-6 mb-4;
      }
      h2 {
        @apply text-3xl font-bold mt-4 mb-2;
      }
    }

    @layer components {
      .box {
        top: var(--box-top);
        left: var(--box-left);
        width: var(--box-width);
        background: var(--bg-color);
        color: var(--text-color);
        border-color: var(--border-color);
        @apply h-auto border-solid border-2 rounded-xl mt-[20px] mb-[100px] absolute p-[20px] z-[100] after:absolute after:font-[fontAwesome] after:text-[72px] before:absolute before:font-[fontAwesome] before:text-[72px] after:text-[var(--bg-color)];
      }

      /* Left arrow */
      .left-arrow.box {
        @apply after:content-['\f0d9'] after:top-[calc(50%-36px)] after:-left-[21px] before:content-['\f0d9'] before:-left-[24px] before:top-[calc(50%-36px)];
      }

      /* Right arrow */
      .right-arrow.box {
        @apply before:content-['\f0da'] before:top-[calc(50%-36px)] before:-right-[24px] after:content-['\f0da'] after:top-[calc(50%-36px)] after:-right-[21px];
      }

      /* up arrow */
      .up-arrow.box {
        @apply before:content-['\f0d8'] before:left-[calc(50%-36px)] before:-top-[68px] after:content-['\f0d8'] after:left-[calc(50%-36px)] after:-top-[65px];
      }

      /* down arrow */
      .down-arrow.box {
        @apply before:content-['\f0d7'] before:left-[calc(50%-36px)] before:-bottom-[64px] after:content-['\f0d7'] after:left-[calc(50%-36px)] after:-bottom-[61px];
      }
    }
  </style>

  <div>
    <div id='hover-trigger'>
      <slot name="hover-trigger"/>
    </div>
    <div id='hover-content' class="box hidden">
      <slot name="hover-content/>
    </div>
  </div>
`;

customElements.define(
  'hover-box',
  class HoverBox extends HTMLElement {
    onHover() {
      this.showHoverContent = true;
    }

    constructor() {
      super();
      this.onHover = this.onHover.bind(this);

      this.showHoverContent = false;

      this.attachShadow({ mode: 'open' });

      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.hoverTrigger = this.shadowRoot.querySelector('#hover-trigger');
      this.HoverContent = this.shadowRoot.querySelector('#hover-content');
    }

    connectedCallback() {
      this.hoverTrigger.addEventListener('mouseover', () => {
        this.timerHandle = window.setTimeout(this.onHover, 1000);
      });
      this.hoverTrigger.addEventListener('mouseout', (e) => {
        if (this.timerHandle) {
          window.clearTimeout(this.timerHandle);
        }
        this.showHoverContent = false;
      });
    }

    disconnectedCallback() {
      this.hoverTrigger.removeEventListener();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} has changed. oldValue=${oldValue}, newValue=${newValue}`);
    }
  }
);
