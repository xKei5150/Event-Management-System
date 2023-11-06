import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import HomePage from "../components/MainPage/HomePage/HomePage";
import AnnouncementsPage from "../components/MainPage/AnnouncementsPage/AnnouncementsPage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/HomePage">
                <HomePage/>
            </ComponentPreview>
            <ComponentPreview path="/AnnouncementsPage">
                <AnnouncementsPage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews