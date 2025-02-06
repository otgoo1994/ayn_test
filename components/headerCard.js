import { Notyf } from "https://cdn.jsdelivr.net/npm/notyf/notyf.es.js";
export default class HeaderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const param = {
      count: 0,
      isOpen: false,
    };

    const elm = {
      header: null,
      links: null,
      cartCount: null,
      cart: null,
      logo: null,
      user: null,
      menu: null,
      logout: null,
    };

    const selector = {
      cardCount: "#card-count",
      cart: "#cart",
      logo: ".logo",
      user: "#user",
      menu: "#user-menu",
      logout: "#user-menu li",
    };

    const methods = {
      getCardInfo: () => {
        const items = localStorage.getItem("cart");
        if (!items) {
          param.count = 0;
        } else {
          let count = 0;
          const items = JSON.parse(localStorage.getItem("cart"));
          items.forEach((item) => {
            count += item.total;
          });
          param.count = count;
        }

        elm.cartCount.innerHTML = param.count;
      },
    };

    const handlers = {
      scroller: () => {
        if (!elm.header) return;
        if (document.body.scrollTop === 0) {
          elm.header.classList.remove("top");
        } else {
          elm.header.classList.add("top");
        }
      },
      onClickLink: (e) => {
        const url = e.currentTarget.getAttribute("to");
        if (!url) return;

        window.location = url;
      },
      onClickCart: () => {
        window.location = "/pages/cart.html";
      },
      detectCartCustomEvent: () => {
        let count = 0;
        const items = JSON.parse(localStorage.getItem("cart"));
        items.forEach((item) => {
          count += item.total;
        });
        param.count = count;
        elm.cartCount.innerHTML = param.count;

        const notyf = new Notyf({
          position: {
            x: "right",
            y: "top",
          },
        });
        notyf.success("Амжилттай сагсаллаа!");
      },
      clickOnLogo: () => {
        window.location = "/pages/index.html";
      },
      onCliclUser: () => {
        const user = localStorage.getItem("logged-user");
        if (!user) {
          window.location = "/pages/login.html";
          return;
        }

        if (!param.isOpen) {
          param.isOpen = true;
          elm.menu.classList.add("show");
        } else {
          param.isOpen = false;
          elm.menu.classList.remove("show");
        }
      },
      logOut: () => {
        localStorage.removeItem("logged-user");
        param.isOpen = false;
        elm.menu.classList.remove("show");
      },
    };

    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="../assets/css/header.css" />
    <header ${this.dataset.static && 'class="static"'}>
      <div class="menu">
        <div class="logo">◉ Аян</div>
        <div class="list">
          <table>
            <tr>
              <td class="link" to="/pages/index.html"><p class="title">НҮҮР ХУУДАС</p></td>
              <td class="link"><p class="title">АЯЛАЛ</p></td>
              <td class="link"><p class="title">ЗӨВЛӨГӨӨ</p></td>
              <td class="link"><p class="title">БИДНИЙ ТУХАЙ</p></td>
              <td class="link" to="/pages/contact.html"><p class="title">ХОЛБОО БАРИХ</p></td>
            </tr>
          </table>
        </div>
        <div class="action">
          <div class="item" id="user">
            <i class="fa-solid fa-user"></i>
            <ul class="user-menu" id="user-menu">
              <li>
                Гарах
              </li>
            </ul>
          </div>
          <div class="item" id="cart">
            <i class="fa-solid fa-cart-shopping"></i>
            <div class="cart-count" id="card-count">${param.count}</div>
          </div>
        </div>
      </div>
    </header>
    `;

    const setProperty = () => {
      elm.header = this.shadowRoot.querySelector("header");
      elm.links = this.shadowRoot.querySelectorAll("table td");
      elm.cart = this.shadowRoot.querySelector(selector.cart);
      elm.cartCount = this.shadowRoot.querySelector(selector.cardCount);
      elm.logo = this.shadowRoot.querySelector(selector.logo);
      elm.user = this.shadowRoot.querySelector(selector.user);
      elm.menu = this.shadowRoot.querySelector(selector.menu);
      elm.logout = this.shadowRoot.querySelector(selector.logout);
    };

    const bind = () => {
      window.addEventListener("scroll", handlers.scroller);
      elm.links.forEach((element) => {
        element.addEventListener("click", handlers.onClickLink);
      });

      elm.cart.addEventListener("click", handlers.onClickCart);
      elm.user.addEventListener("click", handlers.onCliclUser);
      elm.logo.addEventListener("click", handlers.clickOnLogo);
      elm.logout.addEventListener("click", handlers.logOut);

      methods.getCardInfo();
      window.addEventListener(
        "cartCustomEvent",
        handlers.detectCartCustomEvent
      );
    };

    const init = () => {
      setProperty();
      bind();
    };

    init();
  }

  connectedCallback() {}
}
