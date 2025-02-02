import CustomSwiper from "./lib/CustomSwiper.js";
import FooterCard from "../../components/footerCard.js";
import HeaderCard from "../../components/headerCard.js";

const el = {
  swiper: null,
  specialSwiper: null,
};

const selector = {
  swiper: ".swiper",
  specialSwiper: "#special-swiper",
};

const params = {};

const handler = {
  clickOnCard: (e) => {
    const id = e.currentTarget.getAttribute("product-id");
    if (!id) return;

    window.location = "/pages/trip.html?id=" + id;
  },
};

const method = {
  isMobile: () => {
    return /Android/i.test(navigator.userAgent)
      ? "android"
      : /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? "ios"
      : !!(
          "ontouchstart" in window ||
          (window.DocumentTouch && document instanceof DocumentTouch)
        );
  },
  getList: async () => {
    try {
      if (!el.specialSwiper) return;
      const response = await fetch("/assets/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const wrapper = document.createElement("div");
      wrapper.classList.add("swiper-wrapper");

      data.forEach((item, index) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.setAttribute("product-id", item.id);
        slide.addEventListener("click", handler.clickOnCard);

        let html = '<div class="product-item">';
        html += '<div class="number">0' + (index + 1) + "</div>";
        html += '<img src="' + item.images[0] + '" class="image" alt="" />';
        html += '<div class="dimmed"></div>';
        html += '<div class="title">';
        html += '<p class="name">' + item.name + "</p>";
        html += '<p class="price">' + item.price.toLocaleString() + "₮</p>";
        html += "</div>";
        html += "</div>";
        slide.innerHTML = html;
        wrapper.appendChild(slide);
      });

      el.specialSwiper.appendChild(wrapper);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};

const setProperty = async () => {
  customElements.define("header-card", HeaderCard);
  customElements.define("footer-card", FooterCard);
  el.swiper = document.querySelectorAll(selector.swiper);
  el.specialSwiper = document.querySelector(selector.specialSwiper);
  await method.getList();
};

const bind = () => {
  el.swiper.forEach((element) => {
    if (element.querySelector(".swiper-wrapper")) {
      new CustomSwiper(element);
    }
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
