import {
  X,
  Completion,
  NormalCompletion,
  ThrowCompletion,
} from '../completion.mjs';
import { AsyncGeneratorEnqueue } from '../abstract-ops/all.mjs';
import { BootstrapPrototype } from './Bootstrap.mjs';

function AsyncGeneratorPrototype_next([value], { thisValue }) {
  const generator = thisValue;
  const completion = new NormalCompletion(value);
  return X(AsyncGeneratorEnqueue(generator, completion));
}

function AsyncGeneratorPrototype_return([value], { thisValue }) {
  const generator = thisValue;
  const completion = new Completion('return', value, undefined);
  return X(AsyncGeneratorEnqueue(generator, completion));
}

function AsyncGeneratorPrototype_throw([exception], { thisValue }) {
  const generator = thisValue;
  const completion = new ThrowCompletion(exception);
  return X(AsyncGeneratorEnqueue(generator, completion));
}

export function CreateAsyncGeneratorPrototype(realmRec) {
  const proto = BootstrapPrototype(realmRec, [
    ['next', AsyncGeneratorPrototype_next, 1],
    ['return', AsyncGeneratorPrototype_return, 1],
    ['throw', AsyncGeneratorPrototype_throw, 1],
  ], realmRec.Intrinsics['%AsyncIteratorPrototype%'], 'AsyncGenerator');

  realmRec.Intrinsics['%AsyncGeneratorPrototype%'] = proto;
}
