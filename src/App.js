import React, { Component } from "react";
import "./App.scss";
import Routes from "./Routes";
import { connect } from "react-redux";
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import vi from "react-intl/locale-data/vi";
import viMessages from "./utils/locales/vi.json";
import enMessages from "./utils/locales/en.json";

addLocaleData(en, enMessages);
addLocaleData(vi, viMessages);

const getLocale = locale => ({
    locale,
    messages: locale === "en" ? viMessages : viMessages
});

class App extends Component {
    constructor(props) {
        super(props);
    }

    closeAlert = () => {
        this.props.clear();
    };

    render() {
        return (
          <div className="body-container">
              <div className="wrapper">
                  <IntlProvider {...getLocale(this.props.locale)}>
                      <Routes />
                  </IntlProvider>
              </div>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    locale: state.translation.locale
});

export default connect(mapStateToProps)(App);
