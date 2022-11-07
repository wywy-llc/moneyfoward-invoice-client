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
      })
    }
    /**
     * 取引先関連
     */
    this.partners = {
      /**
       * 一覧取得
       */
      list: (() => {
        const reqUrl = this.baseUrl + 'partners';
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
      Logger.log(`Request Failed !!. ${res.getResponseCode()}: ${res.getContentText()}`);
      return res;
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
}
/**
 * クライアントを生成します。
 * @param {string} clientId
 * @param {string} clientSecret
 */
function createClient(clientId = null, clientSecret = null) {
  return new MfInvoiceClient(clientId, clientSecret);
}

function testbillingsList() {
  Logger.log(createClient().quotes.list());
}

function testQuotesList() {
  Logger.log(createClient().quotes.list());
}

function testPartnersList() {
  Logger.log(createClient().partners.list());
}

function testItemList(){
  Logger.log(createClient().items.list());
}