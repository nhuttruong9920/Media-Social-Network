import React from "react";
import "../../styles/group_modal.css";

function SearchResult({user}) {
  return (
    <div className="searchResult">
      <img alt="avatar" src={user.avatar} className="small-avatar"></img>
      <div>{user.username}</div>
    </div>
  );
}

export default SearchResult;
