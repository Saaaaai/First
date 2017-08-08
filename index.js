'use strict';

function MyForm(){

  function submit(){
    //Включаем ожидание иного статуса
    const jsonData = ajaxRequest('progress');
    const progressTimer = setInterval(function(){
      setResultContainer('resultContainer','progress','');
    }, jsonData.timeout);
    const timeout = jsonData.timeout;

    //Проверка работы таймера Progress
    setTimeout(function(){}, 5000);

    //Получение, валидация и установка данных
    const dataFromForm = getData();
    const dataValidation = validate(dataFromForm);
    setData(dataValidation);

    if(dataValidation.isValid){
      //Блокируем ввод, если валидация успешна
      submitButton.setAttribute('disabled', 'disabled');

      ajaxRequest('success');
      setResultContainer('resultContainer',jsonData.status,jsonData.status);
    }
    else{
      ajaxRequest('error');
      setResultContainer('resultContainer',jsonData.status,jsonData.reason);
    }

    //AJAX-запрос
    function ajaxRequest(getResponce){
      let ajax = new XMLHttpRequest();
      ajax.open('GET', './' + getResponce + '.json', false);
      ajax.send();
      if (ajax.status != 200){
        alert(ajax.status + ': ' + ajax.statusText);
      }
      else{
        return JSON.parse(ajax.responseText);
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
  }

  // Возвращаем объект с признаком результата валидации (isValid)
  // и массивом названий полей, которые не прошли валидацию (errorFields).
  function validate(data){
    const validResult = {
      'isValid': false,
      'errorFields': []
    }
    //Проверяем ФИО
    let wordCounter = 0;
    let words = data.fio.split(/\s/);
    for(let i = 0; i < words.length; i++){
      if(words[i]!=''){
        wordCounter++;
      }
    }
    let fioValid = wordCounter===3 ? true : false;

    //Проверяем Email
    let emailParts = data.email.split('@');
    let emailValid = /ya\.ru$/.test(emailParts[1]);
    emailValid = emailValid || /yandex\.(ru|ua|by|kz|com)$/.test(emailParts[1]);
    //emailValid = emailValid && /[\w-\.]/.test(emailParts[0]);

    //Проверяем Телефон
    let phoneValid = /^\+[\d]{1}\([\d]{3}\)[\d]{3}-[\d]{2}-[\d]{2}$/.test(data.phone);
    if(phoneValid){
      let phoneNumbers = parseInt(data.phone.replace(/\D+/g,''));
      let phoneNumbersArray = String(phoneNumbers).split('');
      let phoneNumbersSum = 0;
      for(let i = 0; i < phoneNumbersArray.length; i++){
        phoneNumbersSum += +phoneNumbersArray[i];
      }
      if(phoneNumbersSum > 30){
        phoneValid = false;
      }
    }

    if(!fioValid){
      validResult.errorFields.push('fio');
    }
    if(!emailValid){
      validResult.errorFields.push('email');
    }
    if(!phoneValid){
      validResult.errorFields.push('phone');
    }

    validResult.isValid = fioValid && emailValid && phoneValid ? true : false;
    return validResult;
  }

  // Получаем объект с данными формы
  function getData(){
    const data = {
      'fio': document.getElementsByName('fio')[0].value,
      'email': document.getElementsByName('email')[0].value,
      'phone': document.getElementsByName('phone')[0].value
    };
    return data;
  }

  // Принимает объект с данными формы и устанавливает их инпутам формы
  function setData(Object){
    document.getElementsByName('fio')[0].className = '';
    document.getElementsByName('email')[0].className = '';
    document.getElementsByName('phone')[0].className = '';
    if(Object.isValid!=true){
      for (var i = 0; i < Object.errorFields.length; i++){
        document.getElementsByName(Object.errorFields[i])[0].className = 'error';
      }
    }
  }

  submitButton.addEventListener('click', submit);
  //document.getElementById('myForm').addEventListener('submit', submit);
  /*const listenerForm = document.getElementById('myForm');
  if(listenerForm.addEventListener){
    listenerForm.addEventListener('submit', submit, false);
  }*/

}

const ajaxActionPath = document.getElementById('myForm').getAttribute('action');
//document.getElementById('myForm').removeAttribute('action');
let form = new MyForm();
