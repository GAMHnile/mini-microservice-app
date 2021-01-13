import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"

import App from './App'

describe("Test App.js",()=>{
    it("renders h1 s  with CreatePost and Posts", ()=>{
        expect.assertions(2);
        const { getByText } = render(<App />);
        expect(getByText("Create post")).toBeInTheDocument();
        expect(getByText("Posts")).toBeInTheDocument();

    });
});