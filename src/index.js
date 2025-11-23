import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './style/index.styl';
document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('iframe');
  const menu = document.querySelectorAll('#menu li');
  if (!window.location.hash) {
    iframe.src = menu[0].getAttribute('data-link');
    menu[0].classList.add('active');
    document.title = menu[0].getAttribute('data-title');
  } else {
    iframe.src = window.location.href.replace('#', '') + '.html';
    menu.forEach((element) => {
      if ('#' + element.getAttribute('data-key') === window.location.hash) {
        element.classList.add('active');
        document.title = element.getAttribute('data-title');
      }
    });
  }
  window.addEventListener('hashchange', (e) => {
    iframe.src = e.newURL.replace('#', '') + '.html';
    menu.forEach((element) => {
      element.classList.remove('active');
      if ('#' + element.getAttribute('data-key') === window.location.hash) {
        element.classList.add('active');
        document.title = element.getAttribute('data-title');
      }
    });
    NProgress.start();
    iframe.addEventListener('progress', function (event) {
      console.log(event);
      debugger;
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        console.log('加载进度:', progress + '%');
        NProgress.set(event.loaded / event.total);
      }
    });
    iframe.addEventListener('load', function () {
      NProgress.done();
    });
  });
});
