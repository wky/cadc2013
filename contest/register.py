#!/usr/bin/python
# coding=utf8
from urlparse import parse_qs
import MySQLdb as mdb
from base64 import b64decode

homeUrl = 'window.location.href = \'http://c.pkucada.org:8008/contest/home.html\';'
failUrl = 'window.location.href = \'http://c.pkucada.org:8008/contest/main.html\';'
status = '200 OK'
select = 'SELECT COUNT(*) FROM accounts WHERE login = %s;'
insert = 'INSERT INTO accounts (login, passwd, time) VALUES (%s, %s, NOW());'
with open('response.tmpl') as tempfile:
    template = tempfile.read()
cookie1 = 'cadc_login=%s;path=/contest;max-age=3600'
cookie2 = 'cadc_passwd=%s;path=/contest;max-age=3600'
def application(environ, start_response):
    form = parse_qs(environ['QUERY_STRING'])
    login = form.get('account', [''])[0]
    passwd = form.get('passwd', [''])[0]
    print login, passwd
    resp_dict = {'heading':'用户注册'}
    headers = [('Content-Type', 'text/html')]
    try:
        conn = mdb.connect(host='localhost', user='cadc2013',
            passwd='cadc2013/wky', db='cadc2013')
        curs = conn.cursor()
        curs.execute(select, (b64decode(login), ))
        res = curs.fetchone()
        if res[0] != 0:
            resp_dict['redirect'] = failUrl
            resp_dict['info1'] = '注册失败:'
            resp_dict['info2'] = '"%s"已存在.' % b64decode(login)
        else:
            resp_dict['redirect'] = homeUrl
            resp_dict['info1'] = '注册成功!'
            resp_dict['info2'] = '跳转后请填写更多信息.'
            curs.execute(insert, (b64decode(login), passwd))
            headers.append(('Set-Cookie', cookie1 % login))
            headers.append(('Set-Cookie', cookie2 % passwd))
    except mdb.Error, e:
        print '***---***[register.py]', e
        resp_dict['redirect'] = failUrl
        resp_dict['info1'] = '服务器错误:'
        resp_dict['info2'] = '请联系<a href="mailto:wkyjyy@gmail.com">管理员<a>'
    start_response(status, headers)
    return [template % resp_dict, ]

