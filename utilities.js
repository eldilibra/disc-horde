/*******************UTILITY FUNCTIONS*********************************/
function removePx (positionString) {
  return positionString.substring(0, positionString.length - 2);
}

function getStyle(oElm, strCssRule) {
  var strValue = '';
  if(document.defaultView && document.defaultView.getComputedStyle){
    strValue = document.defaultView.getComputedStyle(oElm, '').getPropertyValue(strCssRule);
  }
  else if(oElm.currentStyle){
    strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
      return p1.toUpperCase();
    });
    strValue = oElm.currentStyle[strCssRule];
  }
  return strValue;
}

function getTranslate2D(element) {
  var raw = element.style.webkitTransform;
  if (raw === '') {
    return { translateX: '0px', translateY: '0px' };
  }
  if (raw.indexOf('translate') !== 0) {
    return new Error('This is not a purely translated element');
  }
  var split = raw.split(' ');
  var cleanX = split[0].substring(10);
  var cleanY = split[1].substring(0, split[1].length-1);
  return { translateX: cleanX, translateY: cleanY };
}
/**********************************************************************/
