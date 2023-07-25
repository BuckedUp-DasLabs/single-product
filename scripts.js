const toggleButton = (buttons) => {
  buttons.forEach((buttonID) => {
    let button = document.getElementById(buttonID);
    button.classList.toggle("btn-lock");
    button.toggleAttribute("disabled");
  });
};

const fetchProduct = async (productID) => {
  try {
    const response = await fetch(
      `https://ar5vgv5qw5.execute-api.us-east-1.amazonaws.com/list/${productID}`
    );
    const responseLog = await response.json()
    console.log(responseLog)
    const data = await response.json();
    return data;
  } catch {
    console.log(responseLog)
    window.location.href = finishPostRedirect;
  }
};

const postApi = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseLog = await response.json();
    console.log(responseLog)
    return responseLog;
  } catch {
    return false;
  }
};

const fetchURL = `https://ar5vgv5qw5.execute-api.us-east-1.amazonaws.com/upsell/${orderID}`;
const fetchURLfinal = `https://ar5vgv5qw5.execute-api.us-east-1.amazonaws.com/upsell/${orderID}/finish`;
const buy = async (dataArray) => {
  const body = { order_uuid: orderID, items: [] };
  prodIdArray.forEach((prodID) => {
    const item = {};
    item.product_id = prodID;
    item.quantity = 1;
    item.options = {};
    body.items.push(item);
  });
  const response = await postApi(fetchURL, body);
  console.log(response);
  if (!response) window.location.href = finishPostRedirect;
  if (prodType === "finish") {
    const response = await postApi(fetchURLfinal, null);
    console.log(response);
    if (!response) window.location.href = finishPostRedirect;
  }
  let finalPrice = 0;
  dataArray.forEach((data) => {
    finalPrice += parseFloat(data.product.price.slice(1));
  });
  dataLayerBuy(`${finalPrice}`);
  window.location.href = finishPostRedirect;
};

let dataArray = [];

if (prodType === "post" || prodType === "finish") {
  toggleButton(buyButtonIds);
  window.onload = async () => {
    for (let prodID of prodIdArray) {
      let newData = await fetchProduct(prodID);
      dataArray.push(newData);
    }
    toggleButton(buyButtonIds);
  };
  buyButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => {
      buy(dataArray);
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
      if (!response) window.location.href = finishPostRedirect;
    }
    window.location.href = noThanksRedirect;
  });
});
