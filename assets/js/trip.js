import CustomSwiper from "./lib/CustomSwiper.js";

const el = {
  swiper: null,
  cartSwiper: null,
  subContent: null,
  submit: null,
  tripName: null,
  tripPrice: null,
  days: null,
};

const selector = {
  swiper: ".swiper",
  cartSwiper: "#cart-swiper",
  subContent: "#sub-content > .about",
  submit: "#submit",
  tripName: "#trip-name",
  tripPrice: "#trip-price",
  days: ".days",
};

const params = {
  productId: null,
  selectedTrip: null,
};

const method = {
  getTrip: async () => {
    try {
      if (!el.cartSwiper) return;
      const response = await fetch("/assets/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const selected = data.find(
        (item) => item.id === Number(params.productId)
      );

      if (!selected) {
        window.location = "/pages/index.html";
        return;
      }

      params.selectedTrip = selected;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  initSwiper: async () => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("swiper-wrapper");

    const pagination = document.createElement("div");
    pagination.classList.add("swiper-pagination");

    params.selectedTrip.images.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      let html = '<img src="' + item + '" class="image" alt="" />';
      slide.innerHTML = html;
      wrapper.appendChild(slide);
    });

    el.cartSwiper.appendChild(wrapper);
    el.cartSwiper.appendChild(pagination);
  },
  initSubContent: async () => {
    if (!el.subContent) return;

    el.subContent.innerHTML = `
      <div class="name">
        <div class="profile">
          <img
            src="${params.selectedTrip.guide.image}"
            alt=""
          />
        </div>
        <div class="description">
        ${params.selectedTrip.guide.name}
          <div class="rating">
            <i class="fa-solid fa-star" style="color: #ffd43b"></i>
            <i class="fa-solid fa-star" style="color: #ffd43b"></i>
            <i class="fa-solid fa-star" style="color: #ffd43b"></i>
            <i class="fa-solid fa-star" style="color: #ffd43b"></i>
            <i class="fa-solid fa-star" style="color: #ffd43b"></i>
          </div>
        </div>
      </div>

      <div class="experience">
        <div>Ажлын туршлага</div>
        <div>Хариуцдаг аялалууд</div>
      </div>
    `;

    el.tripName.innerHTML = params.selectedTrip.name;
    el.tripPrice.innerHTML = `${params.selectedTrip.night} шөнө ${
      params.selectedTrip.day
    } өдөр <span>${params.selectedTrip.price.toLocaleString()}₮</span>`;
  },
  sendCustomEvent: () => {
    const event = new CustomEvent("cartCustomEvent");
    window.dispatchEvent(event);
  },
};

const handler = {
  submit: (e) => {
    const items = localStorage.getItem("cart");
    if (!items) {
      localStorage.setItem(
        "cart",
        JSON.stringify([{ total: 1, item: params.selectedTrip }])
      );
      method.sendCustomEvent();
      return;
    }

    const item = JSON.parse(items);
    const f = item.find((item) => item.item.id === params.selectedTrip.id);
    if (!f) {
      item.push({ total: 1, item: params.selectedTrip });
      localStorage.setItem("cart", JSON.stringify(item));
      method.sendCustomEvent();
      return;
    }

    const updated = item.map((itm) =>
      itm.item.id === params.selectedTrip.id
        ? { ...itm, total: (itm.total += 1) }
        : itm
    );

    localStorage.setItem("cart", JSON.stringify(updated));
    method.sendCustomEvent();
  },
  clickOnDays: (e) => {
    const index = e.currentTarget.getAttribute("day");
    if (!index) {
      return;
    }

    const element = document.querySelector('[for="' + index + '"]');
    if (!element) return;

    const isOpen = element.getAttribute("isopen");
    console.log(isOpen);

    if (isOpen == "false") {
      element.classList.add("show");
      element.setAttribute("isopen", true);
    } else {
      element.classList.remove("show");
      element.setAttribute("isopen", false);
    }
  },
};

const setProperty = async () => {
  const url = new URL(window.location.href);
  const param = new URLSearchParams(url.search);

  if (!param.get("id")) {
    window.location = "/pages/index.html";
    return;
  }

  params.productId = param.get("id");
  el.swiper = document.querySelectorAll(selector.swiper);
  el.cartSwiper = document.querySelector(selector.cartSwiper);
  el.subContent = document.querySelector(selector.subContent);
  el.submit = document.querySelector(selector.submit);
  el.tripName = document.querySelector(selector.tripName);
  el.tripPrice = document.querySelector(selector.tripPrice);
  el.days = document.querySelectorAll(selector.days);

  await method.getTrip();
  await method.initSwiper();

  method.initSubContent();
};

const bind = () => {
  el.swiper.forEach((element) => {
    new CustomSwiper(element);
  });

  el.submit.addEventListener("click", handler.submit);
  el.days.forEach((element) => {
    element.addEventListener("click", handler.clickOnDays);
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
