import React, { useState } from "react";
import CardHeader from "./home/post_card/CardHeader";
import CardBody from "./home/post_card/CardBody";
import CardFooter from "./home/post_card/CardFooter";
import Modal from "./Modal";
import Comments from "./home/Comments";
import InputComment from "./home/InputComment";
import "../styles/modal.css";
import { patchDataAPI } from "../utils/fetchData";
import { useSelector } from "react-redux";

const PostCard = ({ post, theme }) => {
  const { auth } = useSelector((state) => state);

  const [modal, setModal] = useState(false);

  const handlePostClick = async () => {
    setModal(true);
    try {
      await patchDataAPI(`post/${post._id}/updateview`, null, auth.token);
    } catch (error) {
      console.log(error);
    }
  };

  const turnOffModal = () => {
    setModal(false);
  };

  return (
    <div className="card my-3">
      <CardHeader post={post} />
      <CardBody post={post} theme={theme} onClick={handlePostClick} />
      <CardFooter post={post} />
      <Comments post={post} />
      <InputComment post={post} />
      {modal && (
        <Modal
          post={post}
          images={post.images}
          id={post._id}
          onClick={turnOffModal}
        />
      )}
    </div>
  );
};

export default PostCard;
