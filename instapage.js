const urlParams = new URLSearchParams(window.location.search);
const origin = window.location.pathname.replace("/", "").replace("/", "");
localStorage.setItem("first_page", origin);
const orderID = urlParams.get("order_uuid");

//CHANGE FROM HERE UNTILL COMMENT SAYING TO STOP.
const prodIdArray = [1066];
// const country = "ca"

//finish - redirect - post - redirect-finish
const prodType = "post";
const isLP = true;
const page_id = ""; //OG-LP-OMO
const cookies = [{ page_id: page_id }, { offer_id: origin }];

urlParams.set("step_count", "");
urlParams.set("step_code", "");
urlParams.set("from", "");
urlParams.set("to", "");
if (isLP) urlParams.set("utm_source", "");

// DONT CHANGE
let i = 0;
if (prodType === "redirect" || prodType === "redirect-finish") {
  for (id of prodIdArray) {
    urlParams.set(`product${i}`, id);
    i++;
  }
}

//CHANGE FROM HERE UNTILL COMMENT SAYING TO STOP.

const buyButtonIds = ["element-41"];
const noThanksButtonsIds = ["element-36"];
const finishPostRedirect = `https://www.buckedup.com/extension/misc/upsell/complete?${urlParams}`;
const noThanksRedirect = ``;
let modalRedirect = `https://www.buckedup.com/cart/add?product_id=988&cc=bbfb1&${urlParams}&first_page=${origin}&bypass_shipping_protection=1`;

//OFFER STEP:
// Offer Page: lp
// Upsell 1: us1
// Upsell 2: us2
// Downsell: ds1
// Final page: fu

// ACTION:
// when user buys on Landing Page: purchase
// when user buys on Upsell or Downsell or Final page: purchase-us
// any other action: click

const setDataLayer = (event, action, value, currency=undefined) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    step_count: "", //lp, us1, us2, us3, ds1, ty
    page_id: page_id, //OG-LP-OMO,
    version_id: "", //v1-control, v2-dropdown, v2-modal
    event: event, //offer_view, interaction
    action: action, //purchase, purchase-us, click, view_page
    value: value, //final purchase value
    currency: currency,
    transaction_id: orderID,
  });
};

const dataLayerStart = () => {
  setDataLayer((event = "pageview"), (action = "load"), (value = 0));
};

const dataLayerRedirect = () => {
  setDataLayer((event = "offerview"), (action = "viewaction"), (value = 0));
};

const dataLayerBuy = (price, currentCurrency) => {
  setDataLayer(
    (event = "interaction"),
    (action = "purchase"),
    (value = price), //dont change
    (currency = currentCurrency),
  );
};

const dataLayerNoThanks = () => {
  setDataLayer((event = "interaction"), (action = "click"), (value = 0));
};

//STOP HERE.

const cookieSettings = "; path=/; domain=.buckedup.com;max-age=3600";

cookies.forEach((cookie) => {
  let cookieString = "";
  Object.keys(cookie).forEach((key) => {
    cookieString = `${key}=${cookie[key]}`;
  });
  cookieString = cookieString + cookieSettings;
  document.cookie = cookieString;
});

dataLayerStart();
