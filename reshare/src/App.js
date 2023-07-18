


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

   <div className="header">
        <h1>Image Share</h1>
      </div>

      <div>
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

      <div className="footer">
        You can share Images with Friends and family
      </div>
    </div>
);
};

export default App;
