import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.141.0/testing/asserts.ts';
import { CustomEventTarget } from './mod.ts';
Deno.test('CustomEventTarget', () => {
  type Events = {
    foo: {
      customDetail: string;
    };
    bar: [string, number, string];
  };
  let f: string | undefined;
  const customEventTargetTest = new CustomEventTarget<Events>();
  const fooListener = customEventTargetTest.on('foo', (detail) => {
    f = detail.customDetail;
  });
  const barListener = customEventTargetTest.on('bar', (detail) => {
    f = detail[0] + String(detail[1] * 5) + detail[2];
  });
  customEventTargetTest.all((detail) => {
    assert(
      'customDetail' in detail || 'length' in detail,
      `Detail: ${JSON.stringify(detail, null, 2)}`,
    );
  });
  customEventTargetTest.emit('foo', {
    customDetail: 'First foo',
  });
  assertEquals(f, 'First foo');
  customEventTargetTest.off('foo', fooListener);
  customEventTargetTest.emit('foo', {
    customDetail: 'Second foo',
  });
  assertEquals(f, 'First foo');

  customEventTargetTest.emit('bar', ['bar', 3, 'baz']);
  assertEquals(f, 'bar15baz');
  customEventTargetTest.off('bar', barListener);
  customEventTargetTest.emit('bar', ['a', 1, 'b']);
  assertEquals(f, 'bar15baz');
});
