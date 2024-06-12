import React, { useState } from "react";
import "./SupportInfo.scss";

const SupportInfo = () => {
  const [formData, setFormData] = useState({
    requestTopic: "",
    technicalDetails: "",
    requestDescription: "",
    files: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: e.target.files,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="support">
      <span className="support__title">Обращение в службу поддержки</span>
      <span className="support__subtitle">Заполните форму</span>
      <form className="support__form" onSubmit={handleSubmit}>
        <div className="support__form-request">
          <label htmlFor="requestTopic">Тема запроса</label>
          <input
            type="text"
            id="requestTopic"
            name="requestTopic"
            placeholder="Какая проблема?"
            value={formData.requestTopic}
            onChange={handleChange}
          />
        </div>
        <div className="support__form-details">
          <label htmlFor="technicalDetails">Технические детали</label>
          <input
            type="text"
            id="technicalDetails"
            name="technicalDetails"
            placeholder="Название, версия браузера"
            value={formData.technicalDetails}
            onChange={handleChange}
          />
        </div>
        <div className="support__form-description">
          <label htmlFor="requestDescription">Описание сути запроса</label>
          <input
            type="text"
            id="requestDescription"
            name="requestDescription"
            placeholder="Опишите суть запроса"
            value={formData.requestDescription}
            onChange={handleChange}
          />
        </div>
        <div className="support__form-file">
          <input
            type="file"
            id="fileInput"
            name="files"
            className="support__button-upload"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="support__button-send">
          Отправить
        </button>
      </form>
    </div>
  );
};

export default SupportInfo;
