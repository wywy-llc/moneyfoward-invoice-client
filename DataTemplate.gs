/**
 * 請求書データのテンプレートを取得します。
 * @return {object} 請求書データ
 */
function getBillingTemplete() {
  return {
    billing: {
      department_id: '',
      title: '',
      memo: '',
      payment_condition: '',
      billing_date: this.getTodayString(),
      due_date: this.getNextMonthLastDay(),
      sales_date: this.getTodayString(),
      billing_number: this.getBillingNumber(),
      note: '',
      document_name: '',
      tags: '',
      items: [
        {
          name: '',
          code: '',
          detail: '',
          unit_price: 0,
          unit: '',
          quantity: 0,
          disp_order: 0,
        },
      ]
    },
  };
}

function getQuoteTemplete() {
  return {
    quote: {
      department_id: '',
      title: '',
      memo: '',
      quote_date: this.getTodayString(),
      expired_date: this.getNextMonthLastDay(),
      billing_number: this.getBillingNumber(),
      note: '',
      document_name: '',
      tags: '',
      items: [
        {
          name: '',
          code: '',
          detail: '',
          unit_price: 0,
          unit: '',
          quantity: 0,
          disp_order: 0,
        },
      ]
    },
  };
}