import { surroundingAgent } from '../engine.mjs';
import {
  AllocateArrayBuffer,
  CreateBuiltinFunction,
  SetFunctionLength,
  SetFunctionName,
  ToIndex,
} from '../abstract-ops/all.mjs';
import {
  Descriptor,
  Type,
  Value,
  wellKnownSymbols,
} from '../value.mjs';
import {
  Q, X,
} from '../completion.mjs';
import { BootstrapConstructor } from './Bootstrap.mjs';

// 24.1.2 #sec-arraybuffer-constructor
function ArrayBufferConstructor([length], { NewTarget }) {
  if (Type(NewTarget) === 'Undefined') {
    return surroundingAgent.Throw('TypeError', 'ArrayBuffer constructor requires new');
  }
  const byteLength = Q(ToIndex(length));
  return Q(AllocateArrayBuffer(NewTarget, byteLength));
}

// 24.1.3.1 #sec-arraybuffer.isview
function ArrayBuffer_isView([arg]) {
  if (Type(arg) !== 'Object') {
    return Value.false;
  }
  if ('ViewedArrayBuffer' in arg) {
    return Value.true;
  }
  return Value.false;
}

// 24.1.3.3 #sec-get-arraybuffer-@@species
function ArrayBuffer_speciesGetter(a, { thisValue }) {
  return thisValue;
}

export function CreateArrayBuffer(realmRec) {
  const abConstructor = BootstrapConstructor(realmRec, ArrayBufferConstructor, 'ArrayBuffer', 1, realmRec.Intrinsics['%ArrayBufferPrototype%'], []);

  {
    const isViewMethod = CreateBuiltinFunction(ArrayBuffer_isView, [], realmRec);
    X(SetFunctionLength(isViewMethod, new Value(1)));
    X(SetFunctionName(isViewMethod, new Value('isView')));
    X(abConstructor.DefineOwnProperty(new Value('isView'), Descriptor({
      Value: isViewMethod,
      Writable: Value.true,
      Enumerable: Value.false,
      Configurable: Value.true,
    })));
  }

  {
    const speciesMethod = CreateBuiltinFunction(ArrayBuffer_speciesGetter, [], realmRec);
    X(SetFunctionLength(speciesMethod, new Value(0)));
    X(SetFunctionName(speciesMethod, new Value('get [Symbol.species]')));
    X(abConstructor.DefineOwnProperty(wellKnownSymbols.species, Descriptor({
      Get: speciesMethod,
      Set: Value.undefined,
      Enumerable: Value.false,
      Configurable: Value.true,
    })));
  }

  realmRec.Intrinsics['%ArrayBuffer%'] = abConstructor;
}
