// import { useState, useRef, useEffect } from 'react';
// import Konva from 'konva';

// type CoverPosition = {
//   x: number;
//   y: number;
// };

// type CoverSize = {
//   width: number;
//   height: number;
// };

// export const useDiaryCover = () => {
//   const [coverTitle, setCoverTitle] = useState('더블클릭후 작성');
//   const [coverTitlePosition, setCoverTitlePosition] = useState<CoverPosition>({
//     x: 150,
//     y: 150
//   });
//   const [coverTitleFontSize, setCoverTitleFontSize] = useState(30);
//   const [coverTitleWidth, setCoverTitleWidth] = useState(220);
//   const [coverTitleRotation, setCoverTitleRotation] = useState(0);
//   const [coverImage, setCoverImage] = useState<HTMLImageElement | null>(null);
//   const [coverImagePosition, setCoverImagePosition] = useState<CoverPosition>({
//     x: 50,
//     y: 50
//   });
//   const [coverImageSize, setCoverImageSize] = useState<CoverSize>({
//     width: 0,
//     height: 0
//   });
//   const [coverImageRotation, setCoverImageRotation] = useState(0);
//   const [coverBackgroundColor, setCoverBackgroundColor] = useState('#acacac');
//   const [coverSelectedElement, setCoverSelectedElement] = useState<Konva.Node | null>(null);
//   const [coverScale, setCoverScale] = useState(1);
//   const [coverStageSize, setCoverStageSize] = useState<CoverSize>({
//     width: 512,
//     height: 800
//   });

//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const stageRef = useRef<Konva.Stage | null>(null);
//   const textRef = useRef<Konva.Text | null>(null);
//   const imageRef = useRef<Konva.Image | null>(null);
//   const trRef = useRef<Konva.Transformer | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement | null>(null);

//   const handleResize = () => {
//     const newWidth = window.innerWidth > 512 ? 512 : window.innerWidth;
//     const newHeight = (newWidth / 512) * 800;
//     setCoverStageSize({ width: newWidth, height: newHeight });
//     setCoverScale(newWidth / 512);
//   };

//   useEffect(() => {
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return {
//     coverTitle,
//     setCoverTitle,
//     coverTitlePosition,
//     setCoverTitlePosition,
//     coverTitleFontSize,
//     setCoverTitleFontSize,
//     coverTitleWidth,
//     setCoverTitleWidth,
//     coverImage,
//     setCoverImage,
//     coverImagePosition,
//     setCoverImagePosition,
//     coverImageSize,
//     setCoverImageSize,
//     coverBackgroundColor,
//     setCoverBackgroundColor,
//     coverSelectedElement,
//     setCoverSelectedElement,
//     coverScale,
//     coverStageSize,
//     coverTitleRotation,
//     setCoverTitleRotation,
//     coverImageRotation,
//     setCoverImageRotation,
//     imageFile,
//     setImageFile,
//     stageRef,
//     textRef,
//     imageRef,
//     trRef,
//     textareaRef
//   };
// };
