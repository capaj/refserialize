import test from 'ava'
import refserialize from './refserialize'

test('serializes', t => {
  const a = {
    prop: 1
  }

  const b = {
    ref: a
  }

  const o = {
    b: a,
    c: [b],
    d: b
  }
  t.is(refserialize(), '')
})