/**
 * マネーフォワード請求API用クライアント
 * ■ moneyforward invoice api
 * https://invoice.moneyforward.com/api/v2/swagger_ui
 */
class MfInvoiceClient {
  /**
   * コンストラクタ
   * @param {string} clientId
   * @param {string} clientSecret
   */
  constructor(clientId, clientSecret) {
    if (clientId) {
      this.clientId = clientId;
    } else {
      this.clientId = PropertiesService.getScriptProperties().getProperty('CLIENT_ID');
    }
    if (clientSecret) {
      this.clientSecret = clientSecret;
    } else {
      this.clientSecret = PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET')
    }
    this.baseUrl = 'https://invoice.moneyforward.com/api/v2/';
    this.initApiMethod();
  }
  /**
   * API系のメソッドを生成します。
   */
  initApiMethod() {
    /**
     * 請求書関連
     */
    this.billings = {
      /**
       * 一覧取得
       */
      list: (() => {
        const reqUrl = this.baseUrl + 'billings';
        const method = 'GET';
        const options = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      }),
      /**
       * 検索
       * @param {number} page ページ番号
       * @param {string} query 検索文字列。取引先(完全一致)、ステータス、件名etc
       * @param {string} from 開始日
       * @param {string} to 終了日
       */
      search: ((page, query, from, to) => {
        const reqUrl = this.baseUrl + 'billings/search' +
          `?page=${page}&per_page=100&excise_type=boolean&q=${query}&range_key=billing_date&from=${from}&to=${to}`;
        const method = 'GET';
        const options = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      }),
      /**
       * 作成
       */
      create: ((billing) => {
        const reqUrl = this.baseUrl + 'billings';
        const method = 'POST';
        const options = {
          method: method,
          payload: JSON.stringify(billing),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(billing);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      })
    }
    /**
     * 見積書関連
     */
    this.quotes = {
      /**
       * 一覧取得
       */
      list: (() => {
        const reqUrl = this.baseUrl + 'quotes';
        const method = 'GET';
        const options = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      }),
      /**
       * 作成
       */
      create: ((quote) => {
        const reqUrl = this.baseUrl + 'quotes';
        const method = 'POST';
        const options = {
          method: method,
          payload: JSON.stringify(quote),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(quote);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      }),
      pdf: ((id) => {
        const reqUrl = this.baseUrl + 'quotes/' + id + '.pdf';
        const method = 'GET';
        const options = {
          method: method,
          headers: {
            Authorization: 'Bearer ' + this.getAccessToken()
          },
        };
        return UrlFetchApp.fetch(reqUrl, options).getAs('application/pdf');
      }),
    }
    /**
     * 取引先関連
     */
    this.partners = {
      /**
       * 一覧取得
       */
      list: ((page = 1, perPage = 100) => {
        const reqUrl = this.baseUrl + `partners?page=${page}&per_page=${perPage}`;
        const method = 'GET';
        const options = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      }),
      /**
       * 作成
       */
      create: ((partner) => {
        const reqUrl = this.baseUrl + 'partners';
        const method = 'POST';
        const options = {
          method: method,
          payload: JSON.stringify(partner),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(partner);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      })
    }
    /**
     * 品目関連
     */
    this.items = {
      /**
       * 一覧取得
       */
      list: (() => {
        const reqUrl = this.baseUrl + 'items';
        const method = 'GET';
        const options = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      }),
      /**
       * 作成
       */
      create: ((partner) => {
        const reqUrl = this.baseUrl + 'items';
        const method = 'POST';
        const options = {
          method: method,
          payload: JSON.stringify(partner),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(partner);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      })
    }
    /**
     * 事業者情報取得
     */
    this.office = {
      /**
       * 一覧取得
       */
      find: (() => {
        const reqUrl = this.baseUrl + 'office';
        const method = 'GET';
        const options = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      }),
    }
  }
  processResponse(method, reqUrl, res) {
    const userLoginId = Session.getActiveUser().getUserLoginId();
    const properties = PropertiesService.getScriptProperties();
    if (res.getResponseCode() === 200 || res.getResponseCode() === 201) {
      const spreadsheetId = properties.getProperty('resLogId');
      if (spreadsheetId) {
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        const sheet = spreadsheet.getSheetByName('logs');
        sheet.appendRow([userLoginId, method, reqUrl, getNow()]);
      }
      Logger.log('Request success.');
      return JSON.parse(res.getContentText());
    } else {
      const spreadsheetId = properties.getProperty('errorLogId');
      if (spreadsheetId) {
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        const sheet = spreadsheet.getSheetByName('logs');
        sheet.appendRow([userLoginId, method, reqUrl, res.getResponseCode(), res.getContentText(), getNow()]);
      }
      throw new Error(`Request Failed !!. ${res.getResponseCode()}: ${res.getContentText()}`)
    }
  }

  getAuthorizationUrl() {
    return this.getService().getAuthorizationUrl();
  }

  getService() {
    return OAuth2.createService('moneyforward')
      .setAuthorizationBaseUrl('https://invoice.moneyforward.com/oauth/authorize')
      .setTokenUrl('https://invoice.moneyforward.com/oauth/token')
      .setClientId(this.clientId)
      .setClientSecret(this.clientSecret)
      .setCallbackFunction('mfCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setScope('write');
  }

  getAccessToken() {
    return this.getService().getAccessToken();
  }

  handleCallback(request) {
    return HtmlService.createHtmlOutput(this.getService().handleCallback(request) ?
      '認証成功しました。このタブを閉じてください。' : '認証に失敗しました。');
  }

  getHeaders() {
    return {
      accept: 'application/json',
      Authorization: 'Bearer ' + this.getAccessToken()
    }
  }

  logout() {
    this.getService().reset();
  }
}
/**
 * クライアントを生成します。
 * @param {string} clientId
 * @param {string} clientSecret
 */
function createClient(clientId = null, clientSecret = null) {
  return new MfInvoiceClient(clientId, clientSecret);
}

function logoutClient(clientId = null, clientSecret = null) {
  createClient(clientId, clientSecret).logout();
}

//テスト用

// function testbillingsList() {
//   Logger.log(createClient().quotes.list());
// }

// function testQuotesList() {
//   Logger.log(createClient().quotes.list());
// }

// function testPartnersList() {
//   Logger.log(createClient().partners.list());
// }

// function testItemList() {
//   Logger.log(createClient().items.list());
// }

// function testSeachBillings() {
//   const page = 1;
//   const query = encodeURI('入金済み');
//   const to = getThisMonthLastDay();
//   let from = new Date();
//   from.setDate(1);
//   from.setHours(0);
//   from.setMinutes(0);
//   from.setSeconds(0);
//   from.setMonth(from.getMonth() - 3);
//   from = convertDateToString(from)
//   Logger.log(JSON.stringify(createClient().billings.search(page, query, from, to)));
// }

// function authorizationUrl() {
//   const client = new MfInvoiceClient();
//   Logger.log(client.getAuthorizationUrl());
// }

// function mfCallback(request) {
//   const client = new MfInvoiceClient();
//   client.handleCallback(request);
// }
