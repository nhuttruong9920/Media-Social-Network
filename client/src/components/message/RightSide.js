import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import GroupInfoModal from "./GroupInfoModal";
import GroupNameModal from "./GroupNameModal";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import MsgDisplay from "./MsgDisplay";
import Icons from "../Icons";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { imageUpload } from "../../utils/imageUpload";
import {
  addMessage,
  getMessages,
  loadMoreMessages,
  deleteConversation,
} from "../../redux/actions/messageAction";
import LoadIcon from "../../images/loading.gif";

import "../../styles/group_modal.css";
import { getDataAPI, postDataAPI, deleteDataAPI } from "../../utils/fetchData";

const RightSide = () => {
  const { auth, message, theme, socket, peer, groupMessage } = useSelector(
    (state) => state
  );

  const dispatch = useDispatch();

  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);

  const refDisplay = useRef();
  const pageEnd = useRef();

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  const history = useHistory();

  useEffect(() => {
    const newData = message.data.find((item) => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);

      const newUser = message.users.find((user) => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [message.users, id]);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newMedia = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newMedia.push(file);
    });

    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ----------------------------
    const res = await getDataAPI(
      `/group/${history.location.pathname.slice(9)}`,
      auth.token
    );

    if (res.data.length !== 0) {
      setText("");
      setMedia([]);
      let newArr = [];
      if (media.length > 0) newArr = await imageUpload(media);
      const groupData = {
        groupConversationId: history.location.pathname.slice(9),
        text,
        media: newArr,
        call: {},
        createAt: new Date().toISOString(),
      };

      try {
        const tmp = await postDataAPI("groupmessage", groupData, auth.token);

        dispatch({
          type: "ADD_GROUP_MESSAGE",
          payload: tmp.data,
        });
      } catch (err) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: err.response.data.msg },
        });
      }

      return;
    }

    // ---------------------------------
    if (!text.trim() && media.length === 0) return;
    setText("");
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) newArr = await imageUpload(media);

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString(),
    };

    setLoadMedia(false);
    await dispatch(addMessage({ msg, auth, socket }));
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    const getMessagesData = async () => {
      if (message.data.every((item) => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
        setTimeout(() => {
          refDisplay.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 50);
      }
    };
    getMessagesData();
  }, [id, dispatch, auth, message.data]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessages({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
    // eslint-disable-next-line
  }, [isLoadMore]);

  const handleDeleteConversation = () => {
    if (window.confirm("Do you want to delete?")) {
      dispatch(deleteConversation({ auth, id }));
      return history.push("/message");
    }
  };

  // Call
  const caller = ({ video }) => {
    const { _id, avatar, username, fullname } = user;

    const msg = {
      sender: auth.user._id,
      recipient: _id,
      avatar,
      username,
      fullname,
      video,
    };
    dispatch({ type: GLOBALTYPES.CALL, payload: msg });
  };

  const callUser = ({ video }) => {
    const { _id, avatar, username, fullname } = auth.user;

    const msg = {
      sender: _id,
      recipient: user._id,
      avatar,
      username,
      fullname,
      video,
    };

    if (peer.open) msg.peerId = peer._id;

    socket.emit("callUser", msg);
  };

  const handleAudioCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };

  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };
  // ----------------------
  const [groupInfoModal, setGroupInfoModal] = useState(false);
  const [groupNameModal, setGroupNameModal] = useState(false);

  const handleDeleteGroupConversation = async () => {
    const res = await deleteDataAPI(
      `/group/${history.location.pathname.slice(9)}`,
      auth.token
    );

    if (res.data.msg.includes("success")) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });
      return history.push("/message");
    } else {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: res.data.msg },
      });
    }
  };

  const handleInfoGroupConversation = () => {
    setGroupInfoModal(true);
  };

  const turnOffGroupInfoModal = () => {
    setGroupInfoModal(false);
  };
  const handleNameGroupConversation = () => {
    setGroupNameModal(true);
  };
  const turnOffNameGroupModal = () => {
    setGroupNameModal(false);
  };

  useEffect(() => {
    refDisplay.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });

  return (
    <>
      <div className="message_header" style={{ cursor: "pointer" }}>
        {/* ------------------- */}
        {groupMessage.groupName !== "" && (
          <div className="groupHeader-container">
            <div className="groupName">
              <img
                alt="group-admin-avatar"
                className="admin-img-header"
                src={groupMessage.groupAdmin}
              ></img>
              {groupMessage.groupName}
            </div>
            <div className="group-function">
              <div
                className="fas fa-pen text"
                onClick={handleNameGroupConversation}
                style={{ marginRight: "20px" }}
              ></div>
              <div
                className="fas fa-eye text"
                onClick={handleInfoGroupConversation}
                style={{ marginRight: "20px" }}
              ></div>
              <div
                className="fas fa-trash text-danger"
                onClick={handleDeleteGroupConversation}
              ></div>
            </div>
          </div>
        )}

        {groupNameModal && (
          <GroupNameModal
            groupName={groupMessage.groupName}
            groupId={groupMessage.groupId}
            onClick={turnOffNameGroupModal}
            setGroupNameModal={setGroupNameModal}
            groupNameModal={groupNameModal}
          />
        )}
        {groupInfoModal && (
          <GroupInfoModal
            groupName={groupMessage.groupName}
            onClick={turnOffGroupInfoModal}
          />
        )}
        {/* ----------------------- */}
        {user.length !== 0 && groupMessage.groupName === "" && (
          <UserCard user={user}>
            <div>
              <i className="fas fa-phone-alt" onClick={handleAudioCall} />

              <i className="fas fa-video mx-3" onClick={handleVideoCall} />

              <i
                className="fas fa-trash text-danger"
                onClick={handleDeleteConversation}
              />
            </div>
          </UserCard>
        )}
      </div>

      <div
        className="chat_container"
        style={{ height: media.length > 0 ? "calc(100% - 180px)" : "" }}
      >
        <div className="chat_display" ref={refDisplay}>
          <button style={{ marginTop: "-25px", opacity: 0 }} ref={pageEnd}>
            Load more
          </button>

          {/* ------------------- */}
          {groupMessage.data.map((item) => (
            <div key={item._id}>
              {item.sender._id !== auth.user._id && (
                <div className="otherGroupChatContainer">
                  <div className="senderContainer">
                    <img
                      alt="avatar"
                      src={item.sender.avatar}
                      className="senderAvatar"
                    ></img>
                    <div>{item.sender.fullname}</div>
                  </div>
                  {item.text && (
                    <div className="otherGroupChatText">{item.text}</div>
                  )}
                  {item.media.length > 0 &&
                    item.media.map((i) => (
                      <div>
                        {i.url.includes("mp4") ? (
                          <video
                            alt="img"
                            src={i.url}
                            className="groupChatImg"
                            controls
                          ></video>
                        ) : (
                          <img
                            alt="img"
                            src={i.url}
                            className="groupChatImg"
                          ></img>
                        )}
                      </div>
                    ))}
                  <div className="groupDate">{item.createdAt}</div>
                </div>
              )}

              {item.sender._id === auth.user._id && (
                <div className="yourGroupChatContainer">
                  <div className="senderContainer">
                    <img
                      alt="avatar"
                      src={item.sender.avatar}
                      className="senderAvatar"
                    ></img>
                    <div>{item.sender.fullname}</div>
                  </div>
                  {item.text && (
                    <div className="yourGroupChatText">{item.text}</div>
                  )}
                  {item.media.length > 0 &&
                    item.media.map((i) => (
                      <div>
                        {i.url.includes("mp4") ? (
                          <video
                            alt="img"
                            src={i.url}
                            className="groupChatImg"
                            controls
                          ></video>
                        ) : (
                          <img
                            alt="img"
                            src={i.url}
                            className="groupChatImg"
                          ></img>
                        )}
                      </div>
                    ))}

                  <div className="groupDate yourGroupDate">
                    {item.createdAt}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ----------------------- */}

          {data.map((msg, index) => (
            <div key={index}>
              {msg.sender !== auth.user._id && (
                <div className="chat_row other_message">
                  <MsgDisplay user={user} msg={msg} theme={theme} />
                </div>
              )}

              {msg.sender === auth.user._id && (
                <div className="chat_row you_message">
                  <MsgDisplay
                    user={auth.user}
                    msg={msg}
                    theme={theme}
                    data={data}
                  />
                </div>
              )}
            </div>
          ))}

          {loadMedia && (
            <div className="chat_row you_message">
              <img src={LoadIcon} alt="loading" />
            </div>
          )}
        </div>
      </div>

      <div
        className="show_media"
        style={{ display: media.length > 0 ? "grid" : "none" }}
      >
        {media.map((item, index) => (
          <div key={index} id="file_media">
            {item.type.match(/video/i)
              ? videoShow(URL.createObjectURL(item), theme)
              : imageShow(URL.createObjectURL(item), theme)}
            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
          </div>
        ))}
      </div>

      <form className="chat_input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter you message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            filter: theme ? "invert(1)" : "invert(0)",
            background: theme ? "#040404" : "",
            color: theme ? "white" : "",
          }}
        />

        <Icons setContent={setText} content={text} theme={theme} />

        <div className="file_upload">
          <i className="fas fa-image text-danger" />
          <input
            type="file"
            name="file"
            id="file"
            multiple
            accept="image/*,video/*"
            onChange={handleChangeMedia}
          />
        </div>

        <button
          type="submit"
          className="material-icons"
          disabled={text || media.length > 0 ? false : true}
        >
          near_me
        </button>
      </form>
    </>
  );
};

export default RightSide;
