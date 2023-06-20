import React, { useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import moment from "moment";
import InputComment from "./home/InputComment";
import ModalComments from "./home/ModalComments";
import Footer from "./home/post_card/CardFooter";
import ModalCarousel from "./home/ModalCarousel";
import "../styles/modal.css";

const Modal = ({ post, images, id, onClick }) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <>
      <div className="backdrop" onClick={onClick}></div>
      <div className="modalCard-Post">
        {/* modal image */}
        <div className="modalImage h-100">
          {post.images.length > 0 && (
            <ModalCarousel images={post.images} id={post._id} />
          )}
        </div>
        {/* modal header */}
        <div className="modalHeader">
          <div className="d-flex">
            <Avatar src={post.user.avatar} size="big-avatar" />
            <div className="card_name">
              <h6 className="m-0">
                <Link to={`/profile/${post.user._id}`} className="text-dark">
                  {post.user.username}
                </Link>
              </h6>

              <small className="text-muted">
                {moment(post.createdAt).fromNow()}
              </small>
            </div>
          </div>
        </div>
        {/* modal content */}
        <div className="modalContent">
          <span>
            {post.content.length < 30
              ? post.content
              : readMore
              ? post.content + " "
              : post.content.slice(0, 60) + "....."}
          </span>
          {post.content.length > 60 && (
            <span
              className="readMore"
              style={{ color: "red" }}
              onClick={() => setReadMore(!readMore)}
            >
              {readMore ? "Hide content" : "Read more"}
            </span>
          )}
        </div>

        {/* modal footer */}
        <div className="modalFooter">
          <Footer post={post} />
        </div>
        {/* modal input */}
        <div className="modalInput">
          <InputComment post={post} />
        </div>
        {/* modal comment */}
        <div className="modalComment">
          <ModalComments post={post} />
        </div>
      </div>
    </>
  );
};

export default Modal;
