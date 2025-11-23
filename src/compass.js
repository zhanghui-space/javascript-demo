document.addEventListener('DOMContentLoaded', () => {
  const rotate = document.getElementById('rotate');
  const plus = document.getElementById('plus');
  const minus = document.getElementById('minus');
  let deg = 0;
  plus.addEventListener('click', () => {
    deg += 10;
    rotate.setAttribute('transform', `rotate(${deg},73,105)`);
  });
  minus.addEventListener('click', () => {
    deg -= 10;
    rotate.setAttribute('transform', `rotate(${deg},73,105)`);
  });
});
