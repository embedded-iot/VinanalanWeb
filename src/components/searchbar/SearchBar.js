import React, { Component } from "react";

export default class SearchBar extends Component {
    render() {
        return(
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Search products ..."
                       aria-label="Search products" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">Search</button>
                    </div>
            </div>
        );
    }
}
