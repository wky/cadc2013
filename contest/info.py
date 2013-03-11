#!/usr/bin/python
# coding=utf8
from urlparse import parse_qs
import MySQLdb as mdb
from MySQLdb.cursors import DictCursor
from base64 import b64decode
from Cookie import SimpleCookie
import json
import traceback

previousUrl = 'window.history.back();'
homeUrl = 'window.location.href = \'http://c.pkucada.org:8008/contest/home.html\';'
failUrl = 'window.location.href = \'http://c.pkucada.org:8008/contest/main.html\';'
status = '200 OK'

with open('response.tmpl') as tempfile:
    template = tempfile.read()

entrant_fields = ['name', 'stu_id', 'gender', 'school',
    'phone', 'email', 'teacher', 'eid']
group_fields = ['title', 'type', 'represent', 'leader',
    'member1', 'member2', 'gid']

entrant_prefixes = ['leader', 'member1', 'member2']

select_account = 'SELECT grp_id, passwd FROM accounts WHERE login = %s;'
select_group = 'SELECT * FROM groups WHERE gid = %s;'
select_entrant = 'SELECT * FROM entrants WHERE eid = %s;'
match_entrant = 'SELECT eid FROM entrants WHERE stu_id = %s;'
match_group = 'SELECT gid FROM groups WHERE leader = %s;'
insert_entrant = 'INSERT INTO entrants (name, stu_id, gender, \
school, phone, email, teacher) VALUES (%s,%s,%s,%s,%s,%s,%s);'
update_entrant = 'UPDATE entrants SET name=%s, stu_id=%s, gender=%s, \
school=%s, phone=%s, email=%s, teacher=%s WHERE eid = %s;'
insert_group = 'INSERT INTO groups (title, type, represent, leader, \
member1, member2) VALUES (%s,%s,%s,%s,%s,%s);'
update_group = 'UPDATE groups SET title=%s, type=%s, represent=%s \
leader=%s member1=%s member2=%s WHERE gid=%s;'
update_account = 'UPDATE accounts SET grp_id=%s WHERE login=%s;'

def make_error(op, err, start_response):
    print 'ERROR:', err
    headers = []
    response = ''
    if op == 'store':
        headers = [('Content-Type', 'text/html')]
        response = template % {'heading':'保存信息', 'redirect':failUrl,
        'info1':'保存信息失败:', 'info':err}
    elif op == 'retrieve':
        headers = [('Content-Type', 'text/json')]
        response = json.dumps({'success':False, 'message':err})
    start_response(status, headers)
    return [response, ]

def loadKV(des, src, fields, prefix):
    for field in fields:
        des[prefix + '-' + field] = src.get(field, '')

def load_entrants(des, curs, eids, prefixes):
    for eid, prefix in zip(eids, prefixes):
        if not eid:
            continue
        des[prefix + '-enable'] = 'true'
        curs.execute(select_entrant, (eid, ))
        loadKV(des, curs.fetchone(), entrant_fields, prefix)

def make_tuple(src, fields, prefix):
    value_list = [src.get(prefix + '-' + field, [''])[0] for field in fields]
    return tuple(value_list)

def store_entrants(curs, src, prefixes):
    ret_id = []
    for prefix in prefixes:
        if src.get(prefix + '-enable', [''])[0] != 'true':
            ret_id.append(None)
            continue
        eid = src.get(prefix + '-eid',[''])[0]
        if eid:
            entrant_tuple = make_tuple(src, entrantst_fields, prefix)
            curs.execute(update_entrant, entrant_tuple)
        else:
            entrant_tuple = make_tuple(src, entrant_fields[:-1], prefix)
            curs.execute(insert_entrant, entrant_tuple)
            curs.execute(match_entrant, (src[prefix + '-stu_id'], ))
            eid = curs.fetchone()['eid']
        ret_id.append(eid)
    return ret_id

def store_group(curs, src, prefix):
    gid = src.get(prefix + '-gid', [''])[0]
    if gid:
        group_tuple = make_tuple(src, group_fields, prefix)
        curs.execute(update_group, group_tuple)
    else:
        group_tuple = make_tuple(src, group_fields[:-1], prefix)
        curs.execute(insert_group, group_tuple)
        curs.execute(math_group, (src['leader'], ))
        gid = curs.fetchone()['gid']
    return gid

def application(environ, start_response):
    form = parse_qs(environ['wsgi.input'].read())
    cookie = SimpleCookie()
    cookie.load(environ['HTTP_COOKIE'])
    passwd = login = ''
    try:
        login = b64decode(cookie['cadc_login'].value)
        passwd = cookie['cadc_passwd'].value
    except KeyError, e:
        pass
    operation = form.get('operation', [''])[0]
    resp_dict = {'heading':'保存信息', 'redirect':homeUrl,
        'info1':'','info2':''}
    headers = [('Content-Type', 'text/html')]
    print 'login:', login
    try:
        conn = mdb.connect(host='localhost', user='cadc2013',
            passwd='cadc2013/wky', db='cadc2013', cursorclass=DictCursor)
        curs = conn.cursor()
        curs.execute('set names utf8;')
        curs.execute(select_account, (login, ))
        res = curs.fetchone()
        if not res or res['passwd'] != passwd:
            return make_error(operation, '用户名或密码错误', start_response)
        gid = res['grp_id'] or ''
        if operation == 'retrieve':
            print operation
            headers = [('Content-Type', 'text/json')]
            resp_dict = {'success':True}
            if gid:
                print 'old info exists'
                curs.execute(select_group, (gid, ))
                res = curs.fetchone()
                loadKV(resp_dict, res, group_fields, 'group')
                entrant_ids = [res.get(prefix, '') for prefix in entrant_prefixes]
                load_entrants(resp_dict, curs, entrant_ids, entrant_prefixes)
            print 'no info exists'
            start_response(status, headers)
            print 'response:', resp_dict
            return [json.dumps(resp_dict), ]
        elif operation == 'store':
            print operation
            try:
                print 'form:', form
                eids = store_entrants(curs, form, entrant_prefixes)
                for eid, prefix in zip (eids, entrant_prefixes):
                    form[prefix] = eid
                gid = store_group(curs, form, 'group')
                curs.execute(update_account, (gid, login))
                resp_dict['info1'] = '信息录入成功'
                resp_dict['info2'] = ''
            except mdb.Error, e:
                print '***---***[info.py]', e
                traceback.print_stack()
                resp_dict['redirect'] = previousUrl
                resp_dict['info1'] = '数据库错误:'
                resp_dict['info2'] = '请检查输入数据.'
    except mdb.Error, e:
        print '***---***[info.py]', e
        traceback.print_stack()
        resp_dict['redirect'] = failUrl
        resp_dict['info1'] = '服务器错误:'
        resp_dict['info2'] = '请联系<a href="mailto:wkyjyy@gmail.com" target="_blank">管理员<a>'
    print 'response:', resp_dict
    start_response(status, headers)
    return [template % resp_dict, ]
