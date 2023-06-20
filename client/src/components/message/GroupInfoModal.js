import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/group_modal.css";
import { useHistory } from "react-router-dom";
import { getDataAPI, putDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const Modal = ({ groupName, onClick }) => {
  const { auth } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupAdmin, setGroupAdmin] = useState("");
  const [groupId, setGroupId] = useState("");

  const fetchGroupUsers = async () => {
    const res = await getDataAPI(
      `/group/${history.location.pathname.slice(9)}`,
      auth.token
    );
    setGroupId(res.data[0]._id);
    setGroupAdmin(res.data[0].groupAdmin);
    setGroupUsers(res.data[0].recipients);
  };

  const handleDeleteUser = async (groupUserId) => {
    const res = await putDataAPI(
      `group/remove/${groupId}`,
      {
        removeId: groupUserId,
      },
      auth.token
    );

    if (res.data.msg.includes("success")) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });

      const group = await getDataAPI(
        `/group/${history.location.pathname.slice(9)}`,
        auth.token
      );
      setGroupUsers(group.data[0].recipients);
    } else {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: res.data.msg },
      });
    }
  };

  useEffect(() => {
    fetchGroupUsers();
  }, []);
  return (
    <>
      <div className="backdrop" onClick={onClick}></div>
      <div className="modalCard">
        <div className="groupInfo-header">{groupName}</div>
        <div className="groupInfo-container">
          {groupUsers.map((groupUser) => (
            <div key={groupUser._id} className="groupInfo-badge">
              <div className="groupInfo-avatar-name">
                <img
                  alt="group-user"
                  src={groupUser.avatar}
                  className="groupInfo-img"
                />
                <div className="groupInfo-nameContainer">
                  <a
                    href={`/profile/${groupUser._id}`}
                    className="groupInfo-username"
                  >
                    {groupUser.username}
                  </a>
                  <div className="groupInfo-fullname">{groupUser.fullname}</div>
                </div>
              </div>
              {}
              {groupUser._id !== groupAdmin._id && (
                <div
                  className="fas fa-trash text-danger"
                  onClick={() => handleDeleteUser(groupUser._id)}
                ></div>
              )}
              {groupUser._id === groupAdmin._id && (
                <div className="groupInfo-admin">Admin</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Modal;
