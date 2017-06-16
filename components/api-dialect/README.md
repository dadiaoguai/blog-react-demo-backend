** example: **
```
  let api = new ApiDialect(req, res);
  let model = new Model('account');

  let args = [
    new Arg('limit').setDefault(5),
    new Arg('offset',false,'integer').setStrict(123),
    new Arg('createdAt').setDateFormat('YYYY-MM-DD'),
    new Arg('updatedAt'),
    new Arg('username'),
  ];

  if (!api.setArgs(args)) return;

  let attrs = ['id','username','password'
    ,'include.article.id,title?status_in=0,1,2&title_like=2017 04 01'
  ];
  (async function () {
    let obj = await model.setWherestr(api.args).setAttributes(attrs).cacherfy().all();
    api.setResponse(obj).send({
      remove: ['createdAt'],
      blank: true,
      type: 'json',
      dateFormat: ['YYYY-MM-DD', 'updatedAt']
    })
  })()
  .catch(err => api.error(err));
```