import {
  DefinePropertyOrThrow,
  GeneratorFunctionCreate,
  ObjectCreate,
  SetFunctionName,
} from '../abstract-ops/all.mjs';
import { directivePrologueContainsUseStrictDirective } from '../ast.mjs';
import { X } from '../completion.mjs';
import { surroundingAgent } from '../engine.mjs';
import { NewDeclarativeEnvironment } from '../environment.mjs';
import { Descriptor, Value } from '../value.mjs';

// #sec-generator-function-definitions-runtime-semantics-evaluation
//   GeneratorExpression :
//     `function` `*` `(` FormalParameters `)` `{` GeneratorBody `}`
//     `function` `*` BindingIdentifier `(` FormalParameters `)` `{` GeneratorBody `}`
export function Evaluate_GeneratorExpression(GeneratorExpression) {
  const {
    id: BindingIdentifier,
    params: FormalParameters,
  } = GeneratorExpression;
  const strict = directivePrologueContainsUseStrictDirective(GeneratorExpression.body.body);
  const scope = surroundingAgent.runningExecutionContext.LexicalEnvironment;
  let funcEnv = scope;
  let envRec;
  let name;
  if (BindingIdentifier) {
    funcEnv = NewDeclarativeEnvironment(scope);
    envRec = funcEnv.EnvironmentRecord;
    name = new Value(BindingIdentifier.name);
    envRec.CreateImmutableBinding(name, Value.false);
  }
  const closure = X(GeneratorFunctionCreate('Normal', FormalParameters, GeneratorExpression, funcEnv, strict));
  const prototype = ObjectCreate(surroundingAgent.intrinsic('%GeneratorPrototype%'));
  X(DefinePropertyOrThrow(
    closure,
    new Value('prototype'),
    Descriptor({
      Value: prototype,
      Writable: Value.true,
      Enumerable: Value.false,
      Configurable: Value.false,
    }),
  ));
  if (BindingIdentifier) {
    X(SetFunctionName(closure, name));
    envRec.InitializeBinding(name, closure);
  }
  return closure;
}
