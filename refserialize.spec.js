import test from 'ava'
import {stringify, parse} from './refserialize'
import uuid from 'uuid'

let c = 0

uuid.v4 = () => {
  c++
  return `fakeuuid-${c}`
}

test('throws', (t) => {
  t.throws(() => {
    stringify({
      __refs__: 'whatever'
    })
  }, 'object cannot have "__refs__" property')
})

test('stringifies and parses', t => {
  const a = {
    prop: 1
  }

  const b = {
    ref: a
  }

  const o = {
    a: a,
    b: a,
    c: [b],
    d: b
  }
  
  const str = stringify(o)
  t.deepEqual(JSON.parse(str), {
    a: 'fakeuuid-1',
    b: 'fakeuuid-1',
    c: ['fakeuuid-2'],
    d: 'fakeuuid-2',
    __refs__: {
      'fakeuuid-1': {
        prop: 1
      },
      'fakeuuid-2': {
        ref: 'fakeuuid-1'
      }
    }
  })
  const parsed = parse(str)

  t.is(parsed.a, parsed.b)
  t.is(parsed.c[0], parsed.d)
  t.is(parsed.__refs__, undefined)
  t.is(parsed.b, parsed.d.ref)
  t.is(parsed.b, parsed.c[0].ref)
})