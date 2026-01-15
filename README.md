**Usage**
```js
const db = require('fhyroxdb').connect('main');
db.setParseLevel(2)

db.set('hello', 'world'); // world
db.get('hello'); // world

db.set('money', 100); // 100
db.add('money', 200); // 300
db.subtract('money', 50) // 250

db.set('list', ['apple', 'orange']); // ['apple', 'orange'];
db.push('list', 'lemon'); // ['apple', 'orange', 'lemon']
db.unpush('list', 'orange'); // ['apple', 'lemon']

db.set('user', 'axe', true); // boolean (true / false)
db.set('user', 'pickaxe', false); //boolean (true / false)

db.set('blacklisted', false); //boolean (true / false)

db.type('list'); // type (boolean / object / string / number)
db.type('user'); // type (boolean / object / string / number)
db.type('hello'); // type (boolean / object / string / number)
db.type('money'); // type (boolean / object / string / number)
db.type('blacklisted'); // type (boolean / object / string / number)

db.has('hello'); // boolean (true / false)
db.has('donkey'); // boolean (true / false)

db.delete('list'); // boolean (true / false)
db.deleteAll(); // boolean (true / false)
```
