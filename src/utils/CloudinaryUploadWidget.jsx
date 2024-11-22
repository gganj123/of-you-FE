import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../App.css';
// import '../common/style/common.style.css';

const CLOUDNAME = `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`;
const UPLOADPRESET = `${import.meta.env.VITE_CLOUDINARY_PRESET}`;

class CloudinaryUploadWidget extends Component {
  static propTypes = {
    uploadImage: PropTypes.func.isRequired
  };
  componentDidMount() {
    // Cloudinary 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => this.createUploadWidget();
    document.body.appendChild(script);
  }

  createUploadWidget() {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          document.getElementById('uploadedimage').setAttribute('src', result.info.secure_url);
          this.props.uploadImage(result.info.secure_url);
        }
      }
    );

    document.getElementById('upload_widget').addEventListener(
      'click',
      function () {
        console.log('CLOUDNAME : ', CLOUDNAME);
        console.log('UPLOADPRESET : ', UPLOADPRESET);
        myWidget.open();
      },
      false
    );
  }

  render() {
    return (
      <Button id='upload_widget' size='sm' className='ml-2'>
        Upload Image +
      </Button>
    );
  }
}

export default CloudinaryUploadWidget;
