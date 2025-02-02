const el = {
  loginForm: null,
  registerForm: null,
  username: null,
  name: null,
  password: null,
  rePassword: null,
};

const selector = {
  loginForm: "#login-form",
  registerForm: "#register-form",
  username: "#username",
  name: "#name",
  password: "#password",
  rePassword: "#re-password",
};

const params = {};

const method = {};

const handler = {
  loginSubmit: (e) => {
    e.preventDefault();
    const username = el.username.value;
    const password = el.password.value;

    let users = localStorage.getItem("users");
    if (!users) {
      alert("Хэрэглэгчийн мэдээлэл олдсонгүй");
      return;
    }

    users = JSON.parse(users);
    const logged = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!logged) {
      alert("Хэрэглэгчийн мэдээлэл олдсонгүй");
      return;
    }

    localStorage.setItem("logged-user", JSON.stringify(logged));
    alert("Амжилттай нэвтэрлээ");
    window.location = "/pages/index.html";
  },
  registerSubmit: (e) => {
    e.preventDefault();

    const username = el.username.value;
    const password = el.password.value;
    const name = el.name.value;
    const repassword = el.rePassword.value;

    if (password != repassword) {
      alert("Нууц үг таарсангүй");
      return;
    }

    const param = {
      name,
      username,
      password,
    };

    let users = localStorage.getItem("users");
    if (!users) {
      localStorage.setItem("users", JSON.stringify([param]));
      return;
    }

    users = JSON.parse(users);
    const check = users.find((user) => user.username === username);
    if (check) {
      alert("Бүртгэлтэй утасны дугаар");
    }

    users.push(param);

    localStorage.setItem("users", JSON.stringify(users));
    alert("Амжилттай бүртгэгдлээ");
    window.location = "/pages/login.html";
  },
};

const setProperty = async () => {
  el.loginForm = document.querySelector(selector.loginForm);
  el.registerForm = document.querySelector(selector.registerForm);
  el.username = document.querySelector(selector.username);
  el.name = document.querySelector(selector.name);
  el.password = document.querySelector(selector.password);
  el.rePassword = document.querySelector(selector.rePassword);
};

const bind = () => {
  if (el.loginForm) {
    el.loginForm.addEventListener("submit", handler.loginSubmit);
  }

  if (el.registerForm) {
    el.registerForm.addEventListener("submit", handler.registerSubmit);
  }
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
