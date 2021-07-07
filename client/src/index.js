import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import GettingGraphQLData from "./components/GettingGraphQLData";

const client = new ApolloClient({
	uri: "http://localhost:3001/person"
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<GettingGraphQLData />
	</ApolloProvider>,
	document.getElementById("root")
);

