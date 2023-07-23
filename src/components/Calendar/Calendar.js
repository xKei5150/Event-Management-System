// Events.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {Box} from "@chakra-ui/react";

const Calendar = ({ events, handleDateClick, handleEventClick }) => {
    return (
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                themeSystem="Materia"
                dayCellDidMount={(arg) => {
                    const date = arg.date;
                    const day = date.getDay();
                    const isWeekend = day === 6 || day === 0;
                    if (isWeekend) {
                        arg.el.classList.add('fc-day-disabled');
                    }
                }}
                events={events}
                eventColor= "#800000"
                eventClick={handleEventClick}
                dateClick={handleDateClick}
            />
    );
};

export default Calendar;
