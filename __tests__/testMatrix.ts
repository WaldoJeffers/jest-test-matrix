import testMatrix from '../src/index'

describe('testMatrix', () => {
  it('should generate a pretty ASCII-table snapshot when toMatchSnapshot is called', () => {
    interface IOpts {
      col1: string;
      col2: number;
      col3: string;
    }

    const fn1 =  ({col1, col2, col3}: IOpts) => col1.charCodeAt(0) + col2.toString().charCodeAt(0) + col3.charCodeAt(0)

    const r = 
      testMatrix(
        fn1,
        {
          col1: ['a', 'b', 'c', 'd'],
          col2: [26, 8, 3],
          col3: ['Δ', 'ƒ']
        },
      )
    expect(r).toMatchSnapshot()
  })

})