var draggable = document.getElementsByClassName('draggable')[0];
draggable.health = 10;
var playerHit = document.createEvent('CustomEvent');
playerHit.initCustomEvent('playerHit', true, true);
var mouseDown = [];
var mouseOffsetX = [];
var mouseOffsetY = [];
var centerPoints = [];

draggable.onmousedown = function() {
  var event = window.event;
  event.preventDefault();
  var element = event.srcElement;
  var index = parseInt(event.srcElement.id);
  mouseOffsetX[index] = event.offsetX;
  mouseOffsetY[index] = event.offsetY;
  mouseDown[index] = true;
  element.className += ' dragged';
};

draggable.onmouseup = function() {
  var event = window.event;
  event.preventDefault();
  var element = event.srcElement;
  var index = parseInt(event.srcElement.id);
  mouseDown[index] = false;
  element.className = 'draggable';
};

draggable.addEventListener('mousemove', function(event) {
  var index = parseInt(event.srcElement.id);
  if (mouseDown[index]) {
    var element = event.srcElement;
    element.startX = element.offsetLeft;
    element.startY = element.offsetTop;
    element.borderWidth = parseInt(removePx(getStyle(element, 'border-width')));
    element.height = parseInt(removePx(getStyle(element, 'height'))) + 2 * element.borderWidth;
    element.width = parseInt(removePx(getStyle(element, 'width'))) + 2 * element.borderWidth;
    event.preventDefault();
    var index = parseInt(element.id);
    var newTranslateX = event.clientX - element.startX - mouseOffsetX[index];
    var newTranslateY = event.clientY - element.startY - mouseOffsetY[index];
    centerPoints[index] = { x: (element.startX + newTranslateX + element.width * 0.5), y: (element.startY + newTranslateY + element.height * 0.5) };
    var collision = false;
    for (cp in centerPoints) {
      if (cp == index) continue;
      var thisCenterPoint = centerPoints[index];
      var curCenterPoint = centerPoints[cp];
      var distBetween = Math.sqrt(Math.pow(thisCenterPoint.x - curCenterPoint.x, 2) + Math.pow(thisCenterPoint.y - curCenterPoint.y, 2));
      var collisionDist = element.height;
      if (distBetween < collisionDist) {
        collision = true;
        draggable.dispatchEvent(playerHit);
        document.body.style.backgroundColor = '#f00';
        setTimeout(function() { document.body.style.backgroundColor = ''; }, 300);
        break;
      }
      document.body.style.backgroundColor = '';
    }
    if (!collision) {
      element.style.webkitTransform = 'translate(' + newTranslateX + 'px, ' + newTranslateY + 'px)';
    }
  }
});

draggable.addEventListener('mouseout', function(event) {
  var element = event.srcElement;
  element.onmouseup();
});

function checkHorizontalPosition (region, index, draggableX) {
  if (centerPoints[index].x < (draggableX - 100)) {
    region += 'Left';
  } else if (centerPoints[index].x > draggableX) {
    region += 'Right';
  } else {
    region += 'Middle';
  }
  return region;
}

function checkPositionRegion (index, draggableX, draggableY) {
  var region = '';
  if (centerPoints[index].y < draggableY) {
    region = 'top';
    return checkHorizontalPosition(region, index, draggableX);
  } else if (centerPoints[index].y > (draggableY + draggable.height)) {
    region = 'bottom';
    return checkHorizontalPosition(region, index, draggableX);
  } else {
    if (centerPoints[index].x <= (draggableX - 100)) {
      return 'leftMiddle';
    } else if (centerPoints[index].x >= (draggableX)){
      return 'rightMiddle';
    }
  }
}

draggable.attack = function () {
  enemies = document.getElementsByClassName('enemy');
  console.log(enemies);
  console.log(centerPoints);
  var draggableTranslate = getTranslate2D(draggable);
  var draggableTranslateX = parseInt(removePx(draggableTranslate.translateX));
  var draggableTranslateY = parseInt(removePx(draggableTranslate.translateY));
  var draggableX = draggable.startX + draggableTranslateX;
  var draggableY = draggable.startY + draggableTranslateY;

  for (e in enemies) {
    var enemy = enemies[e];
    if (typeof enemy != 'object') continue;
    var index = parseInt(enemy.id);
    console.log(index);
    var enemyTranslate = getTranslate2D(enemy);
    var enemyTranslateX = parseInt(removePx(enemyTranslate.translateX));
    var enemyTranslateY = parseInt(removePx(enemyTranslate.translateY));
    var enemyPositionX = enemy.startX + enemyTranslateX;
    var enemyPositionY = enemy.startY + enemyTranslateY;
    var enemyCenterPoint = centerPoints[index];
    var region = checkPositionRegion(index, draggableX, draggableY);
    console.log(region);
    if (region.indexOf('iddle') > -1) {
      var xDistBetween = Math.abs(enemyCenterPoint.x - (draggableX - 50));
      var yDistBetween = Math.abs(enemyCenterPoint.y - (draggableY + 45));
      if (xDistBetween < (enemy.width/2 + 50) && yDistBetween < (enemy.height/2 + 45)) {
        collision = true;
        var enemyHit = document.createEvent('CustomEvent');
        enemyHit.initCustomEvent('enemyHit', true, true, { enemy: enemy, index: index });
        document.dispatchEvent(enemyHit);
      }
    } else {
      var distBetween = Math.sqrt(Math.pow((draggableX - 100) - enemyCenterPoint.x, 2) + Math.pow((draggableY - 90) - enemyCenterPoint.y, 2));
      var collisionDist = draggable.height/2;
      if (distBetween < collisionDist) {
        collision = true;
        var enemyHit = document.createEvent('CustomEvent');
        enemyHit.initCustomEvent('enemyHit', true, true, { enemy: enemy, index: index });
        document.dispatchEvent(enemyHit);
      }
    }
  }
  var blast = document.createElement('div');
  blast.className = 'blast';
  this.appendChild(blast);
  setTimeout(function () { blast.style.webkitTransform = 'translate(-100px, 0px)'; }, 1);
  setTimeout(function () { draggable.removeChild(blast); }, 200);
};

document.addEventListener('keydown', function(event) {
  if (event.keyCode == '32' && !draggable.children.length && draggable.className.indexOf('dragged') < 0) {
    event.preventDefault();
    draggable.attack();
  }
});
