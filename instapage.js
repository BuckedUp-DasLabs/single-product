const urlParams = new URLSearchParams(window.location.search);
const origin = window.location.pathname.replace("/", "").replace("/", "");
document.cookie = `offer_id=${origin}; path=/; domain=.buckedup.com;max-age=3600`;
localStorage.setItem("first_page", origin);
const orderID = urlParams.get("order_uuid");

//CHANGE FROM HERE UNTILL COMMENT SAYING TO STOP.

//finish - redirect - post - redirect-finish
//finish will complete the order.
//redirect will redirect to another page (like a modal).
//post will add to the order without finishing.
//redirect-finish will redirect if user buys (modalRedirect), finish if user says no (noThanksRedirect).
const prodType = "post";
const prodID = 620;
const buyButtonIds = ["element-41"];
const noThanksButtonsIds = [];
const finishPostRedirect = `https://www.buckedup.com/extension/misc/upsell/complete?${urlParams}`;
const noThanksRedirect = ``;
const modalRedirect = `https://select.buckedup.com/?time=001&discount=og&open=this&product0=${prodID}&${urlParams}&first_page=${origin}&bypass_shipping_protection=1`;

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
    page_id: "", //OG-LP-OMO, pegar pelo query da url, passar pra frente.
    version_id: "", //v1-control, v2-dropdown, v2-modal
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

const dataLayerBuy = (data) => {
  setDataLayer(
    (event = ""),
    (action = ""),
    (value = data.product.price.slice(1)) //dont change
  );
};

const dataLayerNoThanks = () => {
  setDataLayer((event = ""), (action = ""), (value = 0));
};

//STOP HERE.
dataLayerStart();