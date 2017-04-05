
INSERT INTO sy_list (_key, _tx, area, id, title) VALUES
    ('sy.msg_type', null, 'sy', 'msg_type', 'Message Type');


INSERT INTO sy_list_item (_key, _tx, seq_number, list, id, text, active, from_value, to_value) VALUES
    ('sy.msg_type.D', null, '4', 'sy.msg_type', 'D', 'debug', 'A', null, null),
    ('sy.msg_type.E', null, '1', 'sy.msg_type', 'E', 'error', 'A', null, null),
    ('sy.msg_type.I', null, '3', 'sy.msg_type', 'I', 'information', 'A', null, null),
    ('sy.msg_type.N', null, '5', 'sy.msg_type', 'N', 'email notification', 'A', null, null),
    ('sy.msg_type.W', null, '2', 'sy.msg_type', 'W', 'warning', 'A', null, null);
