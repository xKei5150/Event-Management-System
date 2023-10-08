import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import HomePage from "../components/MainPage/HomePage/HomePage";
import EventsPage from "../components/MainPage/EventsPage/EventsPage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/HomePage">
                <HomePage/>
            </ComponentPreview>
            <ComponentPreview path="/EventsPage">
                <EventsPage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews