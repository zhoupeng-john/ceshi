import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    
    // 添加文件大小检查
    if (imageFile.size > 10 * 1024 * 1024) { // 10MB
      alert('文件过大！请选择小于10MB的图片');
      return;
    }
    
    setOriginalImage(imageFile);
    
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: quality
    };

    try {
      setLoading(true);
      const compressedFile = await imageCompression(imageFile, options);
      setCompressedImage(compressedFile);
    } catch (error) {
      console.error('图片压缩失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedImage);
    link.download = 'compressed-image.' + compressedImage.name.split('.').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 添加拖拽上传功能
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  // 添加压缩质量选项
  const [quality, setQuality] = useState(0.8);

  const handleQualityChange = (e) => {
    setQuality(parseFloat(e.target.value));
  };

  return (
    <div className="image-compressor">
      <h1>图像压缩工具</h1>
      
      <div className="instructions">
        <h2>使用说明</h2>
        <ol>
          <li>调整压缩质量滑块（0.1-1.0，数值越大质量越好）</li>
          <li>点击"选择文件"按钮或直接将图片拖放到虚线框内</li>
          <li>等待压缩完成</li>
          <li>预览压缩效果</li>
          <li>点击"下载压缩后的图片"保存结果</li>
        </ol>
      </div>

      <div className="quality-control">
        <label>压缩质量: {quality}</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={quality}
          onChange={handleQualityChange}
        />
      </div>

      <div className="upload-area">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <p>将图片拖放到这里，或点击选择文件</p>
        <p className="file-limit">支持的格式：JPG、PNG、WEBP等</p>
        <p className="file-limit">最大文件大小：10MB</p>
      </div>

      <div className="preview-container">
        {originalImage && (
          <div className="image-preview">
            <h3>原始图片</h3>
            <img
              src={URL.createObjectURL(originalImage)}
              alt="原始图片"
            />
            <p>大小: {(originalImage.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {compressedImage && (
          <div className="image-preview">
            <h3>压缩后的图片</h3>
            <img
              src={URL.createObjectURL(compressedImage)}
              alt="压缩后的图片"
            />
            <p>大小: {(compressedImage.size / 1024 / 1024).toFixed(2)} MB</p>
            <button onClick={downloadImage}>下载压缩后的图片</button>
          </div>
        )}

        {loading && <p>压缩中...</p>}
      </div>
    </div>
  );
}

export default ImageCompressor; 