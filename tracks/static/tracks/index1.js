document.addEventListener('DOMContentLoaded', () => {

    var login = document.createElement('button');
    var modal = document.getElementById("myModals");
    console.log(modal);
    var span = document.getElementsByClassName("closes")[0];

    var register = document.querySelector('#register-form');
    register.style.display = 'none';

    document.querySelector('#register').onclick = () => {
        register.style.display = 'block';
        document.querySelector('#login_forms').style.display = 'none';
        ///document.querySelector('.hr-sect').style.display = 'none';
    };

    document.querySelector('#login').onclick = () => {
        register.style.display = 'none';
        document.querySelector('#login_forms').style.display = 'block';
    }

    login.onclick = () => 
    {
        modal.style.display = 'block';
    }
    login.click();
    span.onclick = function() {
        modal.style.display = "none";
      }

})