import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/group_modal.css";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { getDataAPI, putDataAPI } from "../../utils/fetchData";

const GroupNameModal = ({ groupName, onClick, groupId, setGroupNameModal }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [newGroupChatName, setNewGroupChatName] = useState("");

  const handleChangeGroupName = async (e) => {
    e.preventDefault();
    const res = await putDataAPI(
      `group/${groupId}`,
      {
        newGroupName: newGroupChatName,
      },
      auth.token
    );
    if (res.data.msg.includes("success")) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });
      dispatch({
        type: "RENAME_GROUP",
        payload: newGroupChatName,
      });
      const group = await getDataAPI("group", auth.token);

      dispatch({
        type: "FETCH_GROUP_CONVERSATION",
        payload: group.data,
      });
      setGroupNameModal(false);
      // window.location.reload();
    } else {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: res.data.msg },
      });
    }
  };

  return (
    <>
      <div className="backdrop" onClick={onClick}></div>
      <div className="modalCard-GroupName">
        <div className="groupName-header">{groupName}</div>
        <div className="groupName-container">
          <form className="changeGroupName" onSubmit={handleChangeGroupName}>
            <input
              type="text"
              placeholder="Enter a new name"
              onChange={(e) => setNewGroupChatName(e.target.value)}
              autoFocus
            />
            <button className="groupName-btn" type="submit">
              Change
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default GroupNameModal;
