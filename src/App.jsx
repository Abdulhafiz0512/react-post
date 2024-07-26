import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL + "/posts";
  useEffect(() => {
    async function fetchPosts() {
      setFetching(true);
      setError(null);
      const response = await fetch(base_url);
      try {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedPosts = await response.json();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error(error.message);
        setError("Error fetching posts: " + error.message);
      } finally {
        setFetching(false);
      }
    }
    fetchPosts();
  }, []);
  useEffect(() => {
    const filteredPosts = posts.filter((post) => {
      if (
        post.title.toUpperCase().includes(search.toUpperCase()) ||
        post.body.toUpperCase().includes(search.toUpperCase())
      ) {
        return true;
      } else {
        return false;
      }
    });

    setSearchResults(filteredPosts);
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });
    try {
      if (!(await response).ok) {
        throw new Error("Network response was not ok");
      }
      setPosts([newPost, ...posts]);
      setPostBody("");
      setPostTitle("");
      navigate("/");
    } catch {
      console.error(error.message);
      setError("Error fetching posts: " + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    const response = await fetch(base_url + `/${id}`, { method: "DELETE" });
    try {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const remainedPosts = posts.filter((posts) => {
        if (posts.id != id) return true;
      });
      setPosts(remainedPosts);
      navigate("/");
    } catch {
      console.error(error.message);
      setError("Error fetching posts: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = (id, newTitle, newBody) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, title: newTitle, body: newBody } : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div className="App">
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      {fetching && <p>Loading...</p>}
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} />
        <Route
          path="/post"
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
              creating={creating}
            />
          }
        />
        <Route
          path="/post/:id"
          element={
            <PostPage
              posts={posts}
              handleDelete={handleDelete}
              setPost={handleUpdate}
              deleting={deleting}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
