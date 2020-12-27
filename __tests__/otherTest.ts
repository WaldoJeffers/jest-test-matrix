import testMatrix from '../src';

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
  expect(testMatrix(canPay, {
    amount: [20, 100],
    balance : [50],
    status: ['active', 'locked', 'expired']
  })).toMatchSnapshot();
})