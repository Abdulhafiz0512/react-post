import { useState } from "react";
import { useParams, Link } from "react-router-dom";

const PostPage = ({ posts, handleDelete, setPost}) => {
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const handleSave = () => {
    setPost(post.id, title, body);
    setEdit(false);
  };
  return (
    <main className="PostPage">
      <article className="post">
        {post && (
          <>
           
            {edit ? (
              <div style={{display:"flex",
                flexDirection:"column"
              }}>
                <input className="edit-input" style={{marginBottom:"1rem"}}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                 style={{marginBottom:"1rem", height:"300px"}}
                 
                  className="edit-input-s"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2>{post.title}</h2>
                <p className="postDate">{post.datetime}</p>
                <p className="postBody">{post.body}</p>
              </div>
            )}
            <button onClick={() => handleDelete(post.id)}>Delete Post</button>
            <button
              onClick={() => {
                if (edit) {
                    handleSave();
                  } else {
                    setEdit(true);
                  }
                }
              }
              style={{
                marginLeft: "10px",
                backgroundColor: edit ? "blue" : "green",
              }}
            >
              {edit ? "Save" : "Edit"}
            </button>
          </>
        )}
        {!post && (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to="/">Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;
