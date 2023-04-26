var moduleTransformColornarnia = (function () {
  var module = 'transform-colornarnia';

  // $("#tab_" + module).load('modules/' + module + '/index.html', () => {});

  function handleTransformColornarnia() {
    let text = $('.js-transform-colornarnia-text').val();
    let transformedText = text.replace(/\\/g, '/')
      .replace(/ /g, '%20')
      .slice(2);
    let output = `![AltText](../../../..${transformedText} "${text}")`;

    $('.js-transform-colornarnia-result').text(output);
  }

  $(document)
    .on('click', '.js-btn-transform-colornarnia', handleTransformColornarnia)
    .on('input', '.js-transform-colornarnia-text', handleTransformColornarnia);
})();
