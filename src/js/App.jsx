import React, { Component } from "react";
import CSSModules from "react-css-modules";
import logo from "../assets/favicon/source/leaf-900.png";
import styles from "../styles/App.scss";

class App extends Component {
	render() {
		return (
			<div>
				<header styleName="App-header">
					<span styleName="App-greeting">
						<i styleName="fas fa-rocket" /> Hello world!{" "}
						<i styleName="fas fa-code" />
					</span>
					<img styleName="App-logo" src={logo} alt="logo" />
				</header>
			</div>
		);
	}
}

export default CSSModules(App, styles, { allowMultiple: true });
