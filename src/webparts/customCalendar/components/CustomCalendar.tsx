import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { TooltipHost, TooltipDelay } from "office-ui-fabric-react";
import { BsCircleFill } from "react-icons/bs";
import moment from 'moment';
import * as API from '../../../api';
import "react-datepicker/dist/react-datepicker.css";
import './CustomCalendar.scss';

export default (props: any) => {
  const [date_arr, setDateArr] = useState([]);
  const [data, setData] = useState({} as any);

  useEffect(() => {
    (async () => {
      const data = await API.GetListByTitle('Calendar');

      let date_arr = [] as any, _data = {} as any;
      data.forEach((item: any) => {
        const start = moment(item.EventDate).format('MM DD YYYY');
        const end = moment(item.EndDate).format('MM DD YYYY');

        if (!item.fRecurrence) {
          const _start = moment(item.EventDate).format('MM/DD/YYYY HH:00');
          const _end = moment(item.EndDate).format('MM/DD/YYYY HH:00');
          item.Title = `${item.Title} - ${item.fAllDayEvent ? moment(_end).format('MM/DD/YYYY') : `${_start} - ${_end}`}`;
        }

        if (start === end || item.fAllDayEvent) {
          date_arr.push(end);

          const tooltipId = moment(end).format('MMDDYYYY');
          _data = AddToObj(tooltipId, item, _data);
        }
        else if (item.fRecurrence) {
          let currentDate = moment(start);
          while (currentDate <= moment(end)) {
            const _date = moment(currentDate).format('MM DD YYYY');
            const tooltipId = moment(currentDate).format('MMDDYYYY');
            _data = AddToObj(tooltipId, item, _data);

            date_arr.push(_date);
            currentDate = moment(currentDate).add(1, 'years');
          }
        } else {
          let currentDate = moment(start);
          while (currentDate <= moment(end)) {
            const tooltipId = moment(currentDate).format('MMDDYYYY');
            _data = AddToObj(tooltipId, item, _data);

            date_arr.push(moment(currentDate).format('MM DD YYYY'))
            currentDate = moment(currentDate).add(1, 'days');
          }
        }
      })

      setDateArr(date_arr);
      setData(_data);
    })()
  }, []);

  const renderDayContents = (day: any, date: any) => {
    const _date = moment(date).format('MM DD YYYY');
    const tooltipId = moment(date).format('MMDDYYYY');

    return <span>{day} {date_arr.includes(_date) ?
      <TooltipHost
        tooltipProps={{
          onRenderContent: () => (
            <ul style={{ padding: 0, margin: 0 }}>
              {data[tooltipId] ? data[tooltipId].map(item =>
                <li>
                  <a style={{ color: '#fff' }} target='_blank' href={`${window.location.href}/Lists/Calendar/DispForm.aspx?ID=${item.Id}`}>{item.Title}</a>
                </li>)
                : null}
            </ul>
          ),
          calloutProps: {
            styles: {
              beak: { background: '#5e5e5e' },
              beakCurtain: { background: '#5e5e5e' },
              calloutMain: { background: '#5e5e5e' },
            },
          },
        }}
        delay={TooltipDelay.zero}
        id={tooltipId}
      >
        <BsCircleFill aria-describedby={tooltipId} />
      </TooltipHost>

      : null}</span>;
  };

  return (
    <>
      <div className='calendar-header'>{window.location.pathname.includes('/es/') ? 'Calendario' : 'Calendar'}</div>
      <DatePicker
        selected={null}
        onChange={(date) => { }}
        monthsShown={1}
        inline
        renderDayContents={renderDayContents}
        disabled
      />
    </>
  )
}

function AddToObj(key, val, obj) {
  if (obj[key])
    obj[key] = [...obj[key], val]
  else {
    obj[key] = [val];
  }

  return obj;
}