import women from '../../assets/imgs/women.png'

class Doctor {
    constructor(id, name, experience, gender, category, academicDegree, rating, numberOfReviews, admissionType, photoPath) {
      this.id = id;
      this.name = name;
      this.experience = experience;
      this.gender = gender;
      this.category = category;
      this.academicDegree = academicDegree;
      this.rating = rating;
      this.numberOfReviews = numberOfReviews;
      this.admissionType = admissionType;
      this.photoPath = photoPath; // Путь к фотографии в папке public/images
    }
  }
  
  const doctorsData = [
    new Doctor(1, "Иванова Мария Давидовна", 3, "Женский", "Высшая категория", "Кандидат медицинских наук", 4.8, 56, "Клиника", women),
    new Doctor(2, "Чатинян Гарик Артурович", 15, "Мужской", "Вторая категория", "Доктор медицинских наук", 5, 24, "Онлайн", women),
    new Doctor(3, "Доктор Анна", 9, "Женский", "Вторая категория", "Доктор медицинских наук", 2.4, 72, "На дому", women),
    new Doctor(4, "Доктор Алексей", 21, "Мужской", "Первая категория", "Доктор медицинских наук", 3, 101, "Клиника", women),
    // Добавьте других врачей с аналогичными данными
  ];
  
  export default doctorsData;