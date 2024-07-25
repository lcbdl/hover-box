const template = document.createElement("template");
template.innerHTML = `
  <style>
  :host {
    #hover-content {
      position: absolute;
      height: auto;
      border: solid 2px;
      border-radius: 0px;
      margin-top: 0px;
      padding: 0px;
      z-index: 999999;
    } 

    .content-wrapper {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    #hover-trigger {
      width: max-content;
      height: max-content;
    }
    
    #header {
      padding: 0.5rem;
      background-color: #3788d8;
      color: white;
      font-size: 1.125rem;
      line-height: 1.75rem;
      font-weight: 700;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    #title {
      flex-grow: 1;
    }

    #close-wrapper {
      flex-grow: 0;
      width: fit-content;
    }

    #close-button {
      border-radius: 0.375rem /* 6px */;
      color: white;
      background-color: inherit;
      border: none;
    }
    
    #close-button:hover,
    #close-button:focus {
      --tw-ring-offset-width: 2px;
      --tw-ring-opacity: 1;
      --tw-ring-color: rgb(55 65 81 / var(--tw-ring-opacity))  
      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    }

  }
  </style>

  <div class='hover-box'>
    <div id='hover-trigger'>
      <slot name='hover-trigger'/>
    </div>
    <div id='hover-content' style='display:none'>
      <div class="content-wrapper">
        <div id='header'>
          <div id='title'>Calendar Events</div>
          <div id="close-wrapper">
            <button
              type="button"
              id="close-button"
            >
              <span class="sr-only">Close</span>
              <!-- Close Icon -->
              <svg
                style="height:1.5rem; width:1.5rem"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
          <div style='max-height: 250px; overflow-y: auto'>
            <slot name='hover-content' />
          </div>
      </div>
    </div>
  </div>
`;

const OFFSET = 6;

customElements.define(
  "hover-box",
  class HoverBox extends HTMLElement {
    constructor() {
      super();
      this.getHiddenElementHeight = this.getHiddenElementHeight.bind(this);
      this.onHover = this.onHover.bind(this);

      this.timerHandle = undefined;

      this.attachShadow({ mode: "open" });

      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.hoverTrigger = this.shadowRoot.querySelector("#hover-trigger");
      this.hoverContent = this.shadowRoot.querySelector("#hover-content");
      this.closeButton = this.shadowRoot.querySelector("#close-button");

      const title = this.getAttribute("hover-title") ?? "";
      this.shadowRoot.querySelector("#title").innerHTML = title;

      this.width = parseInt(this.getAttribute("width") ?? "500");
      this.color = this.getAttribute("color") ?? "balck";
      this.backgroundColor = this.getAttribute("backgroundColor") ?? "white";
      this.borderColor = this.getAttribute("borderColor") ?? "334155";

      Object.assign(this.hoverContent.style, {
        color: this.color,
        background: this.backgroundColor,
        borderColor: this.borderColor,
        width: `${this.width}px`,
      });
    }

    getHiddenElementHeight(ele) {
      Object.assign(ele.style, {
        left: "-99999px",
        display: "block",
      });
      const rect = ele.getBoundingClientRect();
      Object.assign(ele.style, {
        left: "0px",
        display: "none",
      });
      return rect;
    }

    onHover() {
      const { height: contentHeight, width: contentWidth } =
        this.getHiddenElementHeight(this.hoverContent);

      const rect = this.hoverTrigger.getBoundingClientRect();
      const triggerTop = rect.top;
      const triggerLeft = rect.left;
      const triggerBottom = rect.bottom;
      const triggerRight = rect.right;

      let contentTop = 0;
      let contentLeft = 0;
      if (triggerBottom + OFFSET + contentHeight <= window.innerHeight) {
        contentTop = triggerBottom + OFFSET;
      } else {
        contentTop =
          triggerTop - OFFSET - contentHeight < 0
            ? triggerBottom + OFFSET
            : triggerTop - OFFSET - contentHeight;
      }
      if (triggerRight + contentWidth < window.innerWidth) {
        contentLeft = triggerLeft;
      } else {
        contentLeft =
          triggerRight - contentWidth <= 0 ? 0 : triggerRight - contentWidth;
      }

      Object.assign(this.hoverContent.style, {
        left: `${contentLeft}px`,
        top: `${contentTop + window.scrollY}px`,
        display: "block",
      });
    }

    connectedCallback() {
      this.hoverTrigger.addEventListener("mouseover", () => {
        this.timerHandle = window.setTimeout(this.onHover, 500);
      });
      this.hoverTrigger.addEventListener("mouseout", (e) => {
        if (this.timerHandle) {
          window.clearTimeout(this.timerHandle);
        }
      });
      this.closeButton.addEventListener("click", () => {
        this.hoverContent.style.display = "none";
      });
    }

    disconnectedCallback() {
      this.hoverTrigger.removeEventListener();
      this.closeButton.removeEventListener();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(
        `Attribute ${name} has changed. oldValue=${oldValue}, newValue=${newValue}`
      );
    }
  }
);
