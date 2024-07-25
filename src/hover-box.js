const template = document.createElement("template");
template.innerHTML = `
  <style>
  :host {
    #hover-content {
      position: absolute;
      height: auto;
      border: solid 1px;
      border-radius: 0px;
      margin-top: 0px 20px 0px 20px;
      padding: 0px;
      z-index: 999999;
      background: white;
      
    } 

    .content-wrapper {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      max-height: 250px; 
      overflow-y: auto;
    }
    
    #hover-trigger {
      width: max-content;
      height: max-content;
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
    
    #close-button {
      color: black;
      background-color: white;
      border: solid 1px;
      position: absolute;
      top: -17px;
      right: -17px;
      border-radius: 50%;
      padding: 0;
      cursor: pointer
    }

    #close-button:hover:after {
      content: ""; 
      position: absolute; 
      inset: -.225em; 
      background: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(255,255,255,1) 100%);
      filter: blur(3px); 
      border-radius: 50%; 
      z-index: -1; 
    }
        
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
        
        <div class="content-wrapper">
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
      this.showHoverBox = this.showHoverBox.bind(this);

      this.attachShadow({ mode: "open" });

      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.hoverTrigger = this.shadowRoot.querySelector("#hover-trigger");
      this.hoverContent = this.shadowRoot.querySelector("#hover-content");
      this.closeButton = this.shadowRoot.querySelector("#close-button");

      this.width = parseInt(this.getAttribute("width") ?? "500");
      this.borderColor = this.getAttribute("borderColor") ?? "#334155";

      this.closeButton.style.borderColor = this.borderColor;

      Object.assign(this.hoverContent.style, {
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

    showHoverBox() {
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
      this.hoverTrigger.addEventListener("click", this.showHoverBox);
      this.closeButton.addEventListener("click", () => {
        this.hoverContent.style.display = "none";
      });
    }

    disconnectedCallback() {
      this.hoverTrigger.removeEventListener();
      this.closeButton.removeEventListener();
    }
  }
);
