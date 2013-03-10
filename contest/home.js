document.addEventListener('DOMContentLoaded', onPageLoad);
var login;
var passwd;
var baseUrl = 'http://c.pkucada.org:8008/contest/info.py';
var pdfUrl = 'http://c.pkucada.org:8008/contest/output.py?gid=';
function onPageLoad(){
  console.log('onPageLoad');
  login = docCookies.getItem('cadc_login');
  passwd = docCookies.getItem('cadc_passwd');
  var greeting = document.getElementById('greeting');
  var info_body = document.getElementsByClassName('info-body')[0];
  if (!login || !passwd){
    info_body.style.display = 'none';
    greeting.innerHTML = '已超时, 请先<a href="main.html">登陆</a>! 并开启Cookies.'
    clearCookie();
    redirectMain();
    return;
  }
  login = window.atob(login);
  greeting.innerHTML = '你好,' + login;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechage = function (){
    if (xhr.readyState != 4){
      return;
    }
    if (xhr.status != '200'){
      info_body.style.display = 'none';
      greeting.innerText = '服务器错误, 读取信息失败! 请重新登陆.';
      clearCookie();
      redirectMain();
    }
    var info = JSON.parse(xhr.responseText);
    fillInfo(info);
  };
  xhr.onerror = function() {
    info_body.style.display = 'none';
    greeting.innerText = '服务器错误, 读取信息失败! 请重新登陆.';
    clearCookie();
    redirectMain();
  };
  xhr.open('POST', baseUrl, true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send('operation=retrieve');
}

function fillInfo(info){
  form = document.forms[0];
  for (attr in info){
    form[attr] = info[attr];
  }
}

function redirectMain(){
  setTimeout(function(){
    window.location.href = 'main.html';
  },2500);
}
function clearCookie(){
  docCookies.removeItem('cadc_login');
  docCookies.removeItem('cadc_passwd');
}
// function getFormData(form) {
//   var aParams = new Array();
//   for (var i = 0; i < form.elements.length; i++) {    
//     var sParam = encodeURIComponent(form.elements[i].name);    
//     sParam += "=";    
//     sParam += encodeURIComponent(form.elements[i].value);    
//     aParams.push(sParam);    
//   }
//   return aParams.join("&");    
// }

function testNotEmpty (form, prefix, fields) {
  if (prefix != 'leader' && !form[prefix + '-enable'].checked){
    return true;
  }
  for (var i = 0; i < fields.length; i++) {
    if (!form[prefix + '-' + fields[i]].value)
      return false;
  }
  return true;
}

function verifyForm(form) {
  var testFields = ['name', 'stu_id', 'phone', 'email'];
  var testRes = testNotEmpty(form, 'leader', testFields);
  if (!testRes){
    alert('请补全组长信息!');
    return false;
  }
  testRes = testNotEmpty(form, 'member1', testFields);
  if (!testRes){
    alert('请补全组员1信息!');
    return false;
  }
  testRes = testNotEmpty(form, 'member2', testFields);
  if (!testRes){
    alert('请补全组员2信息!');
    return false;
  }
  if (!form['group-title'].value) {
    alert('请补全团队信息!');
    return false;
  }
  return true;
}

function exportPDF() {
  var gid = document.forms['info']['group-gid'].value;
  if (!gid){
    alert('请填写并保存信息后再输出表格!');
    return;
  }
  var link = document.createElement('a');
  link.class = 'hidden';
  link.href = pdfUrl + gid;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return false;
}
