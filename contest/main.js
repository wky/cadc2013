loginUrl = 'http://c.pkucada.org:8008/contest/login.py?';
homeUrl = 'http://c.pkucada.org:8008/contest/home';
function change (){
  var id = document.getElementById('identifier');
  var h1 = document.getElementById('h1');
  var submit = document.getElementById('submit');
  var init = document.getElementById('initiator');
  var form = document.forms['login'];
  var rep = document.getElementById('repeat');
  if (id.innerText == '登陆'){
    id.innerText = '注册';
    document.title = '文计大赛注册';
    h1.innerText = '文计大赛用户注册';
    submit.value = '注册';
    init.innerText = '登陆';
    form['operation'].value = 'register';
  }else{
    id.innerText = '登陆';
    document.title = '文计大赛登陆';
    h1.innerText = '文计大赛用户登陆';
    submit.value = '登陆';
    init.innerText = '注册';
    form['operation'].value = 'login';
  }
}
function verify (form) {
  var usr = form['account'].value.trim();
  if (usr.length == 0){
    alert("用户名不能为空!");
    return false;
  }
  var passwd = form['passwd'].value;
  if (passwd.length == 0){
    alert("密码不能为空!");
    return false; 
  }
  form.style.display = 'none';
  form['passwd'].value = MD5(passwd);
  form['account'].value = window.btoa(usr)
  return true;
}