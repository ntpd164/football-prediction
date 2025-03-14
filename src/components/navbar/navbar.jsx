import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import userIcon from "../../assets/user.png";


const Bar = ({children}) => {
  return(
    <>
    <style>
      {`
        body {
            margin: 0;
            padding: 0;
            font-size: 16px;
            font-family: Arial, sans-serif;
              }
        .bar {
            height: 3.75em;
            width: 100%;
            top: 0;
            position: fixed;
            overflow: hidden;
            background-color: #DD3333;
            display: flex;
            justify-content: center; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .link {
            float: left;
            display: block;
            color: #ffffff;
            text-align: center;
            padding: 0.875em 1em;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold; 
            width: 10.9em;
            border-right: 0.0625em solid #B22D2D;
            position: relative;
        }
        .link:first-child {
            text-align: left;
            width: 20em;
        }
        .link:first-child.active::after {
          width:0%
        }
        .link:last-child {
          width: auto;
          min-width: 10.9em;
        }
        .link:first-child.active{
          background-color: #DD3333
        }
        .link:hover {
            background-color: #FF8F8F;
          }
          .link.active {
            background-color: #B22D2D;
          }
          .link.active::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 0.25em;
            background-color: yellow;
            bottom: 0;
            left: 0;
          }
        
      }   `
    }
    </style> 
    <nav className="bar">
      {children}
    </nav>
    </>
  )
}

const NavigationBar = () => {
  const location = useLocation();
  const { userName, setUserName } = useContext(UserContext)

  // const isActive = (path) => {
  //   return location.pathname === path || location.pathname.startsWith(`${path}/`);
  // };
  if (userName == null)
  return(
    <Bar>
      <NavLink to="/" className="link" end>Football Prediction</NavLink>
      <NavLink to="/" className={({ isActive }) => isActive || location.pathname.startsWith('/matches/')? 'link active' : 'link'} end>Lịch thi đấu</NavLink>
      <NavLink to="/standings" className="link">Bảng xếp hạng</NavLink>
      <NavLink to="/clubs" className="link">Câu lạc bộ</NavLink>
      <NavLink to="/chatbot" className="link">Chatbot</NavLink>
      <NavLink to="/signin" className={({ isActive }) => isActive || location.pathname === '/signup' ? 'link active' : 'link'}>
      Đăng nhập
      </NavLink>
    </Bar>
  )
  else return(
    <Bar>
      <NavLink to="/" className="link" end>Football Prediction</NavLink>
      <NavLink to="/" className={({ isActive }) => isActive || location.pathname.startsWith('/matches/')? 'link active' : 'link'} end>Lịch thi đấu</NavLink>
      <NavLink to="/standings" className="link">Bảng xếp hạng</NavLink>
      <NavLink to="/clubs" className="link">Câu lạc bộ</NavLink>
      <NavLink to="/chatbot" className="link">Chatbot</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive || location.pathname === '/signup' ? 'link active' : 'link'}>
        <div className="flex justify-items-start">
          <img className="w-12 h-12 ml-16 ml-4" src={userIcon} alt="User Icon" />
          <div className="ml-4">{userName}</div>
        </div>
        </NavLink>
      
    </Bar>
  )
}
export default NavigationBar;