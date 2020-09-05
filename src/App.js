import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe(null);
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerimage"
                src="https://images.squarespace-cdn.com/content/v1/5c51bdd1365f02302140068f/1550250212460-BHGJMW1P6UUVKTU0QXJK/ke17ZwdGBToddI8pDm48kJs_HBdWDLf-EXxRZ4CnwM4UqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcP9rRV0hZDS6ARTS8uDRxswyaJYjr47PJG948MGCevLYyfopc1B_yNOcn47GmD0Up/instagram-logo.png?format=300w"
                alt=""
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://images.squarespace-cdn.com/content/v1/5c51bdd1365f02302140068f/1550250212460-BHGJMW1P6UUVKTU0QXJK/ke17ZwdGBToddI8pDm48kJs_HBdWDLf-EXxRZ4CnwM4UqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcP9rRV0hZDS6ARTS8uDRxswyaJYjr47PJG948MGCevLYyfopc1B_yNOcn47GmD0Up/instagram-logo.png?format=300w"
                alt=""
              />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
            {/* <Button onClick={() => setOpen(false)}>Close</Button> */}
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerimage"
          src="https://images.squarespace-cdn.com/content/v1/5c51bdd1365f02302140068f/1550250212460-BHGJMW1P6UUVKTU0QXJK/ke17ZwdGBToddI8pDm48kJs_HBdWDLf-EXxRZ4CnwM4UqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcP9rRV0hZDS6ARTS8uDRxswyaJYjr47PJG948MGCevLYyfopc1B_yNOcn47GmD0Up/instagram-logo.png?format=300w"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div></div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B-HVQqGJNMe/?utm_source=ig_web_copy_link"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      <div className="image_Upload">
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <div className="need_to_login">
            <h3>Need to login¯\_(ツ)_/¯</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
