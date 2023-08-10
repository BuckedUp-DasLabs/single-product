if(isLP && prodType === "redirect"){
  modalRedirect = modalRedirect + "&clear=true"
}

const toggleButton = (buttons) => {
  buttons.forEach((buttonID) => {
    let button = document.getElementById(buttonID);
    button.classList.toggle("btn-lock");
    button.toggleAttribute("disabled");
  });
};

const fetchProduct = async (productID) => {
  let url = `https://h03ygoadc1.execute-api.us-east-1.amazonaws.com/list/${productID}`
  try {
    if (country) url = url + `?country=${country}`
  } catch { }
  try {
    const response = await fetch(url);
    if (response.status == 500 || response.status == 400)
      window.location.href = "https://buckedup.com"
    if (!response.ok) {
      throw new Error("Api Fetch Error.")
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alert("Product not found.")
    console.log(error);
    return null;
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
    if (response.status == 500 || response.status == 400)
      window.location.href = "https://buckedup.com"
    if (!response.ok) {
      throw new Error("Api Post Error.")
    }
    return responseLog;
  } catch (error) {
    console.log(error)
    return false;
  }
};

const fetchURL = `https://h03ygoadc1.execute-api.us-east-1.amazonaws.com/upsell/${orderID}`;
const fetchURLfinal = `https://h03ygoadc1.execute-api.us-east-1.amazonaws.com/upsell/${orderID}/finish`;
const buy = async (dataArray) => {
  toggleButton(buyButtonIds);
  const body = { order_uuid: orderID, items: [] };
  try {
    if (country) body["country"] = country
  } catch { }
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
  let currency = dataArray[0].product.price.match(/([A-Za-z]+)? ?\$(\d+\.\d+)/)[1] || "USD"
  dataArray.forEach((data) => {
    const formatted = data.product.price.match(/([A-Za-z]+)? ?\$(\d+\.\d+)/);
    const currentPrice = formatted[2]
    finalPrice += parseFloat(currentPrice)
  });
  dataLayerBuy(finalPrice.toFixed(2), currency);
  window.location.href = finishPostRedirect;
};

let dataArray = [];

if (prodType === "post" || prodType === "finish") {
  toggleButton(buyButtonIds);
  window.onload = async () => {
    for (let prodID of prodIdArray) {
      let newData = await fetchProduct(prodID);
      if (newData == null)
        return;
      dataArray.push(newData);
    }
    toggleButton(buyButtonIds);
  };
  buyButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => {
      buy(dataArray);
    },{once : true});
  });
} else {
  buyButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => {
      dataLayerRedirect();
      window.location.href = modalRedirect;
    },{once : true});
  });
}
noThanksButtonsIds.forEach((id) => {
  const btn = document.getElementById(id);
  btn?.addEventListener("click", async () => {
    dataLayerNoThanks();
    if (prodType === "redirect-finish") {
      toggleButton(noThanksButtonsIds);
      const response = await postApi(fetchURLfinal, null);
      console.log(response);
      if (!response) window.location.href = noThanksRedirect;
    }
    window.location.href = noThanksRedirect;
  },{once: true});
});
