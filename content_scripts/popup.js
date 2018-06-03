"use strict";

/*
 Copy a string to the clipboard
 Only works from e.g. click handlers

 Restores previous selection if there was one

 https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
 */
function copy_to_clipboard(str) {

  const el = document.createElement('textarea');
  document.body.appendChild(el);

  // existing selection?
  const selected = document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;

  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  // restore old selection
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

function make_code_span(code) {
    var span = document.createElement('span');
    span.className = "davfs_config_code";

    span.append(code);
    return span
}

function make_div(className, id) {
    var div = document.createElement('div');

    if (className) {
        div.className = className;
    }

    if (id) {
        div.id = id;
    }

    return div;
}

function make_button(text, className, callback) {
    var btn = document.createElement('button');
    btn.append(text);
    btn.className = className;
    btn.onclick = callback;

    return btn;
}

function close_popup() {
    var div = document.getElementById('davfs_config_popup');

    if (div) {
        div.parentNode.removeChild(div);
    }
}

function create_display_area() {

    close_popup();

    // re-create
    var div = make_div('davfs_config_popup', 'davfs_config_popup');

    div.addEventListener('click', function(event) {
        // don't let it close the div
        event.stopPropagation()
    });

    document.getElementsByTagName('body')[0].appendChild(div);
}

function fill_display_area(cfg_str) {

    var file_span = make_code_span("/etc/davfs/davfs.conf");

    var top_div = make_div();

    top_div.append("Add the following to your ");
    top_div.append(file_span);
    top_div.append(" file:");

    var line_div =make_div('davfs_config_data');
    line_div.append(make_code_span(cfg_str));

    var copy_btn = make_button("Copy to Clipboard", 
        'davfs_config_copy_btn', function() {
            copy_to_clipboard(cfg_str);
    });

    var btn_div = make_div("davfs_config_centred");
    btn_div.append(copy_btn);

    var div = document.getElementById('davfs_config_popup');
    div.append(top_div);
    div.append(line_div);
    div.append(btn_div);
}

// registoer for incoming messages
browser.runtime.onMessage.addListener(request => {
  console.log("Message from the background script:");
  console.log(request.davfsconf_str);

  create_display_area();

  fill_display_area(request.davfsconf_str);
});

document.onclick = function() {
    close_popup();
}