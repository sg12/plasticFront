import { useState } from "react";
import EditUser from "../editUser/EditUser";

import AlertModal from "../../UI/modals/alertModal/AlertModal";
import Divider from "../../UI/dividers/Divider";

import ProfileUserHeader from "../profileUser/ProfileUserHeader";
import ProfileUserAction from "../profileUser/ProfileUserAction";
import ProfileUserDetails from "../profileUser/ProfileUserDetails";
import ProfileUserFooter from "../profileUser/ProfileUserFooter";


const ProfileInfo = ({
  userData,
  handleDeleteAccount,
  fieldsDetails,
  fieldsFooter,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="profile">
      {userData && (
        <>
          <ProfileUserHeader userData={userData} />
          <Divider />
          {!isEditing && (
            <>
              <ProfileUserDetails fields={fieldsDetails} userData={userData} />
              {fieldsFooter && (
                <ProfileUserFooter fields={fieldsFooter} userData={userData} />
              )}
              <ProfileUserAction
                isEditing={isEditing}
                toggleEditingMode={() => setIsEditing((prev) => !prev)}
                handleDelete={() => setModalOpen(true)}
              />
            </>
          )}
          {isEditing && (
            <EditUser
              userData={userData}
              toggleEditingMode={() => setIsEditing((prev) => !prev)}
            />
          )}
          <AlertModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onAccept={handleDeleteAccount}
            title="Удалить учетную запись?"
            message="Удаление аккаунта приведет к безвозвратной потере всех связанных с ним данных."
          />
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
