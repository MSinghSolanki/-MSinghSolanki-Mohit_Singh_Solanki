// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './App.css';

// const ShareButtons = () => {
//   const [imageUrl, setImageUrl] = useState('');

//   useEffect(() => {
//     fetchRandomImage();
//   }, []);

//   const fetchRandomImage = async () => {
//     try {
//       const response = await axios.get('https://picsum.photos/200/300');
//       const imageUrl = response.request.responseURL;
//       setImageUrl(imageUrl);
//     } catch (error) {
//       console.error('Failed to fetch random image:', error);
//     }
//   };

//   useEffect(() => {
//     const link = encodeURI('https://picsum.photos/');
//     const encodedImageUrl = encodeURIComponent(imageUrl);

//     const msg = encodeURIComponent('Hey, I found this article');

//     const fb = document.querySelector('.facebook');
//     fb.href = `https://www.facebook.com/share.php?u=${link}&picture=${encodedImageUrl}`;

//     const twitter = document.querySelector('.twitter');
//     twitter.href = `http://twitter.com/share?&url=${link}&text=${msg}&hashtags=javascript,programming&media=${encodedImageUrl}`;

//     const whatsapp = document.querySelector('.whatsapp');
//     whatsapp.href = `https://api.whatsapp.com/send?text=${msg}: ${link} ${encodedImageUrl}`;

//     // Update meta tags for social media sharing
//     const metaTags = document.getElementsByTagName('meta');
//     for (let i = 0; i < metaTags.length; i++) {
//       if (metaTags[i].getAttribute('property') === 'og:image') {
//         metaTags[i].setAttribute('content', imageUrl);
//       }
//     }
//   }, [imageUrl]);

//   return (
//     <div id="share-buttons">
//       <div id="image-container">
//         <img id="random-image" src={imageUrl} alt="Random Image" />
//       </div>
//       <a className="facebook" href="#" target="_blank" rel="noopener noreferrer">
//         <i className="fab fa-facebook"></i>
//       </a>
//       <a className="twitter" href="#" target="_blank" rel="noopener noreferrer">
//         <i className="fab fa-twitter"></i>
//       </a>
//       <a className="whatsapp" href="#" target="_blank" rel="noopener noreferrer">
//         <i className="fab fa-whatsapp"></i>
//       </a>
//     </div>
//   );
// };

// export default ShareButtons;

























import React, { useEffect, useState } from "react";
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton, FacebookIcon, WhatsappIcon, TwitterIcon } from "react-share";
import axios from "axios";
import { Helmet } from 'react-helmet';
import { useLocation } from "react-router-dom";
import "./App.css"

const App = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [imageList, setImageList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImageList();
  }, []);

  const fetchImageList = async () => {
    try {
      const response = await axios.get("https://picsum.photos/v2/list");
      const data = response.data;
      setImageList(data);
      getRandomImage(data);
    } catch (error) {
      console.error("Failed to fetch image list: ", error);
    }
  };

  const getRandomImage = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomImage = data[randomIndex];
    const imageUrl = randomImage.download_url;
    setImageUrl(imageUrl);
    setSelectedImage({ ...randomImage, index: randomIndex });


  }
  const getShareUrl = () => {
    if (selectedImage) {
      const imageUrlParam = (selectedImage.download_url);
      const shareUrl = `${imageUrlParam}`;
      return shareUrl;
    }
    return window.location.href;
  };

  const getImageFromSharedUrl = () => {
    const imageUrlParam = queryParams.get("imageUrl");
    if (imageUrlParam) {
      const imageUrl = decodeURIComponent(imageUrlParam);
      setSelectedImage({ download_url: imageUrl });
      setImageUrl(imageUrl);

    }
  };

  useEffect(() => {
    getImageFromSharedUrl();
  }, []);
  
  const renderMetaTags = () => {
    if (selectedImage) {
      const metaTags = [
        <meta property="og:image" content={selectedImage.download_url}/>,
        <meta name="twitter:image" content={selectedImage.download_url}/>,
        <meta name="twitter:card" content="summary_large_image" />,
        <meta name="twitter:image:alt" content="Alt text for image" />
      ];
  
      return metaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ));
    }
  
    return null;
  };
  

  return (
    <div>
   <Helmet>
    {renderMetaTags()}
   </Helmet>

    <div id="image-container">
      <img id="random-image" src={imageUrl} alt="Random Image" />
    </div>
    <div id="btn">
      <FacebookShareButton url={getShareUrl()} quote="Check out this random image!">
        <FacebookIcon size={32} />
      </FacebookShareButton>
      <WhatsappShareButton url={getShareUrl()}>
        <WhatsappIcon size={32} />
      </WhatsappShareButton>
      <TwitterShareButton url={getShareUrl()} title="Check out this random image!">
        <TwitterIcon size={32} />
      </TwitterShareButton>
    </div>
  </div>
);
};

export default App;
