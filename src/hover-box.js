const template = document.createElement("template");
template.innerHTML = `
  <style>
    .box {
      position: absolute;
      height: auto;
      border: solid 2px;
      border-radius: 10px;
      margin-top: 0px;
      padding: 20px;
      z-index: 999999;
    } 
    
    #hover-trigger {
      width: max-content;
      height: max-content;
    }
  </style>

  <div class='hover-box'>
    <div id='hover-trigger'>
      <slot name='hover-trigger'/>
    </div>
    <div id='hover-content' class='box' style='display:none'>
      <slot name='hover-content' />
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
      const triggerTop = rect.top; // + window.scrollY;
      const triggerLeft = rect.left; //  + window.scrollX;
      const triggerBottom = rect.bottom; // + window.scrollY;
      const triggerRight = rect.right; // + window.scrollX;

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
        this.hoverContent.style.display = "none";
      });
    }

    disconnectedCallback() {
      this.hoverTrigger.removeEventListener();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(
        `Attribute ${name} has changed. oldValue=${oldValue}, newValue=${newValue}`
      );
    }
  }
);
