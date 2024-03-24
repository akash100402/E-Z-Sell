// import React from 'react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import image1 from './images/1.jpg';
// import image2 from './images/2.jpg';
// import image3 from './images/3.jpg';

// const BannerSlide = () => {
//   // Slick settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   return (
//     <div id='banner' className="banner-slide">
//       <Slider {...settings}>
        // <div>
        //   <img src={image1} alt="Slide 1" />
        // </div>
        // <div>
        //   <img src={image2} alt="Slide 2" />
        // </div>
        // <div>
        //   <img src={image3} alt="Slide 3" />
        // </div>
//       </Slider>
//     </div>
//   );
// };

// export default BannerSlide;


import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';

const BannerSlide = () => {
  const settings = {
    infinite: true,
    clickToSlide:true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  // Define a CSS class for the images with fixed dimensions
  const imageStyle = {
    width: '1120px',
    height: '320px',
  };
 
  return (
    <div className="banner-slide" id='banner'>
      <Slider {...settings}>
      <div>
          <img src={image1} alt="Slide 1" style={imageStyle} />
        </div>
        <div>
          <img src={image2} alt="Slide 2" style={imageStyle}  />
        </div>
        <div>
          <img src={image3} alt="Slide 3" style={imageStyle}  />
        </div>
        <div>
          <img src={image4} alt="Slide 3" style={imageStyle}  />
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlide;
