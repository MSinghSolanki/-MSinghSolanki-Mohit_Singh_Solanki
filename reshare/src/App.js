import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, WhatsappIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import { useLocation, useNavigate } from 'react-router-dom';
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://pixabay.com/api/?key=38119579-bc9a976021967e74f44f1cf25&q=Nature+mountains&image_type=photo');
        const images = response.data.hits;
        selectRandomImage(images);
        
      } catch (error) {
        console.error('Failed to fetch images: ', error);
      }
    };

    fetchImages();
  }, []);

  const selectRandomImage = (images) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    setSelectedImage({ ...randomImage, index: randomIndex });
  };

  const getShareUrl = () => {
    if (selectedImage) {
      return selectedImage.webformatURL;
    }
    return window.location.href;
  };

  const getImageFromSharedUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    const imageUrl = queryParams.get('imageUrl');

    if (imageUrl) {
      setSelectedImage({ webformatURL: decodeURIComponent(imageUrl) });
    }
  };

  useEffect(() => {
    getImageFromSharedUrl();
  }, []);

  const renderMetaTags = () => {
    if (selectedImage) {
      const metaTags = [
        { property: 'og:image', content: selectedImage.webformatURL },
        { property: 'og:image:width', content: selectedImage.webformatWidth },
        { property: 'og:image:height', content: selectedImage.webformatHeight },
        { property: 'og:url', content: window.location.href },
      ];
console.log(metaTags)
      return metaTags.map((tag, index) => <meta key={index} property={tag.property} content={tag.content} />);
    }

    return null;
  };

  return (
    <div className="App">
      <Helmet>
        {renderMetaTags()}
      </Helmet>
      {selectedImage && (
        <div id="share">
          <img src={selectedImage.webformatURL} alt="Shared Image" />
        </div>
      )}
      <div id="btn">
        {selectedImage && (
          <>
            <FacebookShareButton url={getShareUrl()}>
              <FacebookIcon size={32} />
            </FacebookShareButton>
            <WhatsappShareButton url={getShareUrl()}>
              <WhatsappIcon size={32} />
            </WhatsappShareButton>
            <TwitterShareButton url={getShareUrl()} title="Check out this image">
              <TwitterIcon size={32} />
            </TwitterShareButton>
            <LinkedinShareButton url={getShareUrl()}>
              <LinkedinIcon size={32} />
            </LinkedinShareButton>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
