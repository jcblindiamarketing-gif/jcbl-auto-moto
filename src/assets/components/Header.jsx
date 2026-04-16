import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>JCBL Automoto</h2>

      <nav>
        <Link to="/" style={styles.link}>Home</Link>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#222",
    color: "#fff"
  },
  logo: {
    margin: 0
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "20px"
  }
};

export default Header;