import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import GroupModal from "./GroupModal";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { useHistory, useParams } from "react-router-dom";
import {
  MESS_TYPES,
  getConversations,
} from "../../redux/actions/messageAction";
import "../../styles/group_modal.css";

const LeftSide = () => {
  const { auth, message, online, groupMessage } = useSelector((state) => state);

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);

  const history = useHistory();
  const { id } = useParams();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return setSearchUsers([]);

    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setSearchUsers(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

  const handleAddUser = (user) => {
    setSearch("");
    setSearchUsers([]);
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
    dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    dispatch({ type: "REMOVE_GROUP" });
    return history.push(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return "active";
    return "";
  };

  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ auth }));
  }, [dispatch, auth, message.firstLoad]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }));
    }
  }, [message.resultUsers, page, auth, dispatch]);

  // Check User Online - Offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    }
  }, [online, message.firstLoad, dispatch]);

  //------------------------group

  const [groupModal, setGroupModal] = useState(false);

  const handleGroupConversation = () => {
    setGroupModal(true);
  };

  const turnOffGroupModal = () => {
    setGroupModal(false);
  };

  const handleAddGroupConversation = async (groupConversation) => {
    const res = await getDataAPI(
      `/groupmessage/${groupConversation._id}`,
      auth.token
    );

    const group = await getDataAPI(
      `/group/${groupConversation._id}`,
      auth.token
    );

    dispatch({
      type: "ADD_GROUP",
      payload: {
        groupId: group.data[0]._id,
        groupAdmin: group.data[0].groupAdmin.avatar,
        groupName: group.data[0].groupConversationName,
        groupMessage: res.data,
      },
    });
    return history.push(`/message/${groupConversation._id}`);
  };

  const fetchGroupConversation = async () => {
    const res = await getDataAPI("group", auth.token);

    dispatch({
      type: "FETCH_GROUP_CONVERSATION",
      payload: res.data,
    });
  };

  useEffect(() => {
    fetchGroupConversation();
  },[]);

  return (
    <>
      <form className="message_header" onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          placeholder="Enter to Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit" style={{ display: "none" }}>
          Search
        </button>
      </form>
      {/* ---------------------------------- */}
      <button
        onClick={handleGroupConversation}
        style={{ width: "100%", padding: "5px" }}
      >
        Add a new group chat
      </button>

      {groupMessage.groupConversations.map((groupConversation) => (
        <div
          className="groupList"
          key={groupConversation._id}
          onClick={() => handleAddGroupConversation(groupConversation)}
        >
          <img
            alt="admin-img"
            className="admin-img"
            src={groupConversation.groupAdmin.avatar}
          ></img>
          {groupConversation.groupConversationName}
        </div>
      ))}

      {groupModal && (
        <GroupModal onClick={turnOffGroupModal} setGroupModal={setGroupModal} />
      )}
      {/* ---------------------------------- */}
      <div className="message_chat_list">
        {searchUsers.length !== 0 ? (
          <>
            {searchUsers.map((user) => (
              <div
                key={user._id}
                className={`message_user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
              </div>
            ))}
          </>
        ) : (
          <>
            {message.users.map((user) => (
              <div
                key={user._id}
                className={`message_user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} msg={true}>
                  {user.online ? (
                    <i className="fas fa-circle text-success" />
                  ) : (
                    <i className="fas fa-circle" />
                  )}
                </UserCard>
              </div>
            ))}
          </>
        )}

        <button ref={pageEnd} style={{ opacity: 0 }}>
          Load More
        </button>
      </div>
    </>
  );
};

export default LeftSide;
