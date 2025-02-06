import CustomSwiper from "./lib/CustomSwiper.js";

const el = {
  swiper: null,
  cartSwiper: null,
  subContent: null,
  submit: null,
  tripName: null,
  tripPrice: null,
  days: null,
  tripReviews: null,
  agenReviews: null,
};

const selector = {
  swiper: ".swiper",
  cartSwiper: "#cart-swiper",
  subContent: "#sub-content > .about",
  submit: "#submit",
  tripName: "#trip-name",
  tripPrice: "#trip-price",
  days: ".days",
  tripReviews: ".main .fa-solid.fa-star",
  agenReviews: ".sub .fa-solid.fa-star",
};

const params = {
  productId: null,
  selectedTrip: null,
  tripReview: 0,
  agentReview: 0,
  agentReviewList: null,
  tripReviewList: null,
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
  getRateValue: () => {
    let html = "";
    if (!params.agentReviewList) {
      for (let i = 0; i < 5; i++) {
        html += '<i class="fa-solid fa-star" data-value="' + (i + 1) + '"></i>';
      }
      return html;
    }
    const exist = params.agentReviewList.find(
      (element) => element.name == params.selectedTrip.guide.name
    );

    if (!exist) {
      for (let i = 0; i < 5; i++) {
        html += '<i class="fa-solid fa-star" data-value="' + (i + 1) + '"></i>';
      }
      return html;
    }

    for (let i = 0; i < 5; i++) {
      html +=
        '<i class="fa-solid fa-star ' +
        (i + 1 <= exist.rate ? "active" : "") +
        '" data-value="' +
        (i + 1) +
        '"></i>';
    }

    return html;
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
          ${method.getRateValue("agent")}
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
  initReviewToTrip: () => {
    if (!params.tripReviewList) return;
    const exist = params.tripReviewList.find(
      (element) => element.id == params.selectedTrip.id
    );
    if (!exist) return;

    el.tripReviews.forEach((element, index) => {
      if (index + 1 <= exist.rate) {
        element.classList.add("active");
      }
    });
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

    if (isOpen == "false") {
      element.classList.add("show");
      element.setAttribute("isopen", true);
    } else {
      element.classList.remove("show");
      element.setAttribute("isopen", false);
    }
  },
  clickOnStar: (e, type) => {
    const value = e.currentTarget.getAttribute("data-value");

    if (type == "trip") {
      params.tripReview = value;

      if (params.tripReviewList) {
        const exist = params.tripReviewList.find(
          (element) => element.id == params.selectedTrip.id
        );
        if (!exist) {
          params.tripReviewList.push({
            id: params.selectedTrip.id,
            rate: value,
          });
        } else {
          params.tripReviewList.forEach((element) => {
            if (element.id == params.selectedTrip.id) {
              element.rate = value;
            }
          });
        }
      } else {
        params.tripReviewList = [
          {
            id: params.selectedTrip.id,
            rate: value,
          },
        ];
      }
      localStorage.setItem(
        "trip-reviews",
        JSON.stringify(params.tripReviewList)
      );
      return;
    }

    params.agentReview = value;
    if (params.agentReviewList) {
      const exist = params.agentReviewList.find(
        (element) => element.name == params.selectedTrip.guide.name
      );
      if (!exist) {
        params.agentReviewList.push({
          name: params.selectedTrip.guide.name,
          rate: value,
        });
      } else {
        params.agentReviewList.forEach((element) => {
          if (element.name == params.selectedTrip.guide.name) {
            element.rate = value;
          }
        });
      }
    } else {
      params.agentReviewList = [
        {
          name: params.selectedTrip.guide.name,
          rate: value,
        },
      ];
    }

    localStorage.setItem(
      "agent-reviews",
      JSON.stringify(params.agentReviewList)
    );
  },
  mouseEnterOnStar: (e, type) => {
    const value = e.currentTarget.getAttribute("data-value");

    if (type == "trip") {
      el.tripReviews.forEach((s) => s.classList.remove("active"));
      for (let i = 0; i < value; i++) {
        el.tripReviews[i].classList.add("active");
      }
      return;
    }

    el.agenReviews.forEach((s) => s.classList.remove("active"));
    for (let i = 0; i < value; i++) {
      el.agenReviews[i].classList.add("active");
    }
  },
  mouseOutFromStar: (e, type) => {
    if (type == "trip") {
      el.tripReviews.forEach((s) => s.classList.remove("active"));
      for (let i = 0; i < params.tripReview; i++) {
        el.tripReviews[i].classList.add("active");
      }
      return;
    }

    el.agenReviews.forEach((s) => s.classList.remove("active"));
    for (let i = 0; i < params.agentReview; i++) {
      el.agenReviews[i].classList.add("active");
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

  params.agentReviewList = localStorage.getItem("agent-reviews")
    ? JSON.parse(localStorage.getItem("agent-reviews"))
    : null;

  params.tripReviewList = localStorage.getItem("trip-reviews")
    ? JSON.parse(localStorage.getItem("trip-reviews"))
    : null;

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
  await method.initSubContent();

  el.tripReviews = document.querySelectorAll(selector.tripReviews);
  el.agenReviews = document.querySelectorAll(selector.agenReviews);

  method.initReviewToTrip();
};

const bind = () => {
  el.swiper.forEach((element) => {
    new CustomSwiper(element);
  });

  el.submit.addEventListener("click", handler.submit);
  el.days.forEach((element) => {
    element.addEventListener("click", handler.clickOnDays);
  });

  el.tripReviews.forEach((element) => {
    element.addEventListener("click", (e) => handler.clickOnStar(e, "trip"));
    element.addEventListener("mouseenter", (e) =>
      handler.mouseEnterOnStar(e, "trip")
    );
    element.addEventListener("mouseout", (e) =>
      handler.mouseOutFromStar(e, "trip")
    );
  });

  el.agenReviews.forEach((element) => {
    element.addEventListener("click", (e) => handler.clickOnStar(e, "agent"));
    element.addEventListener("mouseenter", (e) =>
      handler.mouseEnterOnStar(e, "agent")
    );
    element.addEventListener("mouseout", (e) =>
      handler.mouseOutFromStar(e, "agent")
    );
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
