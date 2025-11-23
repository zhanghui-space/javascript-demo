import $ from 'jquery';
import { init, classModule, styleModule, h, eventListenersModule } from 'snabbdom';
import { throttle, get, min } from 'lodash';
import './style/fontawesome.styl';
import './style/loading.styl';
const patch = init([classModule, styleModule, eventListenersModule]);
const ROW_HEIGHT = 120 + 16;
const loading = `
  <div class="loading-container" id="uiball">
    <svg class="loading" viewBox="0 0 35 35" height="35" width="35">
      <rect class="track" x="2.5" y="2.5" fill="none" stroke-width="5px" width="32.5" height="32.5" />
      <rect class="car" x="2.5" y="2.5" fill="none" stroke-width="5px" width="32.5" height="32.5" pathlength="100" />
    </svg>
  </div>`;
$(() => {
  class Fontawesome {
    constructor() {
      this.dom = {
        wrapper: $('#wrapper'),
        virtual: $('#virtual'),
        visual: $('#icons-results'),
      };
      this.data = [];
      this.column = 0;
      this.init();
    }
    async init() {
      try {
        const icons = await this.queryHits();
        this.data = icons;
        this.setContentHeight(icons.length);
        this.renderIcons(icons);
        this.dom.wrapper.off('scroll').on('scroll', throttle(this.handleScroll.bind(this), 300));
      } catch (error) {
        console.log(error);
      }
    }
    renderIcons(data) {
      const container = document.getElementById('icons-results');
      const vnode = this.createVnode(data.slice(0, 100));
      this.vnode = h(`div#icons-results.icon-listing.visual-view`, vnode);
      patch(container, this.vnode);
    }
    handleScroll(e) {
      const startIndex = Math.floor(e.target.scrollTop / ROW_HEIGHT);

      const startRow = Math.floor(e.target.scrollTop / ROW_HEIGHT);
      const endRow = startRow + Math.floor(this.dom.wrapper.height() / ROW_HEIGHT);
      const startRowHeight = (startRow + 1) * ROW_HEIGHT;
      this.startRowOffset = e.target.scrollTop - (startRowHeight - ROW_HEIGHT);

      const endIndex = startIndex + Math.floor(this.dom.wrapper.height() / ROW_HEIGHT);
      console.log('endIndex', startIndex, endIndex);
      const container = document.getElementById('icons-results');
      $(container).css('transform', 'translateY(' + (e.target.scrollTop - this.startRowOffset) + 'px)');
      let vnode = this.createVnode(this.data.slice(startIndex * this.column, (endIndex + 1) * this.column));
      vnode = h(`div#icons-results.icon-listing.visual-view`, vnode);

      patch(this.vnode, vnode);
      this.vnode = vnode;
    }
    setContentHeight(count) {
      const gridContainer = document.getElementById('icons-results');
      const computedStyle = window.getComputedStyle(gridContainer);
      const containerWidth = parseFloat(computedStyle.width);
      const gridGap = parseFloat(computedStyle.getPropertyValue('grid-gap').split(' ')[0]);
      let minColumnWidth = computedStyle.getPropertyValue('grid-template-columns').match(/(\d+\.\d+|\d+)px/g);
      minColumnWidth = min(minColumnWidth.map(parseFloat));
      this.column = Math.floor((containerWidth + gridGap) / (minColumnWidth + gridGap));
      const rows = count / this.column;
      this.dom.virtual.height(rows * ROW_HEIGHT);
    }

    createVnode(data) {
      const vnode = data.map((item) => {
        return h(
          'article.icon-wrap',
          {
            on: {
              click: () => {
                document.getElementById('dialog').showModal();
              },
            },
          },
          [
            h('button.icon-button', null, [
              h('span', { style: { color: 'var(--fa-navy)' } }, [h(`i.iconfont.fa-${item.style}.fa-${item.family}.fa-${item.name}`)]),
              h('span.icon-label', null, `${item.label}`),
            ]),
            h('span.icon-unicode', null, `${item.unicode}`),
          ],
        );
      });
      return vnode;
    }
    queryHits() {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'GET',
          url: 'http://localhost:8080/apis/fontawesome-v6/queries',
          beforeSend: () => {
            $('body').append(loading);
          },
          success: function (res) {
            const icons = get(res, 'results[0].hits', []);
            resolve(icons);
          },
          error: function (xhr, textStatus, errorThrown) {
            reject({ xhr, textStatus, errorThrown });
          },
          complete: function (e) {
            $('#uiball').hide(300);
          },
        });
      });
    }
  }
  new Fontawesome();
  document.body.addEventListener('click', (e) => {
    console.log(e);
    // e.target.classList.add('layer-anim-close');
    // if (e.target === document.getElementById('dialog')) {
    //   e.target.classList.add('layer-anim-close');
    //   setTimeout(() => {
    //     document.getElementById('dialog').close();
    //   }, 3000);
    // }
  });
});
