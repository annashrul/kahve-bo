/*****************
 * isLading
*****************/
export const LOADING = {
  IS_LOADING: "IS_LOADING"
}

/****************
      TOKEN
*****************/
export const TOKEN = {
  GET: "GET_TOKEN"
}

export const NOTIF_ALERT = {
    SUCCESS: "Data has been saved",
    FAILED: "Data failed to saved",
    CHECKING : "System is checking the data",
    NO_DATA: "https://www.mediseller.com/front_assets/img/search.png"
}

export const HEADERS ={
  // URL: atob(document.getElementById("hellyeah").value),
  URL       : "http://192.168.100.10:3010/",
  // URL       : "https://kahvebit.com:2096/",
  TOKEN     : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwY2RiN2M5OC0wNWNmLTQ4NDgtOGM3Yy0yZTFiYTczZGUwNmYiLCJpYXQiOjE1NzAxNzM0ODYsImV4cCI6MTU3MDc3ODI4Nn0.1NiWtt2luG83am8FJSvWpL5p35Oxd8GSJJTwhFmAdgw",
  USERNAME  : "netindo",
  PASSWORD  : "$2b$08$hLMU6rEvNILCMaQbthARK.iCmDRO7jNbUB8CcvyRStqsHD4UQxjDO"
}

/****************
      PASSWORD MODAL ADD LOCATION
*****************/
export const LOC_VERIF ={
  password: "bmV0aW4xMjM0YSE="
}

/****************
      MODAL
*****************/
export const MODALS = {
  IS_MODAL_OPEN: 'IS_MODAL_OPEN',
  MODAL_TYPE : 'MODAL_TYPE'
}

/****************
      AUTH
*****************/
export const AUTH = {
  FETCH_DATAS:'FETCH_DATAS',
  GET_ERRORS:'GET_ERRORS',
  TEST_DISPATCH:'TEST_DISPATCH',
  SET_CURRENT_USER:'SET_CURRENT_USER',
  SET_LOGGED_USER:'SET_LOGGED_USER'
}
export const REGISTER = {
  PROCESS: 'SET_REGISTER_PROCESS',
  SUCCESS: 'SET_REGISTER_SUCCESS',
  FAILED: 'SET_REGISTER_FAILED',
  SETEMAIL: 'SET_EMAIL',
}
/****************
 COMPANY
 *****************/
export const COMPANY = {
    LOADING_GET: 'SET_COMPANY_LOADING_GET',
    SUCCESS_GET: 'SUCCESS_COMPANY_GET',
    FAILED_GET: 'FAILED_COMPANY_GET',
    LOADING_POST: 'SET_COMPANY_LOADING_POST',
    SUCCESS_POST: 'SUCCESS_COMPANY_POST',
    FAILED_POST: 'FAILED_COMPANY_POST',
}

/****************
    USERS MEMBER
*****************/
export const USER_MEMBER = {
  LOADING: 'SET_USER_MEMBER_LOADING',
  LOADING_POST: 'SET_USER_MEMBER_LOADING_POST',
  LOADING_DETAIL: 'SET_USER_MEMBER_LOADING_DETAIL',
  LOADING_SEND: 'SET_USER_MEMBER_LOADING_SEND',
  IS_ERROR: 'SET_USER_MEMBER_IS_ERROR',
  SUCCESS: 'SUCCESS_USER_MEMBER',
  SUCCESS_ALL: 'SUCCESS_ALL_USER_MEMBER',
  FAILED: 'FAILED_USER_MEMBER',
  DETAIL: 'DETAIL_USER_MEMBER',
  EDIT: 'EDIT_USER_MEMBER'
}

/****************
 USERS ADMIN
 *****************/
export const USER_ADMIN = {
    LOADING: 'SET_USER_ADMIN_LOADING',
    LOADING_POST: 'SET_USER_ADMIN_LOADING_POST',
    LOADING_DETAIL: 'SET_USER_ADMIN_LOADING_DETAIL',
    LOADING_SEND: 'SET_USER_ADMIN_LOADING_SEND',
    IS_ERROR: 'SET_USER_ADMIN_IS_ERROR',
    SUCCESS: 'SUCCESS_USER_ADMIN',
    SUCCESS_ALL: 'SUCCESS_ALL_USER_ADMIN',
    FAILED: 'FAILED_USER_ADMIN',
    DETAIL: 'DETAIL_USER_ADMIN',
    EDIT: 'EDIT_USER_ADMIN'
}

/****************
 DASHBOARD
 *****************/
export const DASHBOARD = {
  LOADING: 'SET_DASHBOARD_LOADING',
  SUCCESS: 'SET_DASHBOARD_SUCCESS',
  SUCCESS_NEWEST: 'SET_DASHBOARD_SUCCESS_NEWEST',
  FAILED: 'SET_DASHBOARD_FAILED',
  DETAIL: 'SET_DASHBOARD_DETAIL',
  POST_LOADING: 'SET_DASHBOARD_POST_LOADING'
}


/****************
 SITE SECTION
 *****************/
export const SITE = {
  LOADING: 'SET_SITE_LOADING',
  SUCCESS: 'SET_SITE_SUCCESS',
  SUCCESS_LIST: 'SET_SITE_SUCCESS_LIST',
  SUCCESS_FOLDER: 'SET_SITE_SUCCESS_FOLDER',
  SUCCESS_TABLES: 'SET_SITE_SUCCESS_TABLES',
  FAILED: 'SET_SITE_FAILED',
  DETAIL: 'SET_SITE_DETAIL',
  SUCCESS_CHECK: 'SET_SITE_SUCCESS_CHECK',
  TRIGGER_ECAPS: 'SET_TRIGGER_ECAPS',
  DOWNLOAD_TXT: 'SET_DOWNLOAD_TXT',
  TRIGGER_MOBILE_ECAPS: 'SET_TRIGGER_MOBILE_ECAPS'
}
/****************
 COIN TYPE
 *****************/
export const COIN_TYPE = {
    LOADING: 'SET_COIN_TYPE_LOADING',
    LOADING_POST: 'SET_COIN_TYPE_LOADING_POST',
    IS_ERROR: 'SET_COIN_TYPE_IS_ERROR',
    SUCCESS: 'SUCCESS_COIN_TYPE',
    FAILED: 'FAILED_COIN_TYPE',
    DETAIL: 'DETAIL_COIN_TYPE',
    EDIT: 'EDIT_COIN_TYPE'
}
/****************
 FAQ
 *****************/
export const FAQ = {
    LOADING: 'SET_FAQ_LOADING',
    LOADING_POST: 'SET_FAQ_LOADING_POST',
    IS_ERROR: 'SET_FAQ_IS_ERROR',
    SUCCESS: 'SUCCESS_FAQ',
    FAILED: 'FAILED_FAQ',
    DETAIL: 'DETAIL_FAQ',
    EDIT: 'EDIT_FAQ'
}
/****************
 CONTACT US
 *****************/
export const INBOX = {
    LOADING: 'SET_INBOX_LOADING',
    LOADING_POST: 'SET_INBOX_LOADING_POST',
    IS_ERROR: 'SET_INBOX_IS_ERROR',
    SUCCESS: 'SUCCESS_INBOX',
    FAILED: 'FAILED_INBOX',
    DETAIL: 'DETAIL_INBOX',
    EDIT: 'EDIT_INBOX'
}
/****************
 DEPOSIT
 *****************/
export const DEPOSIT = {
    LOADING: 'SET_DEPOSIT_LOADING',
    LOADING_POST: 'SET_DEPOSIT_LOADING_POST',
    IS_ERROR: 'SET_DEPOSIT_IS_ERROR',
    SUCCESS: 'SUCCESS_DEPOSIT',
    FAILED: 'FAILED_DEPOSIT',
    DETAIL: 'DETAIL_DEPOSIT',
    CONFIG: 'CONFIG_DEPOSIT'
}
/****************
 DEPOSIT
 *****************/
export const PENARIKAN = {
    LOADING: 'SET_PENARIKAN_LOADING',
    LOADING_POST: 'SET_PENARIKAN_LOADING_POST',
    IS_ERROR: 'SET_PENARIKAN_IS_ERROR',
    SUCCESS: 'SUCCESS_PENARIKAN',
    FAILED: 'FAILED_PENARIKAN',
    DETAIL: 'DETAIL_PENARIKAN',
    EDIT: 'EDIT_PENARIKAN'
}
/****************
 PENGATURAN
 *****************/
export const PENGATURAN = {
    LOADING: 'SET_PENGATURAN_LOADING',
    LOADING_POST: 'SET_PENGATURAN_LOADING_POST',
    IS_ERROR: 'SET_PENGATURAN_IS_ERROR',
    SUCCESS: 'SUCCESS_PENGATURAN',
    FAILED: 'FAILED_PENGATURAN',
    DETAIL: 'DETAIL_PENGATURAN',
    EDIT: 'EDIT_PENGATURAN'
}
/****************
 TRANSACTION
 *****************/
export const TRANSACTION = {
    LOADING: 'SET_TRANSACTION_LOADING',
    LOADING_POST: 'SET_TRANSACTION_LOADING_POST',
    IS_ERROR: 'SET_TRANSACTION_IS_ERROR',
    SUCCESS: 'SUCCESS_TRANSACTION',
    CHECKING_GET: 'CHECKING_GET_TRANSACTION',
    CHECKING_POST: 'CHECKING_POST_TRANSACTION',
    LOADING_CHECKING_POST: 'LOADING_CHECKING_POST',
    FAILED: 'FAILED_TRANSACTION',
    DETAIL: 'DETAIL_TRANSACTION',
    EDIT: 'EDIT_TRANSACTION'
}

/****************
 LOG
 *****************/
export const LOG = {
    LOADING_LOG_ACTIVITY    : 'LOADING_LOG_ACTIVITY',
    LOADING_LOG_AUTH        : 'LOADING_LOG_AUTH',
    LOADING_LOG_TRANSACTION : 'LOADING_LOG_TRANSACTION',

    SUCCESS_LOG_ACTIVITY    : 'SUCCESS_LOG_ACTIVITY',
    SUCCESS_LOG_AUTH        : 'SUCCESS_LOG_AUTH',
    SUCCESS_LOG_TRANSACTION : 'SUCCESS_LOG_TRANSACTION',

    FAILED_LOG_ACTIVITY     : 'FAILED_LOG_ACTIVITY',
    FAILED_LOG_AUTH         : 'FAILED_LOG_AUTH',
    FAILED_LOG_TRANSACTION  : 'FAILED_LOG_TRANSACTION',
}
