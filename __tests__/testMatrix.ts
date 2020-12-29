import testMatrix from '../src/index'

describe('testMatrix', () => {
  it('should generate a pretty ASCII-table snapshot when toMatchSnapshot is called', () => {
    interface IOpts {
      col1: string;
      col2: number;
      col3: string;
    }

    const fn1 =  ({col1, col2, col3}: IOpts) => col1.charCodeAt(0) + col2.toString().charCodeAt(0) + col3.charCodeAt(0)

    const matrix = 
      testMatrix(
        fn1,
        {
          col1: ['a', 'b', 'c', 'd'],
          col2: [26, 8, 3],
          col3: ['Δ', 'ƒ']
        },
      )
    expect(matrix).toMatchSnapshot()
  })

  it('should properly serialize special values', () => {
    expect(testMatrix(
      ({a, b, c}) => a && b && c,
      {
        a: [''],
        b: [0],
        c: [null, undefined]
      }
    )).toMatchSnapshot()
  });

  it('should handle object structures', () => {
    expect(
      testMatrix(
        ({fn, data}) => fn(data),
        {
          fn: [(data: any) => Object.keys(data).length],
          data: [[], [0], {}, {hello: 'world'}]
        }
      )
    ).toMatchSnapshot()
  });

  it('should skip combinations identifed by the skip option', () => {
    expect(
      testMatrix(
        ({a, b}: {a:number, b:number}) => a && b,
        {
          a: [0, 1],
          b: [0, 1],
        },
        {
          skip: ({a, b}) => a === b
        }
      )
    ).toMatchSnapshot()
  });

  it('should accept different styling options', () =>{
    expect(
      testMatrix(
        ({a, b}: {a:number, b:number}) => a && b,
        {
          a: [0, 1],
          b: [0, 1],
        },
        {
          style: 'verbose'
        }
      )
    ).toMatchSnapshot()
  })

})