import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import HomePage from "../components/HomePage/HomePage";
import EventsPage from "../components/EventsPage/EventsPage";

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