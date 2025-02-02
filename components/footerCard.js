export default class FooterCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="../assets/css/footer.css" />
    <div class="footer">
      <div class="footer-body">
        <div class="footer-logo">
          <div class="ayn">◉ АЯН</div>
        </div>
        <div class="links">
          <div class="body">
            <div class="link-list">
              <ul>
                <li class="title">Холбоосууд</li>
                <li>Аялалууд</li>
                <li>Аялал санал болгох</li>
                <li>Бидний тухай</li>
                <li>Нэвтрэх</li>
              </ul>
            </div>
            <div class="contact">
              <ul>
                <li class="title">Холбоосууд</li>
                <li class="address">Улаанбаатар, БЗД, 1-р хороо, Seoul Business Center, 711 тоот</li>
                <li>+976 70001160</li>
                <li>Даваа - Баасан: 09:00 - 18:00</li>
                <li>info@ayn.mn | ayn.mn@gmail.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright">Copyright 2024 ©company</div>
    </div>
    `;
  }
}
