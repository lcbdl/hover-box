import { computePosition, flip, offset, shift, arrow } from 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.7/+esm';

const template = document.createElement('template');
template.innerHTML = `
  <style>

    #tooltip {
      display: none;
      width: max-content;
      position: absolute;
      top: 0;
      left: 0;
      font-weight: bold;
      padding: 5px;
      border-radius: 4px;
    }

    #hover-trigger {
      width: max-content;
      height: max-content;
    }

    #arrow {
      position: absolute;
      background: #222;
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
    }
  </style>

  <div class='hover-box'>
    <div id='hover-trigger'>
      <slot name="hover-trigger"/>
    </div>
    <div id="tooltip" role="tooltip">
      <slot name="tooltip">
      <div id="arrow"></div>
    </div>
  </div>
`;

customElements.define(
  'hover-box',
  class HoverBox extends HTMLElement {
    constructor() {
      super();
      // bind functions
      this.update = this.update.bind(this);
      this.showTooltip = this.showTooltip.bind(this);
      this.hideTooltip = this.hideTooltip.bind(this);

      this.attachShadow({ mode: 'open' });

      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.hoverTrigger = this.shadowRoot.querySelector('#hover-trigger');
      this.tooltip = this.shadowRoot.querySelector('#tooltip');
      this.arrowElement = this.shadowRoot.querySelector('#arrow');

      this.color = this.getAttribute('color') ?? 'balck';
      this.backgroundColor = this.getAttribute('backgroundColor') ?? 'white';
      this.borderColor = this.getAttribute('borderColor') ?? '334155';

      Object.assign(this.tooltip.style, {
        color: this.color,
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor
      })
    }

    update() {
      computePosition(this.hoverTrigger, this.tooltip, {
        placement: 'top',
        middleware: [offset(6), flip(), shift({ padding: 5 }), arrow({ element: this.arrowElement })],
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(this.tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        // Accessing the data
        const { x: arrowX, y: arrowY } = middlewareData.arrow;

        const staticSide = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]];

        Object.assign(this.arrowElement.style, {
          left: !!arrowX ? `${arrowX}px` : '',
          top: !!arrowY ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-4px',
        });
      });
    }

    getFirstChild(el){
      var firstChild = el.firstChild;
      while(firstChild != null && firstChild.nodeType == 3){ // skip TextNodes
        firstChild = firstChild.nextSibling;
      }
      return firstChild;
    }

    showTooltip() {
      this.tooltip.style.display = 'block';
      this.update();
    }

    hideTooltip() {
      this.tooltip.style.display = '';
    }

    connectedCallback() {
      [
        ['mouseenter', this.showTooltip],
        ['mouseleave', this.hideTooltip],
        ['focus', this.showTooltip],
        ['blur', this.hideTooltip],
      ].forEach(([event, listener]) => {
        this.hoverTrigger.addEventListener(event, listener);
      });
    }

    disconnectedCallback() {
      this.hoverTrigger.removeEventListener();
    }
  }
);
