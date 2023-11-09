import React, { useState, useEffect } from 'react';
import * as API from '../../../api';
import { VscTriangleDown } from "react-icons/vsc";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.scss';

import './HtmlBlock.scss';

export default (props: any) => {
  const [data, setData] = useState([]);

  //set disable prev or next buttons
  useEffect(() => {
    (async () => {
      let [groups, data] = await Promise.all([
        API.GetUserGroups(props.SPcontext),
        API.GetListByTitle('Important Info')
      ]);

      data = data.reverse().filter(item => !item.AccessGroup || groups.includes(item.AccessGroup)).map(item => ({
        ...item,
        ShowTitle: window.location.href.includes('/es/') ? item.TitleSpanish : item.Title
      }));
      setData(data);
    })()
  }, []);

  useEffect(() => {
    const _data = data.map(item => ({
      ...item,
      ShowTitle: window.location.href.includes('/es/') ? item.TitleSpanish : item.Title
    }));
    setData(_data);
  }, [window.location.href]);

  return (
    <div className='custom-html-block_wrap'>
      <Swiper
        slidesPerView={2}
        spaceBetween={20}
        navigation
        //loop
        //maxBackfaceHiddenSlides={3}
        modules={[Navigation]}
        className="mySwiper"
      >
        {data.map(item => <SwiperSlide>
          <div className='custom-html-block'>
            <div className='img'>
              {item.Image && item.Image.Url && <img src={item.Image.Url} />}
            </div>
            <div className='info'>
              <div className='title'>{item.ShowTitle}</div>
              {item.Link && item.Link.Url &&
                <a target='_blank' href={item.Link.Url}><VscTriangleDown style={{ fontSize: '18px', marginBottom: '-4px' }} /> Acceso</a>
              }
            </div>
          </div>
        </SwiperSlide>
        )}
      </Swiper>

    </div>
  )
}