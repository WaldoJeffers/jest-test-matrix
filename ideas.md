# Alternative syntaxes
**`testMatrix(fn, valuesForParam1, valuesForParam1, ...)`**

_Upsides_

- It allows us to respect how arguments are passed to `fn` instead of arbitrarily opting for an object.

_Downsides_

- If params are not passed as an object, they will be anonymous in the table snapshot

_Example_
```ts
const mult = (a: number, b: number) => a * b
testMatrix(mult, [1, 2], [3, 4])

const add = ({a, b}) => a + b;
testMatrix(mult, {a: [1, 2], b: [3, 4]})
```

**`testMatrix(fn).with(...)`**

It allows us to respect how arguments are passed to `fn` instead of arbitrarily opting for an object.

_Upsides_

- It allows us to respect how arguments are passed to `fn` instead of arbitrarily opting for an object.
- The API is a bit easier to read

_Downsides_

- If params are not passed as an object, they will be anonymous in the table snapshot
- Using OOP can result in a more complex API

_Example_
```ts
const mult = (a: number, b: number) => a * b
testMatrix(mult).with([1, 2], [3, 4])

const add = ({a, b}) => a + b
testMatrix(mult).with({a: [1, 2], b: [3, 4]})
```