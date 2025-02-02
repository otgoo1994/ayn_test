const el = {
  content: null,
  total: null,
  totalPrice: null,
  remove: null,
};

const selector = {
  content: "#content",
  total: "#total-count",
  totalPrice: "#total-price",
  remove: ".fa-solid.fa-xmark",
};

const params = {};

const handler = {
  removeItem: (e) => {
    const id = e.currentTarget.getAttribute("product-id");
    if (!id) return;

    let items = localStorage.getItem("cart");
    if (!items) return;

    items = JSON.parse(items);
    items = items.filter((item) => item.item.id != id);

    localStorage.setItem("cart", JSON.stringify(items));
    method.initContent();
  },
};

const method = {
  initContent: async () => {
    if (!el.content) return;
    let items = localStorage.getItem("cart");
    items = JSON.parse(items);
    let html = "";
    let total = 0;
    let totalPrice = 0;
    items.forEach((item) => {
      html += `
      <div class="product">
        <img
          src="${item.item.images[0]}"
          alt=""
        />
        <div class="description">
          <p class="name">Bustier, Calvin Klein Underwear</p>
          <p class="quantity">Qty: <span class="count">${
            item.total
          }</span> X ${item.item.price.toLocaleString()}</p>
        </div>
        <i class="fa-solid fa-xmark" product-id="${item.item.id}"></i>
      </div>
      `;

      total += item.total;
      totalPrice += item.total * item.item.price;
    });

    el.total.innerHTML = total.toLocaleString();
    el.totalPrice.innerHTML = totalPrice.toLocaleString() + "₮";

    el.content.innerHTML = html;
    el.remove = document.querySelectorAll(selector.remove);
  },
  sendCustomEvent: () => {
    const event = new CustomEvent("cartCustomEvent");
    window.dispatchEvent(event);
  },
};

const setProperty = async () => {
  el.content = document.querySelector(selector.content);
  el.total = document.querySelector(selector.total);
  el.totalPrice = document.querySelector(selector.totalPrice);
  await method.initContent();
};

const bind = () => {
  // el.submit.addEventListener("click", handler.submit);
  el.remove.forEach((element) => {
    element.addEventListener("click", handler.removeItem);
  });
};

const contentReady = async () => {
  await setProperty();
  bind();
};

const checkState = () => {
  return document.readyState === "complete";
};

let loader = null;
"loading" === document.readyState
  ? (loader = setInterval(() => {
      checkState() ? (clearInterval(loader), contentReady()) : null;
    }, 100))
  : contentReady();
