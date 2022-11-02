class MfDataTemplate {
  /**
   * 請求データを作成します。
   * @param {string} departmentId 部門ID
   * @return {object} 請求データ
   */
  static createBilling(departmentId) {
    return {
      billing: {
        department_id: departmentId,
        title: '',
        memo: '',
        payment_condition: '',
        billing_date: MfDataTemplate.getTodayString(),
        due_date: MfDataTemplate.getNextMonthLastDay(),
        sales_date: MfDataTemplate.getTodayString(),
        billing_number: MfDataTemplate.getBillingNumber(),
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
  /**
   * 本日日付の文字列を取得します。
   * @return {string} 本日日付((YYYY-MM-DD)
   */
  static getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  /**
   * 来月末日付の文字列を取得します。
   * @return {string} 来月末日付(YYYY-MM-DD)
   */
  static getNextMonthLastDay() {
    const nextMonthLastDay = new Date(dt.getFullYear(), dt.getMonth() + 2, 0);
    return `${nextMonthLastDay.getFullYear()}-${nextMonthLastDay.getMonth() + 1}-${nextMonthLastDay.getDate()}`;
  }
  /**
   * 請求番号を作成します。
   * @return {string} 請求番号(YYYYMMDD-hhmmdd)
   */
  static getBillingNumber() {
    const today = new Date();
    return `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}-${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
  }
}