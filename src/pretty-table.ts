import AsciiTable from 'ascii-table'

interface ResultRow{
  input: Record<string, any>;
  output: any;
}

const formatRow = (row: ResultRow, previousRow?: ResultRow) => {
  const {input, output} = row;
  const values = previousRow ? Object.keys(input).map(key => {
    const value = input[key]
    if (value === previousRow.input[key]){
      return '';
    }
    return value;
  }) : Object.values(input);
  return [...values, output];
}

interface PrettyTableOpts {
  title: string;
  heading: string[];
  results: ResultRow[];
}

const prettyTable = (opts: PrettyTableOpts) => {
  const {title, heading, results} = opts;
  const rowMatrix = results.map((row, rowIndex) => formatRow(row, rowIndex === 0 ? undefined : results[rowIndex - 1]));
  const table = new AsciiTable(title).setHeading(heading).addRowMatrix(rowMatrix);
  return table.toString()
}

export default prettyTable;