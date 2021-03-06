
INSERT INTO sy_list (_key, _tx, area, id, title) VALUES
    ('sy.active', null, 'sy', 'active', 'Active'),
    ('sy.aggregation', null, 'sy', 'aggregation', 'Column Aggregation'),
    ('sy.duration', null, 'sy', 'duration', 'Duration'),
    ('sy.edit_type', null, 'sy', 'edit_type', 'Edit Type'),
    ('sy.search_oper_list_attr', null, 'sy', 'search_oper_list_attr', 'Search Operators (Attributes)'),
    ('sy.search_oper_list_boolean', null, 'sy', 'search_oper_list_boolean', 'Search Operators (Boolean)'),
    ('sy.search_oper_list_date', null, 'sy', 'search_oper_list_date', 'Search Operators (Date)'),
    ('sy.search_oper_list_keyword', null, 'sy', 'search_oper_list_keyword', 'Search Operators (Keywords)'),
    ('sy.search_oper_list_number', null, 'sy', 'search_oper_list_number', 'Search Operators (Number)'),
    ('sy.search_oper_list_option', null, 'sy', 'search_oper_list_option', 'Search Operators (Option)'),
    ('sy.search_oper_list_radius', null, 'sy', 'search_oper_list_radius', 'Search Operators (Radius)'),
    ('sy.search_oper_list_scalar', null, 'sy', 'search_oper_list_scalar', 'Search Operators (Number and Date)'),
    ('sy.search_oper_list_subent', null, 'sy', 'search_oper_list_subent', 'Search Operators (Sub-Entity)'),
    ('sy.search_oper_list_text', null, 'sy', 'search_oper_list_text', 'Search Operators (Text)'),
    ('sy.week_days', null, 'sy', 'week_days', 'Days of the Week'),
    ('sy.year', null, 'sy', 'year', 'Year'),
    ('sy.yesno', null, 'sy', 'yesno', 'Simple Yes or No');


INSERT INTO sy_list_item (_key, _tx, seq_number, list, id, text, active, from_value, to_value) VALUES
    ('sy.active.A', null, '10', 'sy.active', 'A', 'active', 'A', null, null),
    ('sy.active.I', null, '20', 'sy.active', 'I', 'inactive', 'A', null, null),
    ('sy.duration.days', null, '10', 'sy.duration', 'days', 'week-days', 'A', null, null),
    ('sy.duration.weeks', null, '20', 'sy.duration', 'weeks', 'weeks', 'A', null, null),
    ('sy.duration.months', null, '30', 'sy.duration', 'months', 'months', 'A', null, null),
    ('sy.aggregation.A', null, '1', 'sy.aggregation', 'A', 'average', 'A', null, null),
    ('sy.aggregation.C', null, '2', 'sy.aggregation', 'C', 'count', 'A', null, null),
    ('sy.aggregation.N', null, '3', 'sy.aggregation', 'N', 'none', 'A', null, null),
    ('sy.aggregation.S', null, '4', 'sy.aggregation', 'S', 'sum', 'A', null, null),
    ('sy.edit_type.A', null, '1', 'sy.edit_type', 'A', 'allow blanks', 'A', null, null),
    ('sy.edit_type.E', null, '2', 'sy.edit_type', 'E', 'editable', 'A', null, null),
    ('sy.edit_type.H', null, '3', 'sy.edit_type', 'H', 'hidden', 'A', null, null),
    ('sy.edit_type.U', null, '4', 'sy.edit_type', 'U', 'uneditable', 'A', null, null),
    ('sy.search_oper_list_attr.AL', null, '20', 'sy.search_oper_list_attr', 'AL', 'all of', 'A', null, null),
    ('sy.search_oper_list_attr.AN', null, '10', 'sy.search_oper_list_attr', 'AN', 'any of', 'A', null, null),
    ('sy.search_oper_list_boolean.EQ', null, '10', 'sy.search_oper_list_boolean', 'EQ', 'equals', 'A', null, null),
    ('sy.search_oper_list_date.EQ', null, '10', 'sy.search_oper_list_date', 'EQ', 'equals', 'A', null, null),
    ('sy.search_oper_list_date.GE', null, '30', 'sy.search_oper_list_date', 'GE', 'on/after', 'A', null, null),
    ('sy.search_oper_list_date.LE', null, '40', 'sy.search_oper_list_date', 'LE', 'on/before', 'A', null, null),
    ('sy.search_oper_list_date.NE', null, '20', 'sy.search_oper_list_date', 'NE', 'does not equal', 'A', null, null),
    ('sy.search_oper_list_keyword.KW', null, '10', 'sy.search_oper_list_keyword', 'KW', 'contains words', 'A', null, null),
    ('sy.search_oper_list_number.EQ', null, '10', 'sy.search_oper_list_number', 'EQ', 'equals', 'A', null, null),
    ('sy.search_oper_list_number.GE', null, '30', 'sy.search_oper_list_number', 'GE', 'greater than/equals', 'A', null, null),
    ('sy.search_oper_list_number.LE', null, '40', 'sy.search_oper_list_number', 'LE', 'less than/equals', 'A', null, null),
    ('sy.search_oper_list_number.NE', null, '20', 'sy.search_oper_list_number', 'NE', 'does not equal', 'A', null, null),
    ('sy.search_oper_list_option.EQ', null, '10', 'sy.search_oper_list_option', 'EQ', 'equals', 'A', null, null),
    ('sy.search_oper_list_option.NE', null, '20', 'sy.search_oper_list_option', 'NE', 'does not equal', 'A', null, null),
    ('sy.search_oper_list_radius.LT', null, '10', 'sy.search_oper_list_radius', 'LT', 'within', 'A', null, null),
    ('sy.search_oper_list_scalar.EQ', null, '10', 'sy.search_oper_list_scalar', 'EQ', 'equals', 'A', null, null),
    ('sy.search_oper_list_scalar.GT', null, '30', 'sy.search_oper_list_scalar', 'GT', 'greater than', 'A', null, null),
    ('sy.search_oper_list_scalar.LT', null, '40', 'sy.search_oper_list_scalar', 'LT', 'less than', 'A', null, null),
    ('sy.search_oper_list_scalar.NE', null, '20', 'sy.search_oper_list_scalar', 'NE', 'does not equal', 'A', null, null),
    ('sy.search_oper_list_subent.HA', null, '10', 'sy.search_oper_list_subent', 'HA', 'has', 'A', null, null),
    ('sy.search_oper_list_subent.DH', null, '20', 'sy.search_oper_list_subent', 'DH', 'doesn''t have', 'A', null, null),
    ('sy.search_oper_list_text.BE', null, '30', 'sy.search_oper_list_text', 'BE', 'begins with', 'A', null, null),
    ('sy.search_oper_list_text.BN', null, '40', 'sy.search_oper_list_text', 'BN', 'does not begin with', 'A', null, null),
    ('sy.search_oper_list_text.CO', null, '10', 'sy.search_oper_list_text', 'CO', 'contains', 'A', null, null),
    ('sy.search_oper_list_text.DC', null, '20', 'sy.search_oper_list_text', 'DC', 'does not contain', 'A', null, null),
    ('sy.search_oper_list_text.EQ', null, '50', 'sy.search_oper_list_text', 'EQ', 'equals', 'A', null, null),
    ('sy.search_oper_list_text.NE', null, '60', 'sy.search_oper_list_text', 'NE', 'does not equal', 'A', null, null),
    ('sy.week_days.1', null, '10', 'sy.week_days', '1', 'Sunday', 'A', null, null),
    ('sy.week_days.2', null, '20', 'sy.week_days', '2', 'Monday', 'A', null, null),
    ('sy.week_days.3', null, '30', 'sy.week_days', '3', 'Tuesday', 'A', null, null),
    ('sy.week_days.4', null, '40', 'sy.week_days', '4', 'Wednesday', 'A', null, null),
    ('sy.week_days.5', null, '50', 'sy.week_days', '5', 'Thursday', 'A', null, null),
    ('sy.week_days.6', null, '60', 'sy.week_days', '6', 'Friday', 'A', null, null),
    ('sy.week_days.7', null, '70', 'sy.week_days', '7', 'Saturday', 'A', null, null),
    ('sy.year.2010', null, '2010', 'sy.year', '2010', '2010', 'A', null, null),
    ('sy.year.2011', null, '2011', 'sy.year', '2011', '2011', 'A', null, null),
    ('sy.year.2012', null, '2012', 'sy.year', '2012', '2012', 'A', null, null),
    ('sy.year.2013', null, '2013', 'sy.year', '2013', '2013', 'A', null, null),
    ('sy.year.2014', null, '2014', 'sy.year', '2014', '2014', 'A', null, null),
    ('sy.year.2015', null, '2015', 'sy.year', '2015', '2015', 'A', null, null),
    ('sy.yesno.N', null, '20', 'sy.yesno', 'N', 'no', 'A', null, null),
    ('sy.yesno.Y', null, '10', 'sy.yesno', 'Y', 'yes', 'A', null, null);
