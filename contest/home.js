document.addEventListener('DOMContentLoaded', onPageLoad);
function onPageLoad(){
  console.log('onPageLoad');
  document.getElementById('member1').style.display = 'none';
  document.getElementById('member2').style.display = 'none';
  document.getElementById('greeting').innerText = '你好,' + window.atob(docCookies.getItem('cadc_login'));
  // document.getElementById('addmember').addEventListener('onclick', addMember);
}
function addMember(){
  var cnt = document.getElementById('member-cnt');
  if (cnt.innerText == '0'){
    var member1 = document.getElementById('member1');
    member1.style.display = 'block';
    cnt.innerText = '1';
  }else if (cnt.innerText == '1'){
    var member2 = document.getElementById('member2');
    member2.style.display = 'block';
    cnt.innerText = '2';
  }else{
    alert('团队最多3人!');
  }
}

function verifyStudent(form) {

}

function verifyGroup(form) {

}