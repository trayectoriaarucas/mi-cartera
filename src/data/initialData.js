export const getInitialData = () => {
  return {
    settings: {
      userName: 'Cristian',
      currency: '€',
      monthlyCapHormiga: 200, // 200 € mensual
      alertThresholdYellow: 65,
      alertThresholdRed: 85,
    },
    fixedExpenses: [],
    transactions: [],
    savingsGoals: [],
  };
};
