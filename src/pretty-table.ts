import AsciiTable from 'ascii-table'

interface ResultRow{
  input: Record<string, any>;
  output: any;
}

const serialize = (value: any) => {
  if ([null, undefined].includes(value)){
    return String(value);
  }
  if (Array.isArray(value)){
    return `[${value}]`
  }
  if (value === ''){
    return "\'\'"
  }
  if (Object.prototype.toString.call(value) === '[object Object]'){
    const stringifiedObj:string = Object.keys(value).reduce(
      (acc, key) => `${acc === '' ? '' : `${acc}, `}${key}: '${serialize(value[key])}'`,
    '');
    return `{${stringifiedObj}}`;
  }
  return value;
}

const formatRow = (row: ResultRow, previousRow: ResultRow | undefined, style: 'minimalist' | 'verbose') => {
  const {input, output} = row;
  const values = (style === 'minimalist' && previousRow !== undefined)
  ? Object.keys(input).map(key => {
    const value = input[key]
    if (value === previousRow.input[key]){
      return '';
    }
    return serialize(value);
  }) : Object.values(input).map(serialize);
  return [...values, serialize(output)];
}

interface PrettyTableOpts {
  title: string;
  heading: string[];
  results: ResultRow[];
  style?: 'minimalist' | 'verbose';
}

const prettyTable = (opts: PrettyTableOpts) => {
  const {title, heading, results, style = 'minimalist'} = opts;
  const rowMatrix = results.map((row, rowIndex) => formatRow(row, results[rowIndex - 1], style));
  const table = new AsciiTable(title).setHeading(heading).addRowMatrix(rowMatrix);
  return table.toString()
}

export default prettyTable;