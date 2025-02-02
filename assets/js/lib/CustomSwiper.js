class CustomSwiper {
  constructor(target) {
    let swiper = null;

    const params = {
      breakPoints: null,
    };

    const handler = {};
    const method = {};

    const setProperty = () => {
      swiper = new Swiper(target, {
        speed: 400,
        loop: false,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: params.breakPoints
          ? params.breakPoints
          : { slidesPerView: 1 },
      });
    };
    const init = () => {
      if (target.getAttribute("breakpoints")) {
        params.breakPoints = JSON.parse(target.getAttribute("breakpoints"));
      }
      setProperty();
    };
    init();
  }
}

export default CustomSwiper;
