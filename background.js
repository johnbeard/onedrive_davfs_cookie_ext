"use strict";

/*
 Make a davfs.conf entry for the cookies given
*/
function construct_davfsconf_str(cookies) {
  var s = "add_header Cookie ";

  var cookie_pairs = []

  for (var i = 0; i < cookies.length; ++i) {
    cookie_pairs.push(cookies[i].name + "=" + cookies[i].value);
  }

  s += cookie_pairs.join(";")

  return s;
}

function send_to_content(tab, str) {

  var data = {
    davfsconf_str: str
  };

  var sending = browser.tabs.sendMessage(tab.id, data);
}

/*
Get cookies from the tab
*/
function getCookies(tab) {

  var url = new URL(tab.url)
  console.log("Getting cookies for: " + url.hostname);

  var cookie_url = url.protocol + url.hostname;

  var cookies = [
    {
        url: cookie_url,
        name: "FedAuth"
    },
    {
        url: cookie_url,
        name: "rtFa"
    },
  ];

  var promises = [];

  for (var i = 0; i < cookies.length; ++i) {
    promises.push(browser.cookies.get(cookies[i]));
  }

  Promise.all(promises).then(function(cookies){

    var str = construct_davfsconf_str(cookies);

    console.log("Cookie line: " + str);

    send_to_content(tab, str);
  });
}

/*
Get cookies when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(getCookies);