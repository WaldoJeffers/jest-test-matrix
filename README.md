# jest-test-matrix
A plugin for Jest which helps you test functions accepting different combinations of inputs. Instead of manually writing a test for each possible combination, you will only need to write one.

A quick example:
```ts
// file.test.js
import testMatrix from 'jest-test-matrix';

interface CanPayOpts {
  amount: number;
  balance: number;
  status: 'active' | 'locked' | 'expired';
}

function canPay({amount, balance, status}: CanPayOpts){
  if (status === 'locked' || status == 'expired'){
    return false;
  }
  return balance > amount;
}

it('should only allow valid payments', () => {
  expect(
    testMatrix(canPay, {
      amount: [20, 100],
      balance : [50],
      status: ['active', 'locked', 'expired']
    })
  ).toMatchSnapshot();
})
```

will result in the following snapshot:

```
// file.test.snap
exports[`should only allow valid payments 1`] = `
.-------------------------------------.
|               canPay                |
|-------------------------------------|
| balance | amount | status  | result |
|---------|--------|---------|--------|
|      50 |     20 | active  | true   |
|         |        | locked  | false  |
|         |        | expired | false  |
|         |    100 | active  | false  |
|         |        | locked  | false  |
|         |        | expired | false  |
'-------------------------------------'
`;
```

## Installation
With npm
```bash
npm install -D jest-test-matrix
```

With yarn
```bash
yarn add -D jest-test-matrix
```

## Usage
**`testMatrix(fn, input)`** where
- **`fn: (params: Record<'string', any>) => any`**: The function you want to test. By default, all the parameters in `input` are passed as an object. If your function has a different arity, you can always pass an anonymous function wrapping your own function, like so `testMatrix({a, b} => fn(a, b), {a: [...], b: [...]})`. If your function has a name, it will be used as a title in the matrix snapshot.
- **`input: Record<'string', any[]>`**: An object where keys are the names of the parameters you want to test (they will be used as column headers in the snapshot), and values are an array of different possible values for each parameter.


The call to `testMatrix` should we wrapped in a `jest.expect` call to generate a snapshot:
```ts
expect(
  testMatrix(canPay, {
    amount: [20, 100],
    balance : [50],
    status: ['active', 'locked', 'expired']
  })
).toMatchSnapshot();
```