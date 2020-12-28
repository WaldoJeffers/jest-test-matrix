import prettyTable from './pretty-table';
import TEST_MATRIX_SYMBOL from './symbol'

const buildTestResults = <Params extends Record<string, any>>(
  fn: (params: Params) => void,
  input: {[Key in keyof Params]: Params[Key][]},
  opts?: {skip: (params: Params) => boolean}
): ({input: Params, output: ReturnType<typeof fn>})[] => {
  const sortedKeys: (keyof Params)[] = Object.keys(input).sort((a, b) => input[a].length - input[b].length);
  const isLastIteration = sortedKeys.every(key => input[key].length === 1);
  if (isLastIteration){
    const params = sortedKeys.reduce((acc, key) => ({...acc, [key]: input[key][0]}), {}) as Params;
    if (opts?.skip(params)){
      return [];
    }
    return [{input: params, output: fn(params)}]
  }
  const fixedVariable = sortedKeys.find(key => input[key].length !== 1) as keyof Params;
  const sortedInput = sortedKeys.reduce((acc, key) => ({...acc, [key]: input[key]}), {}) as (typeof input);
  return [
    ...buildTestResults(fn, {...sortedInput, [fixedVariable]: input[fixedVariable].slice(0, 1)}, opts),
    ...buildTestResults(fn, {...sortedInput, [fixedVariable]: input[fixedVariable].slice(1)}, opts)
  ]
};

const testMatrix = <Params extends Record<string, any>>(
  fn: (params: Params) => void,
  input: { [Key in keyof Params]: Params[Key][]},
  opts?: {skip: (params:Params) => boolean}
) => {
  const results = buildTestResults(fn, input, opts);
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
  serialize(value) {
    const { results, funcName } = value as ReturnType<typeof testMatrix>;
    const heading = [...Object.keys(results[0].input)]
    const table = prettyTable({results, title: funcName, heading });
    return table;
  },
});


export default testMatrix;