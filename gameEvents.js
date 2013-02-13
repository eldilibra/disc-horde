var draggable = document.getElementsByClassName('draggable')[0];

draggable.addEventListener('playerHit', function () {
  draggable.health--;
  if (draggable.health <= 0 && !document.getElementsByClassName('game-over').length) {
    var gameOver = document.createElement('div');
    gameOver.className = 'game-over';
    gameOver.innerHTML = 'GAME OVER';
    document.body.appendChild(gameOver);
    draggable.parentNode.removeChild(draggable);
  }
});

document.addEventListener('enemyHit', function (event) {
  var enemy = event.detail.enemy;
  var index = event.detail.index;
  enemy.health--;
  if (enemy.health <= 0) {
    centerPoints.splice(index);
    enemy.parentNode.removeChild(enemy);
    console.log('BOOM! Removed', enemy)
  }
});

//var enemyHit = document.createEvent('CustomEvent');
//enemyHit.initCustomEvent('enemyHit', true, true, { enemy: enemy, index: index });
//document.dispatchEvent(enemyHit);
