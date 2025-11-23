import anime from 'animejs/lib/anime.es.js';
import { computePosition, offset, arrow, shift } from '@floating-ui/dom';

class SeamlessScroll {
  constructor(container, {}) {
    this.container = typeof container === 'string' ? document.querySelectorAll(container) : container;
    this.content = this.container.querySelector('#content');
    this.animation = null;
    this.init();
  }

  init() {
    this.animeScroll();
    this.bindEvent();
  }
  animeScroll() {
    if (this.content.clientHeight < this.container.clientHeight) {
      return;
    }
    this.animation = anime({
      targets: this.content,
      translateY: -this.content.clientHeight,
      loop: true,
      easing: 'linear',
      duration: 20 * 1000,
    });
    this.cloneElement();
  }
  cloneElement() {
    const childNodes = this.content.cloneNode(true).childNodes;
    const nodes = Array.from(childNodes); // 创建副本
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 1) {
        nodes[i].classList.add('clone-item');
        fragment.appendChild(nodes[i]);
      }
    }
    this.content.appendChild(fragment);
  }
  bindEvent() {
    this.container.addEventListener('mouseenter', () => {
      this.animation?.pause();
    });
    this.container.addEventListener('mouseleave', () => {
      const floatingEl = document.getElementById('floating');
      if (floatingEl.style.display !== 'block') {
        this.animation?.play();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const containerEl = document.getElementById('container');
  const closeButtonEl = document.getElementById('close');

  const instance = new SeamlessScroll(containerEl, {});
  console.log(instance);
  containerEl.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    if (index == null) return;
    showPopover(e.target);
  });
  closeButtonEl.addEventListener('click', (e) => {
    instance.animation?.play();
    hidePopover();
  });
});

function updatePopover(boundingClientRect) {
  const virtualEl = {
    getBoundingClientRect() {
      return boundingClientRect;
    },
  };
  const floatingEl = document.getElementById('floating');
  const arrowEl = document.getElementById('arrow');
  computePosition(virtualEl, floatingEl, {
    placement: 'right',
    middleware: [
      offset(40),
      shift({
        boundary:  document.getElementById('container'),
      }),
      arrow({ element: arrowEl }),

    ],
  }).then(({ x, y, middlewareData }) => {
    Object.assign(floatingEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
    if (middlewareData.arrow) {
      const { x, y } = middlewareData.arrow;
      Object.assign(arrowEl.style, {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
      });
    }
  });
}
function showPopover(el) {
  const floatingEl = document.getElementById('floating');
  floatingEl.style.display = 'block';
  updatePopover(el.getBoundingClientRect());
  anime({
    targets: floatingEl,
    opacity: [0, 1],
    translateX: [20, 0],
    duration: 300,
    easing: 'easeOutQuad',
    complete: () => {},
  });
}
function hidePopover(callback) {
  const floatingEl = document.getElementById('floating');

  anime({
    targets: floatingEl,
    opacity: [1, 0],
    translateX: [0, 20],
    duration: 300,
    easing: 'easeInQuad',
    delay: 0,
    complete: (e) => {
      floatingEl.style.display = 'none';
      callback && callback(e);
    },
  });
}
