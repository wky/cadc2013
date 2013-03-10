document.addEventListener('DOMContentLoaded', onPageLoad);
var login;
var passwd;
var doDel = false;
var baseUrl = 'http://c.pkucada.org:8008/contest/info.py';
var pdfUrl = 'http://c.pkucada.org:8008/contest/output.py?gid=';
function onPageLoad(){
  console.log('onPageLoad');
  login = docCookies.getItem('cadc_login');
  passwd = docCookies.getItem('cadc_passwd');
  var greeting = document.getElementById('greeting');
  if (!login || !passwd){
    var info_body = document.getElementsByClassName('info-body')[0];
    info_body.style.display = 'none';
    greeting.innerHTML = '已超时, 请先<a href="main.html">登陆</a>! 并开启Cookies.'
    setInterval(function(){
      window.location.href = 'main.html';
    },2500);
    return;
  }
  login = window.atob(login);
  greeting.innerHTML = '你好,' + login;
}
// function addMember(){
//   var cnt = document.getElementById('member-cnt');
//   if (cnt.innerText == '0'){
//     var member1 = document.getElementById('member1');
//     member1.style.display = 'block';
//     cnt.innerText = '1';
//   }else if (cnt.innerText == '1'){
//     var member2 = document.getElementById('member2');
//     member2.style.display = 'block';
//     cnt.innerText = '2';
//   }else if (cnt.innerText == '2'){
//     alert('团队最多3人!');
//   }
// }
// function delMember(){
//   var cnt = document.getElementById('member-cnt');
//   if (cnt.innerText == '0'){
//     alert('还没有成员!');
//   }else{
//     var member = 'member' + cnt.innerText;
//     var div = document.getElementById(member);
//     var form = document.forms[member];
//     var ret = confirm('确认删除成员"' + form['name'] + '"?');
//     if (ret) {
//       console.log('about to delete member' + cnt.innerText);
//       if (!form['eid']){
//         // member is not saved yet
//         div.style.display = 'none';
//         cnt.innerText = String(parseInt(cnt.innerText)-1);
//         form.reset();
//         return;
//       }
//       // ask server to unlink a member
//       var xhr = new XMLHttpRequest();
//       var url = baseUrl + delMemberCmd + member + '&eid=' + form['eid'];
//       var delSuccess = false;
//       xhr.onload = function(){
//         console.log('responded:' + url);
//         doDel = false;
//         var res = JSON.parse(xhr.responseText);
//         if (res.status != 'success'){
//           console.log(res.info);
//         } else {
//           div.style.display = 'none';
//           cnt.innerText = String(parseInt(cnt.innerText)-1);
//           form.reset();
//           delSuccess = true;
//         }
//       }
//       xhr.open('get', url, true);
//       xhr.send(null);
//       console.log('sent:' + url);
//       doDel = true;
//       while (doDel){
//         alert('正在处理....请耐心等候');
//       }
//       if (!delSuccess){
//         alert('失败!')
//       }
//     }
//   }else if (cnt.innerText == '2'){
//     var member2 = document.getElementById('member2');
//     member2.style.display = 'block';
//     cnt.innerText = '1';
//   }
// }
function getFormData(form) {
  var aParams = new Array();
  for (var i = 0; i < form.elements.length; i++) {    
    var sParam = encodeURIComponent(form.elements[i].name);    
    sParam += "=";    
    sParam += encodeURIComponent(form.elements[i].value);    
    aParams.push(sParam);    
  }
  return aParams.join("&");    
}  
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
function setFields(form, prefix, data, fields){
  for (var i = 0; i < fields.length; i++) {
    form[prefix + '-' + fields[i]] = data[fields[i]];
  }
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
  // passed tests
  // var doPost = true;
  // var xhr = new XMLHttpRequest();
  // var msg = '保存成功!';
  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState!=4){
  //     return;
  //   }
  //   if (xhr.status==200){
  //     doPost = false;
  //     var res = JSON.parse(xhr.responseText);
  //     if (!res.success){
  //       msg = res.message;
  //       return;
  //     }
  //     setFields(document.forms['group'], 'group', 
  //       res, ['leader', 'member1', 'member2']);    
  //     form['leader-eid'] = res.leader;
  //     form['member1-eid'] = res.member1;
  //     form['member2-eid'] = res.member2;
  //   } else {
  //     msg = '请求失败.';
  //   }
  // }
  // xhr.onload = function() {
  // }
  // xhr.open('POST', baseUrl, true);
  // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  // xhr.send(getFormData(form))
  // while (doPost){
  //   alert('正在处理....请耐心等候');
  // }
  // alert(msg);
  return true;
}

// function verifyGroup(form) {
  
//   var doPost = true;
//   var xhr = new XMLHttpRequest();
//   var msg = '保存成功!';
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState!=4){
//       return;
//     }
//     if (xhr.status==200){
//       doPost = false;
//       var res = JSON.parse(xhr.responseText);
//       if (!res.success){
//         msg = res.message;
//         return;
//       }
//       form['group-gid'] = res.gid;
//     }else {
//       msg='请求失败.';
//     }
//   }
//   xhr.open('POST', baseUrl, true);
//   xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//   xhr.send(getFormData(form))
//   while (doPost){
//     alert('正在处理....请耐心等候');
//   }
//   alert(msg);
//   return false;
// }

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