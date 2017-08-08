'use strict';

ajaxRequest('success');

//AJAX-запрос
function ajaxRequest(getResponce){
  let ajax = new XMLHttpRequest();
  ajax.open('GET', './' + getResponce + '.json', false);
  ajax.send();
  if (ajax.status != 200){
    alert(ajax.status + ': ' + ajax.statusText);
  }
  else{
    alert(ajax.responseText);
  }
}
