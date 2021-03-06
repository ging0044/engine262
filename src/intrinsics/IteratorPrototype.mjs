import {
  Descriptor,
  Value,
  wellKnownSymbols,
} from '../value.mjs';
import {
  CreateBuiltinFunction,
  ObjectCreate,
  SetFunctionLength,
  SetFunctionName,
} from '../abstract-ops/all.mjs';

function IteratorPrototype_iterator(args, { thisValue }) {
  return thisValue;
}

export function CreateIteratorPrototype(realmRec) {
  const proto = ObjectCreate(realmRec.Intrinsics['%ObjectPrototype%']);

  const fn = CreateBuiltinFunction(IteratorPrototype_iterator, [], realmRec);
  SetFunctionName(fn, wellKnownSymbols.iterator);
  SetFunctionLength(fn, new Value(0));

  proto.DefineOwnProperty(wellKnownSymbols.iterator, Descriptor({
    Value: fn,
    Enumerable: Value.false,
    Configurable: Value.false,
    Writable: Value.false,
  }));

  realmRec.Intrinsics['%IteratorPrototype%'] = proto;
}
