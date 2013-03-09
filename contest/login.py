#!/usr/bin/python
# coding=utf8
from urlparse import parse_qs
import MySQLdb as mdb
from mdb.cursors import DictCursor
from base64 import b64decode

homeUrl = 'http://c.pkucada.org:8008/contest/home.html'
failUrl = 'http://c.pkucada.org:8008/contest/main.html'
status = '200 OK'
select = 'SELECT * FROM accounts WHERE login = %s;'
with open('response.html') as tempfile:
    template = tempfile.read()
cookie = 'cadc_login=%s&cadc_passwd=%s;path=/contest;max-age=3600'

def application(environ, start_response):
    form = parse_qs(environ['QUERY_STRING'])
    login = form.get('account', [''])[0]
    passwd = form.get('passwd', [''])[0]
    resp_dict = {'header':'用户登陆'}
    headers = [('Content-Type', 'text/html')]
    try:
        conn = mdb.connect(host='localhost', user='cadc2013', passwd='cadc2013/wky',
            db='cadc2013', cursorclass=DictCursor)
        curs = conn.cursor()
        curs.execute(select, (b64decode(login), ))
        res = curs.fetchone()
        if not res or res['passwd'] != passwd:
            resp_dict['redirect'] = failUrl
            resp_dict['info1'] = '登陆失败:'
            resp_dict['info2'] = '用户名或密码错误'
        else:
            resp_dict['redirect'] = homeUrl
            resp_dict['info1'] = '登陆成功!'
            resp_dict['info2'] = ''
            curs.execute(insert, (login, passwd))
            headers.append(('Set-Cookie', cookie % (login, passwd)))
        start_response(status, headers)
        return [template % resp_dict, ]
    except mdb.Error, e:
        print '***---***[register.py]', e
        resp_dict['redirect'] = failUrl
        resp_dict['info1'] = '服务器错误:'
        resp_dict['info2'] = '请联系<a href="mailto:wkyjyy@gmail.com">管理员<a>'
    finally:
        if curs: curs.close()