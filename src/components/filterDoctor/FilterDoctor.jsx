import React, { Component } from "react";
import doctorsData from "./DoctorData";
import "./FilterDoctor.scss";

class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: "",
      gender: "",
      category: "",
      academicDegree: "",
      rating: "",
      numberOfReviews: "",
      admissionType: "",
      filteredDoctors: doctorsData,
      isPopupOpen: false, // Добавляем состояние для открытия/закрытия попапа
    };
  }

  togglePopup = () => {
    this.setState((prevState) => ({
      isPopupOpen: !prevState.isPopupOpen,
    }));
    const popup = document.getElementById("popup");
    popup.style.display = this.state.isPopupOpen ? "none" : "block";
  };

  clearFilter = () => {
    // Очистить все параметры фильтрации и обновить состояние
    this.setState({
      experience: "",
      gender: "",
      category: "",
      academicDegree: "",
      rating: "",
      numberOfReviews: "",
      admissionType: "",
    });
  };

  filterDoctors = () => {
    const {
      experience,
      gender,
      category,
      academicDegree,
      rating,
      numberOfReviews,
      admissionType,
    } = this.state;

    // Параметры фильтрации

    const filteredDoctors = doctorsData.filter((doctor) => {
      return (
        (experience === "" ||
          (experience === "Не более 5 лет" && doctor.experience < 5) ||
          (experience === "От 5 до 10 лет" &&
            doctor.experience >= 5 &&
            doctor.experience <= 10) ||
          (experience === "От 10 до 20 лет" &&
            doctor.experience >= 10 &&
            doctor.experience <= 20) ||
          (experience === "Свыше 20 лет" && doctor.experience > 20)) &&
        (gender === "" || doctor.gender === gender) &&
        (category === "" || doctor.category === category) &&
        (academicDegree === "" || doctor.academicDegree === academicDegree) &&
        (rating === "" || doctor.rating >= parseFloat(rating)) &&
        (numberOfReviews === "" ||
          (numberOfReviews === "Меньше 50" && doctor.numberOfReviews < 50) ||
          (numberOfReviews === "50-100" &&
            doctor.numberOfReviews >= 50 &&
            doctor.numberOfReviews <= 100) ||
          (numberOfReviews === "Больше 100" && doctor.numberOfReviews > 100)) &&
        (admissionType === "" || doctor.admissionType === admissionType)
      );
    });

    this.setState({ filteredDoctors });
  };

  handleFilterChange = () => {
    this.filterDoctors();
    this.togglePopup();
  };

  render() {
    const commonOptions = {
      experience: [
        "Все",
        "Не более 5 лет",
        "От 5 до 10 лет",
        "От 10 до 20 лет",
        "Свыше 20 лет",
      ],
      gender: ["Все", "Мужской", "Женский"],
      category: ["Все", "Первая", "Вторая", "Высшая"],
      academicDegree: [
        "Все",
        "Кандидат медицинских наук",
        "Доктор медицинских наук",
        "Профессор",
      ],
      rating: ["Все", "4.5", "4"],
      numberOfReviews: ["Все", "Меньше 50", "50-100", "Больше 100"],
      admissionType: ["Все", "Клиника", "Онлайн", "На дому"],
    };

    const countFilteredDoctors = () => {
      return this.state.filteredDoctors.length;
    };

    return (
      <div className="app">
        <div className="container">
          <h1 className="heading">Рейтинг хирургов</h1>
          <div className="button-container">
            <div className="button-container-left">
              <button
                className="filter-toggle"
                type="button"
                onClick={this.togglePopup} // Добавляем обработчик для открытия/закрытия попапа
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 34 30"
                  fill="none"
                >
                  <path
                    d="M1.46802 3.71453C1.46802 2.86119 1.46802 2.43451 1.6537 2.10858C1.81706 1.82188 2.07769 1.58879 2.39826 1.44269C2.7627 1.27663 3.23978 1.27663 4.19394 1.27663H29.4088C30.363 1.27663 30.84 1.27663 31.2045 1.44269C31.5251 1.58879 31.7856 1.82188 31.949 2.10858C32.1347 2.43451 32.1347 2.86119 32.1347 3.71453V6.36158C32.1347 6.73426 32.1347 6.9206 32.0877 7.09596C32.0459 7.25143 31.9771 7.40006 31.8836 7.53638C31.7783 7.69015 31.6309 7.82192 31.3363 8.08544L21.0071 17.3232C20.7125 17.5867 20.5652 17.7185 20.4599 17.8722C20.3663 18.0086 20.2975 18.1572 20.2558 18.3127C20.2088 18.4881 20.2088 18.6744 20.2088 19.047V22.6083L13.3939 28.7031V19.047C13.3939 18.6744 13.3939 18.4881 13.3469 18.3127C13.3051 18.1572 13.2363 18.0086 13.1429 17.8722C13.0375 17.7185 12.8902 17.5867 12.5955 17.3232L2.26642 8.08544C1.97177 7.82192 1.82443 7.69015 1.71908 7.53638C1.62566 7.40006 1.55683 7.25143 1.51509 7.09596C1.46802 6.9206 1.46802 6.73426 1.46802 6.36158V3.71453Z"
                    stroke="#5D88A8"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Фильтр
              </button>
              <button className="filter-toggle" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M34.7448 17.3617V12.2553C34.7448 10.3752 33.2207 8.85104 31.3405 8.85104H10.915C9.03488 8.85104 7.51074 10.3752 7.51074 12.2553V17.3617M34.7448 17.3617V32.6808C34.7448 34.561 33.2207 36.0851 31.3405 36.0851H10.915C9.03488 36.0851 7.51074 34.561 7.51074 32.6808V17.3617M34.7448 17.3617H7.51074M14.3193 5.44678V12.2553M27.9363 5.44678V12.2553"
                    stroke="#5D88A8"
                    stroke-width="3"
                    stroke-linecap="round"
                  />
                  <path
                    d="M15.1704 20.7659H11.7661C11.2961 20.7659 10.915 21.147 10.915 21.617V25.0212C10.915 25.4913 11.2961 25.8723 11.7661 25.8723H15.1704C15.6404 25.8723 16.0214 25.4913 16.0214 25.0212V21.617C16.0214 21.147 15.6404 20.7659 15.1704 20.7659Z"
                    fill="#5D88A8"
                  />
                  <path
                    d="M22.8298 20.7659H19.4255C18.9555 20.7659 18.5745 21.147 18.5745 21.617V25.0212C18.5745 25.4913 18.9555 25.8723 19.4255 25.8723H22.8298C23.2998 25.8723 23.6808 25.4913 23.6808 25.0212V21.617C23.6808 21.147 23.2998 20.7659 22.8298 20.7659Z"
                    fill="#5D88A8"
                  />
                  <path
                    d="M30.4894 20.7659H27.0852C26.6152 20.7659 26.2341 21.147 26.2341 21.617V25.0212C26.2341 25.4913 26.6152 25.8723 27.0852 25.8723H30.4894C30.9595 25.8723 31.3405 25.4913 31.3405 25.0212V21.617C31.3405 21.147 30.9595 20.7659 30.4894 20.7659Z"
                    fill="#5D88A8"
                  />
                </svg>
                Дата
              </button>
              <button className="filter-toggle" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 35 19"
                  fill="none"
                >
                  <path
                    d="M19.2885 9.33268H33.5107M19.2885 2.97292H33.5107M19.2885 15.6924H33.5107M6.84408 1.38298V17.2824M6.84408 1.38298L1.51074 6.1528M6.84408 1.38298L12.1774 6.1528"
                    stroke="#5D88A8"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Сортировка
              </button>
            </div>
            <div className="button-container-right">
              <button className="filter-toggle" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 35 35"
                  fill="none"
                >
                  <path
                    d="M8.54807 21.7128C6.15508 22.6252 4.67041 23.8965 4.67041 25.3027C4.67041 28.0792 10.4574 30.3298 17.5959 30.3298C24.7346 30.3298 30.5215 28.0792 30.5215 25.3027C30.5215 23.8965 29.0368 22.6252 26.6438 21.7128M17.5959 13.0957H17.6103M26.213 13.0957C26.213 18.9319 19.7502 21.7128 17.5959 26.0213C15.4417 21.7128 8.97892 18.9319 8.97892 13.0957C8.97892 8.33668 12.8369 4.47871 17.5959 4.47871C22.355 4.47871 26.213 8.33668 26.213 13.0957ZM19.0321 13.0957C19.0321 13.8889 18.3891 14.5319 17.5959 14.5319C16.8027 14.5319 16.1598 13.8889 16.1598 13.0957C16.1598 12.3026 16.8027 11.6596 17.5959 11.6596C18.3891 11.6596 19.0321 12.3026 19.0321 13.0957Z"
                    stroke="#5D88A8"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Показать на карте
              </button>
            </div>
          </div>
          <div className="wrapper-container">
            <div className="popup" id="popup">
              <div className="popup-content">
                {Object.keys(commonOptions).map((key) => (
                  <label key={key}>
                    {key === "experience"
                      ? "Стаж:"
                      : key === "gender"
                      ? "Пол:"
                      : key === "category"
                      ? "Категория:"
                      : key === "academicDegree"
                      ? "Ученая степень:"
                      : key === "rating"
                      ? "Оценка:"
                      : key === "numberOfReviews"
                      ? "Количество отзывов:"
                      : "Тип приёма"}
                    <select
                      className="select-css"
                      placeholder="Все"
                      value={this.state[key]}
                      onChange={(e) =>
                        this.setState({
                          [key]: e.target.value === "Все" ? "" : e.target.value,
                        })
                      }
                    >
                      {commonOptions[key].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                <button type="button" onClick={this.handleFilterChange}>
                  Применить фильтр
                </button>
                <button type="button" onClick={this.clearFilter}>
                  Сбросить фильтры
                </button>
              </div>
            </div>

            {/* Отображение результатов фильтрации */}
            <div className="wrapper-card">
              <h1>Всего врачей: {countFilteredDoctors()}</h1>
              {this.state.filteredDoctors.map((doctor) => (
                <div className="cards" key={doctor.id}>
                  <div className="left-info">
                    <img
                      className="card_img"
                      src={process.env.PUBLIC_URL + "/" + doctor.photoPath}
                      alt={doctor.name}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="151"
                      height="34"
                      viewBox="0 0 151 34"
                      fill="none"
                    >
                      <path
                        d="M15.722 3.77926C16.1041 2.60312 17.768 2.60312 18.1502 3.77926L20.3754 10.6279C20.5463 11.1539 21.0365 11.51 21.5896 11.51H28.7906C30.0273 11.51 30.5415 13.0925 29.541 13.8194L23.7152 18.052C23.2678 18.3771 23.0805 18.9533 23.2514 19.4793L25.4767 26.3279C25.8588 27.5041 24.5127 28.4821 23.5122 27.7552L17.6864 23.5225C17.239 23.1975 16.6331 23.1975 16.1857 23.5225L10.3599 27.7552C9.35945 28.4821 8.01331 27.5041 8.39546 26.3279L10.6207 19.4793C10.7916 18.9533 10.6044 18.3771 10.157 18.052L4.33118 13.8194C3.33069 13.0925 3.84488 11.51 5.08154 11.51H12.2826C12.8357 11.51 13.3258 11.1539 13.4967 10.6279L15.722 3.77926Z"
                        fill="#FF6767"
                      />
                      <path
                        d="M45.0835 3.77926C45.4657 2.60312 47.1296 2.60312 47.5118 3.77926L49.737 10.6279C49.9079 11.1539 50.3981 11.51 50.9511 11.51H58.1522C59.3889 11.51 59.903 13.0925 58.9025 13.8194L53.0768 18.052C52.6293 18.3771 52.4421 18.9533 52.613 19.4793L54.8383 26.3279C55.2204 27.5041 53.8743 28.4821 52.8738 27.7552L47.048 23.5225C46.6006 23.1975 45.9947 23.1975 45.5473 23.5225L39.7215 27.7552C38.721 28.4821 37.3749 27.5041 37.757 26.3279L39.9823 19.4793C40.1532 18.9533 39.966 18.3771 39.5185 18.052L33.6927 13.8194C32.6923 13.0925 33.2064 11.51 34.4431 11.51H41.6442C42.1972 11.51 42.6874 11.1539 42.8583 10.6279L45.0835 3.77926Z"
                        fill="#FF6767"
                      />
                      <path
                        d="M74.4454 3.77926C74.8275 2.60312 76.4914 2.60312 76.8736 3.77926L79.0988 10.6279C79.2697 11.1539 79.7599 11.51 80.3129 11.51H87.514C88.7507 11.51 89.2648 13.0925 88.2644 13.8194L82.4386 18.052C81.9912 18.3771 81.8039 18.9533 81.9748 19.4793L84.2001 26.3279C84.5822 27.5041 83.2361 28.4821 82.2356 27.7552L76.4098 23.5225C75.9624 23.1975 75.3565 23.1975 74.9091 23.5225L69.0833 27.7552C68.0828 28.4821 66.7367 27.5041 67.1188 26.3279L69.3441 19.4793C69.515 18.9533 69.3278 18.3771 68.8803 18.052L63.0546 13.8194C62.0541 13.0925 62.5683 11.51 63.8049 11.51H71.006C71.559 11.51 72.0492 11.1539 72.2201 10.6279L74.4454 3.77926Z"
                        fill="#FD5050"
                      />
                      <path
                        d="M103.807 3.77926C104.189 2.60312 105.853 2.60312 106.235 3.77926L108.46 10.6279C108.631 11.1539 109.121 11.51 109.675 11.51H116.876C118.112 11.51 118.626 13.0925 117.626 13.8194L111.8 18.052C111.353 18.3771 111.166 18.9533 111.336 19.4793L113.562 26.3279C113.944 27.5041 112.598 28.4821 111.597 27.7552L105.771 23.5225C105.324 23.1975 104.718 23.1975 104.271 23.5225L98.4449 27.7552C97.4444 28.4821 96.0983 27.5041 96.4804 26.3279L98.7057 19.4793C98.8766 18.9533 98.6893 18.3771 98.2419 18.052L92.4161 13.8194C91.4157 13.0925 91.9298 11.51 93.1665 11.51H100.368C100.921 11.51 101.411 11.1539 101.582 10.6279L103.807 3.77926Z"
                        fill="#FF6767"
                      />
                      <path
                        d="M133.169 3.77926C133.551 2.60312 135.215 2.60312 135.597 3.77926L137.822 10.6279C137.993 11.1539 138.483 11.51 139.036 11.51H146.237C147.474 11.51 147.988 13.0925 146.988 13.8194L141.162 18.052C140.715 18.3771 140.527 18.9533 140.698 19.4793L142.923 26.3279C143.306 27.5041 141.959 28.4821 140.959 27.7552L135.133 23.5225C134.686 23.1975 134.08 23.1975 133.632 23.5225L127.807 27.7552C126.806 28.4821 125.46 27.5041 125.842 26.3279L128.067 19.4793C128.238 18.9533 128.051 18.3771 127.604 18.052L121.778 13.8194C120.777 13.0925 121.292 11.51 122.528 11.51H129.729C130.282 11.51 130.773 11.1539 130.943 10.6279L133.169 3.77926Z"
                        fill="#FD5050"
                      />
                    </svg>
                    <span>
                      {doctor.numberOfReviews} отзыва / {doctor.rating} звёзд
                    </span>
                  </div>
                  <div className="information">
                    <div className="middle-info">
                      <div className="middle-info-up">
                        <h2>{doctor.name} {/* ({doctor.gender})*/} </h2>
                        <div className="border">
                          <h4>
                            Стаж{" "}
                            {doctor.experience >= 5
                              ? `${doctor.experience} лет`
                              : `${doctor.experience} года`}
                          </h4>
                          <p>{doctor.category}</p>
                          <p>{doctor.academicDegree}</p>
                        </div>
                      </div>
                      <div className="middle-info-down">
                        <h4>Запись на приём: ( {doctor.admissionType} )</h4>
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="29"
                            height="26"
                            viewBox="0 0 29 26"
                            fill="none"
                          >
                            <path
                              d="M4.17392 13.9368L8.65779 9.06449C9.11535 8.53983 9.34413 8.27747 9.46404 7.98325C9.57013 7.72291 9.61401 7.44567 9.5929 7.1693C9.56903 6.85698 9.43063 6.5484 9.15384 5.93125L8.098 3.57716C7.68838 2.66386 7.48356 2.2072 7.13024 1.90788C6.8189 1.64412 6.42876 1.46622 6.00672 1.39555C5.52776 1.31534 4.99276 1.43464 3.92273 1.67321L1 2.32495C1 15.5744 11.399 24.8491 26.2558 24.8491L26.9861 22.2421C27.2537 21.2878 27.3874 20.8106 27.2975 20.3835C27.2182 20.0072 27.0188 19.6591 26.723 19.3816C26.3874 19.0664 25.8753 18.8838 24.8512 18.5185L22.4958 17.6781C21.7063 17.3965 21.3116 17.2557 20.918 17.2449C20.5701 17.2354 20.2247 17.2986 19.9091 17.4295C19.5521 17.5778 19.2516 17.8458 18.6504 18.382L14.1143 22.4288M15.8559 6.2998C17.3071 6.55229 18.6406 7.18521 19.686 8.11755C20.7314 9.04988 21.4411 10.2392 21.7241 11.5333M15.8559 1C18.8707 1.2987 21.6819 2.50272 23.8282 4.41441C25.9744 6.32609 27.3279 8.83179 27.6667 11.5201"
                              stroke="#2BAD47"
                              stroke-width="1.91489"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          + 7 999 999 99-99
                        </span>
                      </div>
                    </div>
                    <div className="right-info">
                      <div className="right-info-up">
                        <h2>Клиника “Елена” на Сакко и Ванцетти</h2>
                        <h4>ул. Сакко и Ванцетти, д. 77</h4>
                        <ul>
                          <li>Октябрьская (300 м)</li>
                          <li>Березовая роща (1.3 км)</li>
                        </ul>
                      </div>
                      <div className="right-info-down">
                        <button>Посмотреть расписание</button>
                        <h4>Стоимость приёма: 4 000 руб.</h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FilterComponent;
