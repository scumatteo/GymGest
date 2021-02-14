
import React, { Component } from 'react';
import { withRouter } from "react-router";
import Axios from "axios";
import GridListView from './GridListView';

const globals = require("../global/globals");

class CourseGridList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: "",
            items: [],
        };
    }

    componentDidMount() {
        Axios.get(`http://localhost:3001/api/coaches`, {
            headers: { "x-access-token": globals.token },
        }).then((res) => {
            const items = res.data;
            this.setState({ items: items });
            this.setState({ type: "course" });
        });
    }

    render() {
        return (
            <GridListView type={this.state.type} items={this.state.items} />
        );
    }
}

export default (withRouter(CourseGridList));