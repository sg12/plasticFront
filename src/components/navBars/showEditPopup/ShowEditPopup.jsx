const EditPopup = ({ showEditPopup, setShowEditPopup }) => {
  return (
    <>
      {showEditPopup && (
        <div className="edit__popup">
          <p>Данные успешно сохранены!</p>
        </div>
      )}
    </>
  );
};

export default EditPopup;
