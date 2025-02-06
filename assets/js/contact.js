const el = {
  map: null,
};

const selector = {
  map: "#map",
};

const params = {
  map: null,
};

const handler = {};

const method = {};

const setProperty = async () => {};

const bind = () => {};

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
