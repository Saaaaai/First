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
    setResultContainer('resultContainer',ajax.responseText.status,ajax.responseText.status);
  }
}

//Обновление содержимого ResultContainer
function setResultContainer(elementId, setClass, setText){
  const container = document.getElementById(elementId);
  while (container.firstChild){
    container.removeChild(container.firstChild);
  }
  container.insertAdjacentHTML( 'beforeend', setText);
  container.className = setClass;
}
