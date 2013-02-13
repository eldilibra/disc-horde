var enemies = document.getElementsByClassName('enemy');
for (e in enemies) {
  if (isNaN(parseInt(e))) continue;
  var enemy = enemies[e];
  enemy.borderWidth = parseInt(removePx(getStyle(enemy, 'border-width')));
  enemy.height = parseInt(removePx(getStyle(enemy, 'height'))) + 2 * enemy.borderWidth;
  enemy.width = parseInt(removePx(getStyle(enemy, 'width'))) + 2 * enemy.borderWidth;
  enemy.startX = enemy.offsetLeft;
  enemy.startY = enemy.offsetTop;
  enemy.style.webkitTransform = 'translate(' + (window.innerWidth/2 - enemy.width) + 'px, 0px)';
  enemy.health = 4;
}

function randomMovement() {
  enemies = document.getElementsByClassName('enemy');
  for (curEnemy in enemies) {
    if (curEnemy == 'length') break;
    var pole = Math.floor(Math.random()*2);
    var randX = pole ? Math.floor(Math.random()*50) :  -1 * Math.floor(Math.random()*50);
    pole = Math.floor(Math.random()*2);
    var randY = pole ? Math.floor(Math.random()*50) :  -1 * Math.floor(Math.random()*50);
    var enemy = enemies[curEnemy];
    var curTranslate = getTranslate2D(enemy);
    var curTranslateX = parseInt(removePx(curTranslate.translateX));
    var curTranslateY = parseInt(removePx(curTranslate.translateY));
    var index = parseInt(enemy.id);
    var newTranslateX = (curTranslateX + randX);
    var newTranslateY = (curTranslateY + randY);
    centerPoints[index] = { x: (enemy.startX + newTranslateX + enemy.width * 0.5), y: (enemy.startY + newTranslateY + enemy.height * 0.5) };
    var collision = false;
    for (cp in centerPoints) {
      if (cp == index) continue;
      var thisCenterPoint = centerPoints[index];
      var curCenterPoint = centerPoints[cp];
      var distBetween = Math.sqrt(Math.pow(thisCenterPoint.x - curCenterPoint.x, 2) + Math.pow(thisCenterPoint.y - curCenterPoint.y, 2));
      var collisionDist = enemy.height;
      if (distBetween < collisionDist) {
        if (cp != 0) {
          collision = true;
        }
        break;
      }
    }
    if ((enemy.startX + newTranslateX < window.innerWidth - enemy.width) && (enemy.startY + newTranslateY < window.innerHeight - enemy.height)) {
      if ((enemy.startX + newTranslateX > 0) && (enemy.startY + newTranslateY > 0) && !collision) {
        enemy.style.webkitTransform = 'translate(' + newTranslateX + 'px, ' + newTranslateY + 'px)';
      }
    }
  }
}

setInterval(randomMovement, 800);
