import React  , { Component }  from "react"
import ContentHead from './component/ContentHead.jsx'
import ContentBody from "./component/ContentBody.jsx";
// import ProgramLiatDialog from './component/ProgramLiatDialog.jsx'
import "./ProgramRead.scss";
export default class ProgramRead extends Component {
                 constructor(props) {
                   super(props);
                   this.state = { };
                 }
               
                 render() {
                   return <div className="main-content">
                       <ContentHead />
                       <ContentBody />
                     </div>;
                 }
               }