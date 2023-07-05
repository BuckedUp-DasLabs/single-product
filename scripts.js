let cookieString = ''
Object.keys(cookies).forEach(key=>{
  cookieString = `${cookieString}${key}=${cookies[key]}; `
})
document.cookie = cookieString

const toggleButton = (buttons) => {
  buttons.forEach((buttonID) => {
    let button = document.getElementById(buttonID);
    button.classList.toggle("btn-lock");
    button.toggleAttribute("disabled");
  });
};

const fetchProduct = async (productID) => {
  const response = await fetch(
    `https://ar5vgv5qw5.execute-api.us-east-1.amazonaws.com/list/${productID}`
  );
  const data = await response.json();
  if (!response.ok) {
    console.log("Error Fetching API");
    console.log(data);
    return null;
  }
  return data;
};

const postApi = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const responseLog = await response.json();
  if (!response.ok) {
    alert("There was a problem with your request. Please try again later.");
    return false;
  }
  return responseLog;
};

const fetchURL = `https://ar5vgv5qw5.execute-api.us-east-1.amazonaws.com/upsell/${orderID}`;
const fetchURLfinal = `https://ar5vgv5qw5.execute-api.us-east-1.amazonaws.com/upsell/${orderID}/finish`;
const buy = async (data) => {
  const body = { order_uuid: orderID, items: [] };
  const item = {};
  item.product_id = prodID;
  item.quantity = 1;
  item.options = {};
  body.items.push(item);

  const response = await postApi(fetchURL, body);
  console.log(response);
  if (!response) return;
  if (prodType === "finish") {
    const response = await postApi(fetchURLfinal, null);
    console.log(response);
    if (!response) return;
  }
  dataLayerBuy(data);
  window.location.href = finishPostRedirect;
};

let data = null;

if (prodType === "post" || prodType === "finish") {
  toggleButton(buyButtonIds);
  window.onload = async () => {
    data = await fetchProduct(prodID);
    if (data == null) {
      alert("There was a problem with your request.");
      return;
    }
    toggleButton(buyButtonIds);
  };
  buyButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => {
      buy(data);
    });
  });
} else {
  buyButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => {
      dataLayerRedirect();
      window.location.href = modalRedirect;
    });
  });
}
noThanksButtonsIds.forEach((id) => {
  const btn = document.getElementById(id);
  btn?.addEventListener("click", async () => {
    dataLayerNoThanks();
    if (prodType === "redirect-finish") {
      const response = await postApi(fetchURLfinal, null);
      console.log(response);
      if (!response) return;
    }
    window.location.href = noThanksRedirect;
  });
});

