import prettyTable from './pretty-table';
import TEST_MATRIX_SYMBOL from './symbol'

const buildTestResults = <
  Params extends Record<string, any>,
  Input extends { [Key in keyof Params]: Params[Key][]}
>(
  fn: (params: Params) => void,
  input: Input
): ({input: Params, output: ReturnType<typeof fn>})[] => {
  const sortedKeys: (keyof Params)[] = Object.keys(input).sort((a, b) => input[a].length - input[b].length);
  const isLastIteration = sortedKeys.every(key => input[key].length === 1);
  if (isLastIteration){
    const params = sortedKeys.reduce((acc, key) => ({...acc, [key]: input[key][0]}), {}) as Params;
    return [{input: params, output: fn(params)}]
  }
  const fixedVariable = sortedKeys.find(key => input[key].length !== 1) as keyof Params;
  const sortedInput = sortedKeys.reduce((acc, key) => ({...acc, [key]: input[key]}), {}) as Input;
  return [
    ...buildTestResults(fn, {...sortedInput, [fixedVariable]: input[fixedVariable].slice(0, 1)}),
    ...buildTestResults(fn, {...sortedInput, [fixedVariable]: input[fixedVariable].slice(1)})
  ]
};

const testMatrix = <
  Params extends Record<string, any>,
  Input extends { [Key in keyof Params]: Params[Key][]}
>(fn: (params: Params) => void, input: Input) => {
  const results = buildTestResults(fn, input);
  return {
    results,
    funcName: fn.name,
    origin: TEST_MATRIX_SYMBOL
  }
};

expect.addSnapshotSerializer({
  test(value) {
    return !!value && Object.prototype.hasOwnProperty.call(value, 'origin') && value.origin === TEST_MATRIX_SYMBOL; // true
  },
  print(value) {
    const { results, funcName } = value as ReturnType<typeof testMatrix>;
    const heading = [...Object.keys(results[0].input), 'result']
    const table = prettyTable({results, title: funcName, heading});
    return table;
  },
});


export default testMatrix;