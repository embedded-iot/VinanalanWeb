import React from "react";
import {Button} from "antd";
import "./ReactSlick.scss"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const defaultSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  initialSlide: 0,
  // autoplay: true,
  // autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 1500,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 1366,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 1060,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const ReactSlick = (props) => {
  const settings= { ...defaultSettings, ...props.settings};
  return (
    <div className="react-slick-wrapper">
      <Slider {...settings}>
        {
          props.list && props.list.map((item, index) =><div key={'react-slick-' + index}><img className='slick-item' src={item}></img></div> )
        }
      </Slider>
    </div>
  )
}

ReactSlick.defaultProps = {
  list: []
}

export default ReactSlick;

