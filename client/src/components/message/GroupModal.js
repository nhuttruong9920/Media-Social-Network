import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import "../../styles/group_modal.css";
import { postDataAPI, getDataAPI } from "../../utils/fetchData";
import SearchResult from "./SearchResult";

const GroupModal = ({ onClick, setGroupModal }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupChatName || !selectedUsers) {
      return;
    }

    const res = await postDataAPI(
      "group",
      {
        groupConversationName: groupChatName,
        recipientsString: JSON.stringify(selectedUsers.map((u) => u._id)),
      },
      auth.token
    );

    if (res.data.msg.includes("success")) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });
      const group = await getDataAPI("group", auth.token);

      dispatch({
        type: "FETCH_GROUP_CONVERSATION",
        payload: group.data,
      });
      setGroupModal(false);
      // window.location.reload();
    } else {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: res.data.msg },
      });
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setSearchResult(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <div className="backdrop" onClick={onClick}></div>
      <div className="modalCard">
        {/* 1-form */}
        <form className="createGroup" onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Enter a new group chat name"
            onChange={(e) => setGroupChatName(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            placeholder="Type to search users"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>

        {/* 2-badge */}
        <div className="badgeContainer">
          {selectedUsers?.map((user) => (
            <div className="groupBadge" key={user.username}>
              <img
                className="badgeImage"
                alt="badge-img"
                src={user.avatar}
              ></img>
              <span className="badgeContent">{user.username}</span>
            </div>
          ))}
        </div>

        {/* 3-search result */}
        <div className="resultContainer">
          {searchResult?.map((user) => (
            <div
              className="searchResult-container"
              key={user._id}
              onClick={() => handleGroup(user)}
            >
              <SearchResult user={user} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupModal;
