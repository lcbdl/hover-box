const template = document.createElement('template');
template.innerHTML = `
  <style>
    .box {
      position: absolute;
      height: auto;
      border: solid 2px var(--border-color);
      border-radius: 10px;
      margin-top: 0px;
      padding: 20px;
      z-index: 999999;
    } 
  </style>

  <div class='hover-box'>
    <span id='hover-trigger'>
      <slot name="hover-trigger"/>
    </span>
    <div id='hover-content' class='box' style="visibility:hidden">
      <slot name="hover-content" />
    </div>
  </div>
`;

customElements.define(
  'hover-box',
  class HoverBox extends HTMLElement {
    onHover() {
      this.hoverContent.style.width = this.width + "px";
      this.hoverContent.style.color = this.color;
      this.hoverContent.style.background = this.backgroundColor;
      this.hoverContent.style.borderColor = this.borderColor;

      const contentWidth = this.hoverContent.getBoundingClientRect().width;
      const contentHeight = this.hoverContent.getBoundingClientRect().height;

      const rect = this.hoverTrigger.getBoundingClientRect();
      const triggerTop = rect.top + window.scrollY;
      const triggerLeft = rect.left + window.scrollX;
      // const triggerBottom = rect.right + window.scrollX
      const triggerRight = rect.right + window.scrollX
      const triggerBottom = rect.bottom + window.scrollY
      const triggerHeight = rect.height;
      const triggerWidth = rect.width;

      const halfWinWidth = window.innerWidth / 2;
      const halfWinHeight = window.innerHeight / 2;
      

      if (triggerLeft + triggerWidth / 2 <= halfWinWidth) {
        this.hoverContent.style.left = (triggerLeft + triggerWidth) + 'px';
      } else {
        this.hoverContent.style.left = (triggerLeft - this.width -45) + 'px';
      }
      
      this.hoverContent.style.top = triggerTop + 'px';
      
      

      this.hoverContent.style.visibility='visible';
    }

    constructor() {
      super();
      this.onHover = this.onHover.bind(this);
      this.timerHandle = undefined;

      this.attachShadow({ mode: 'open' });

      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.hoverTrigger = this.shadowRoot.querySelector('#hover-trigger');
      this.hoverContent = this.shadowRoot.querySelector('#hover-content');

      this.width = parseInt(this.getAttribute('width') ?? '500');
      this.color = this.getAttribute('color') ?? 'balck';
      this.backgroundColor = this.getAttribute('backgroundColor') ?? 'white';
      this.borderColor = this.getAttribute('borderColor') ?? '334155';
    }

    connectedCallback() {
      this.hoverTrigger.addEventListener('mouseover', () => {
           this.timerHandle = window.setTimeout(this.onHover, 500);
      });
      this.hoverTrigger.addEventListener('mouseout', (e) => {
        if (this.timerHandle) {
          window.clearTimeout(this.timerHandle);
        }
        // this.hoverContent.style.visibility = 'hidden';
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
