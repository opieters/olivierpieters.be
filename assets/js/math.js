fix_html_content = function(html) {
    return html.replace(/&amp;/g, "&").replace(/&gt;/g, ">")
}

window.onload = function() {
    var tex = document.getElementsByClassName("math");
    Array.prototype.forEach.call(tex, function(el) {
        katex.render(fix_html_content(el.innerHTML), el, {displayMode: true});
    });
    var tex_inline = document.getElementsByClassName("inline_math");
    Array.prototype.forEach.call(tex_inline, function(el) {
        katex.render(fix_html_content(el.innerHTML), el);
    });
};
