const urlParams = new URLSearchParams(window.location.search);
const origin = window.location.pathname.replace("/", "").replace("/", "");
localStorage.setItem("first_page", origin);
const orderID = urlParams.get("order_uuid");

//CHANGE FROM HERE UNTILL COMMENT SAYING TO STOP.
const prodIdArray = [620, 999];

//finish - redirect - post - redirect-finish
const prodType = "redirect";
const isLP = false;
const page_id = ""; //OG-LP-OMO
const version_id = ""
const cookies = [{ page_id: page_id }, { offer_id: origin }, {version_id: version_id}];

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
const noThanksButtonsIds = [];
const finishPostRedirect = `https://www.buckedup.com/extension/misc/upsell/complete?${urlParams}`;
const noThanksRedirect = ``;
const modalRedirect = `https://select.buckedup.com/?time=001&discount=og&open=this&${urlParams}&first_page=${origin}&bypass_shipping_protection=1`;

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

const setDataLayer = (event, action, value) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    step_count: "", //lp, us1, us2, us3, ds1, ty
    page_id: page_id, //OG-LP-OMO,
    version_id: version_id, //v1-control, v2-dropdown, v2-modal
    event: event, //offer_view, interaction
    action: action, //purchase, purchase-us, click, view_page
    value: value, //final purchase value
    transaction_id: orderID,
  });
};

const dataLayerStart = () => {
  setDataLayer((event = ""), (action = ""), (value = 0));
};

const dataLayerRedirect = () => {
  setDataLayer((event = ""), (action = ""), (value = 0));
};

const dataLayerBuy = (price) => {
  setDataLayer(
    (event = ""),
    (action = ""),
    (value = price) //dont change
  );
};

const dataLayerNoThanks = () => {
  setDataLayer((event = ""), (action = ""), (value = 0));
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
