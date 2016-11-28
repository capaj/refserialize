# refserialize

Serialize your POJO objects and retain reference equality between multiple references to the same objects

## Install
```
npm i refserialize
```

Example:
```javascript
const refserialize = require('refserialize')

var a = {b: 1}
var o = {
    c: a,
    d: a
}
const str = refserialize.stringify(o)
const parsed = refserialize.parse(str)
parsed.c === parsed.d // true

```
Keep in mind that this only works inside one parent object. If you call serialize twice on two different objects, which have some common reference, this reference will not be resolved into a single object. You really need to put your two objects into one parent object.
Also beware of the performance. I have not tested this with large objects, but expect it to be quite slow.

