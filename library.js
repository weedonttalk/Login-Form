(function(){
  function WriteName(username, outputElement, options){
    const opts = Object.assign({ delayMs: 120 }, options || {});
    const chars = Array.from(String(username || ""));
    outputElement.textContent = ""; // одна строка
    let i = 0;
    function tick(){
      if(i >= chars.length) return;
      outputElement.textContent += chars[i];
      i++;
      setTimeout(tick, opts.delayMs);
    }
    tick();
  }
  window.WriteName = WriteName;
})();