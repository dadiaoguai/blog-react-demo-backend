```
let model = new Model('account')
let args = { 
    status_in: '1,2',
    createdAt_or_gt: 2017-4-01,
    updatedAt_or_lte: 2017-12-01,
    username_or_and_like: 测 试,
    mobile_or_and_eq: 13052029063
}

let attrs = ['$all','field1','field2','include.schema1.field1,field2','include.schema1.schema2.field1,field2'
,'include.schema3.$null?status_in=1,2&createdAt_or_gt=2017-05-01&updatedAt_or_lt=2017-05-20&required']

model.setWherestr(args).setAttributes(attrs).cachefy().all()
```