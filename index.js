/* eslint-env browser */
'use strict';

class MyForm {

  /**
  * Создает экземпляр MyForm.
  * Инициирует ожидание события Submit
  *
  * @constructor
  * @this  {myForm}
  * @param {object} form - Форма
  * @param {object} resultContainer - Div для результата
  */
  constructor(form, resultContainer) {
    this.resultContainer = resultContainer;
    this.form = form;
    this.form.submitButton.addEventListener('click', (event) => {
      this.submit(event);
    });
  }

  /**
  * Обработчик события Submit
  *
  * @param {object} dataFromForm - Данные из формы
  * @param {object} dataValidation - Данные, результат проверки ввода
  */
  submit(event) {
    event.preventDefault(this);
    // Получение, валидация и установка данных
    const dataFromForm = this.getData();
    const dataValidation = this.validate(dataFromForm);
    this.setInputClass(dataValidation);

    if (dataValidation.isValid) {
      this.form.submitButton.setAttribute('disabled', 'disabled');
      ajaxRequest(this.form.getAttribute('action'), (error, jsonData) => {
        if (error) {
          console.error(error);
        } else {
          switch (jsonData.status) {
          case 'success':
            setResultContainer(this.resultContainer, jsonData.status, jsonData.status);
            break;
          case 'error':
            setResultContainer(this.resultContainer, jsonData.status, jsonData.reason);
            break;
          case 'progress':
            setResultContainer(this.resultContainer, jsonData.status, jsonData.status);
            setTimeout(function() {
              this.submit(event);
            }.bind(this), jsonData.timeout);
            break;
          default:
            console.error('Unknown "status" value');
          }
        }
      });
    }

    /**
    * AJAX-запрос
    *
    * @param {object} ajax - Hовый объект XMLHttpRequest
    * @param {object} responseText - Результат обработки запроса
    * @callback
    */
    function ajaxRequest(address, callback) {
      let ajax = new XMLHttpRequest();
      ajax.open('GET', address, true);
      ajax.send();
      ajax.onreadystatechange = function () {
        if (ajax.readyState !== 4) {
          return;
        }
        if (ajax.status !== 200) {
          callback({
            code: ajax.status,
            message: ajax.statusText
          });
        } else {
          const responseText = JSON.parse(ajax.responseText);
          callback(null, responseText);
        }
      };
    }

    /**
    * Обновление содержимого ResultContainer
    */
    function setResultContainer(container, className, content) {
      container.innerHTML = content;
      container.className = className;
    }
  }

  /**
  * Проверка данных ввода
  * Возвращает объект с признаком результата валидации (isValid)
  * и массивом названий полей, которые не прошли валидацию (errorFields).
  *
  * @param {object} validResult - результат валидации
  * @param {array} words - массив слов ФИО
  * @param {boolean} fioValid - признак валидации ФИО
  * @param {string} eMailUserName - первая часть Email
  * @param {string} eMailDomainName - вторая часть Email
  * @param {boolean} emailValid - признак валидации Email
  * @param {number} phoneNumbers - число, номер телефона без вспомогательных символов
  * @param {array} phoneNumbersArray - массив цифр номера телефона
  * @param {string} phoneNumbersSum - сумма цифр номера телефона
  * @param {boolean} fioValid - признак валидации номера телефона
  * @return {object}
  */
  validate(data) {
    const validResult = {
      'isValid': false,
      'errorFields': []
    };
    // Проверяем ФИО отфильтровывая пустые элементы массива
    const words = data.fio.split(/\s/).filter(function(e) {
      return e;
    });
    const fioValid = words.length === 3;

    // Проверяем Email
    const [eMailUserName, eMailDomainName] = data.email.split('@');
    let emailValid = /ya\.ru$/.test(eMailDomainName);
    emailValid = emailValid || /yandex\.(ru|ua|by|kz|com)$/.test(eMailDomainName);
    emailValid = emailValid && eMailUserName !== '';
    // emailValid = emailValid && /[\w-\.]/.test(eMailUserName);

    // Проверяем Телефон
    let phoneValid = /^\+\d{1}\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(data.phone);
    if (phoneValid) {
      const phoneNumbers = parseInt(data.phone.replace(/\D+/g, ''));
      const phoneNumbersArray = String(phoneNumbers).split('');
      const phoneNumbersSum = phoneNumbersArray.reduce((a,b) => Number(a) + (Number(b)), 0);
      phoneValid = phoneNumbersSum <= 30;
    }

    if (!fioValid) {
      validResult.errorFields.push('fio');
    }
    if (!emailValid) {
      validResult.errorFields.push('email');
    }
    if (!phoneValid) {
      validResult.errorFields.push('phone');
    }

    validResult.isValid = fioValid && emailValid && phoneValid;
    return validResult;
  }

  /**
  * Получает объект с данными формы
  *
  * @param {object} data - объект с данными формы
  * @return {object}
  */
  getData() {
    const data = {
      'fio': this.form.querySelector('[name = fio]').value,
      'email': this.form.querySelector('[name = email]').value,
      'phone': this.form.querySelector('[name = phone]').value
    };
    return data;
  }

  /**
  * Принимает объект с данными формы (data) и устанавливает их инпутам формы
  */
  setData(data) {
    this.form.querySelector('[name = fio]').value = data.fio;
    this.form.querySelector('[name = email]').value = data.email;
    this.form.querySelector('[name = phone]').value = data.phone;
  }

  /**
  * Переопределяет класс Error инпутам с некорректным вводом исходя из данных
  * полученного объекта (Object)
  */
  setInputClass(Object) {
    this.form.querySelector('[name = fio]').classList.remove('error');
    this.form.querySelector('[name = email]').classList.remove('error');
    this.form.querySelector('[name = phone]').classList.remove('error');
    if (Object.isValid !== true) {
      for (const i in Object.errorFields) {
        this.form.querySelector('[name = ' + Object.errorFields[i] + ']').classList.add('error');
      }
    }
  }
}

/**
* При завершении постройки DOM-дерева, создаёт новый экземпляр класса MyForm
*/
document.addEventListener('DOMContentLoaded', function() {
  window.myForm = new MyForm(
    document.getElementById('myForm'),
    document.getElementById('resultContainer')
  );
});
