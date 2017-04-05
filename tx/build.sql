
INSERT INTO sy_list (_key, _tx, area, id, title) VALUES
    ('ac.tx_st', null, 'ac', 'tx_st', 'Transaction Status'),
    ('ac.action_type', null, 'ac', 'action_type', 'Record Update Action');


INSERT INTO sy_list_item (_key, _tx, seq_number, list, id, text, active, from_value, to_value) VALUES
    ('ac.tx_st.A', null, '1', 'ac.tx_st', 'A', 'active', 'A', null, null),
    ('ac.tx_st.B', null, '2', 'ac.tx_st', 'B', 'backed-out', 'A', null, null),
    ('ac.tx_st.C', null, '3', 'ac.tx_st', 'C', 'cancelled', 'A', null, null),
    ('ac.tx_st.I', null, '6', 'ac.tx_st', 'I', 'inactive', 'A', null, null),
    ('ac.tx_st.P', null, '7', 'ac.tx_st', 'P', 'in progress', 'A', null, null),
    ('ac.tx_st.Q', null, '5', 'ac.tx_st', 'Q', 'purged', 'A', null, null),
    ('ac.tx_st.X', null, '8', 'ac.tx_st', 'X', 'failed', 'A', null, null),
    ('ac.action_type.C', null, '1', 'ac.action_type', 'C', 'create', 'A', null, null),
    ('ac.action_type.D', null, '2', 'ac.action_type', 'D', 'delete', 'A', null, null),
    ('ac.action_type.U', null, '3', 'ac.action_type', 'U', 'update', 'A', null, null);
