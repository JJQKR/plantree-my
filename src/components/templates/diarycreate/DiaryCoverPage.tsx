'use client';
import { useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Transformer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { supabase } from '@/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';

const DiaryCoverPage: React.FC = () => {
  const router = useRouter();
  const { diaryId } = useParams();

  const {
    coverTitle,
    setCoverTitle,
    coverTitlePosition,
    setCoverTitlePosition,
    coverTitleFontSize,
    setCoverTitleFontSize,
    coverTitleWidth,
    setCoverTitleWidth,
    coverImage,
    setCoverImage,
    coverImagePosition,
    setCoverImagePosition,
    coverImageSize,
    setCoverImageSize,
    coverBackgroundColor,
    setCoverBackgroundColor,
    coverSelectedElement,
    setCoverSelectedElement,
    coverScale,
    setCoverScale,
    coverStageSize,
    setCoverStageSize,
    coverTitleRotation,
    setCoverTitleRotation,
    coverImageRotation,
    setCoverImageRotation,
    imageFile,
    setImageFile,
    setCoverData
  } = useDiaryCoverStore();

  const stageRef = useRef<Konva.Stage | null>(null);
  const textRef = useRef<Konva.Text | null>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (trRef.current) {
      if (coverSelectedElement) {
        trRef.current.nodes([coverSelectedElement]);
      } else {
        trRef.current.nodes([]);
      }
      trRef.current.getLayer()?.batchDraw();
    }
  }, [coverSelectedElement]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.width(coverTitleWidth);
      textRef.current.fontSize(coverTitleFontSize);
      textRef.current.rotation(coverTitleRotation);
      textRef.current.getLayer()?.batchDraw();
    }
  }, [coverTitle, coverTitleWidth, coverTitleFontSize, coverTitleRotation]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.rotation(coverImageRotation);
    }
  }, [coverImageRotation]);

  const handleDownload = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'diary_cover.png';
      link.href = uri;
      link.click();
    }
  };

  const handleTextChange = () => {
    if (textRef.current) {
      setCoverTitlePosition({ x: textRef.current.x(), y: textRef.current.y() });
    }
  };

  const handleTextTransform = () => {
    if (textRef.current) {
      const node = textRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const width = node.width() * scaleX;

      if (Math.abs(scaleX - scaleY) < 0.1) {
        const scaleFactor = Math.min(scaleX, scaleY);
        const newFontSize = coverTitleFontSize * scaleFactor;
        setCoverTitleFontSize(newFontSize);
        setCoverTitleWidth(width);
      } else if (Math.abs(scaleY - 1) < 0.1) {
        setCoverTitleWidth(width);
      }

      setCoverTitlePosition({ x: node.x(), y: node.y() });
      setCoverTitleRotation(node.rotation());

      node.scaleX(1);
      node.scaleY(1);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        if (stageRef.current) {
          const stageWidth = stageRef.current.width();
          const stageHeight = stageRef.current.height();
          const maxWidth = stageWidth * 0.5;
          const maxHeight = stageHeight * 0.5;

          let newWidth = img.width;
          let newHeight = img.height;

          if (newWidth > maxWidth || newHeight > maxHeight) {
            const scale = Math.min(maxWidth / newWidth, maxHeight / newHeight);
            newWidth *= scale;
            newHeight *= scale;
          }

          setCoverImageSize({ width: newWidth, height: newHeight });
          setCoverImagePosition({
            x: (stageWidth - newWidth) / 2,
            y: (stageHeight - newHeight) / 2
          });
          setCoverImage(img);
        }
      };
      img.onerror = (error) => {
        console.error('이미지 로드 에러:', error);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = () => {
    if (imageRef.current) {
      setCoverImagePosition({
        x: imageRef.current.x(),
        y: imageRef.current.y()
      });
    }
  };

  const handleImageTransform = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const scale = Math.max(scaleX, scaleY);

      const newWidth = coverImageSize.width * scale;
      const newHeight = coverImageSize.height * scale;

      setCoverImageSize({ width: newWidth, height: newHeight });
      setCoverImagePosition({ x: node.x(), y: node.y() });
      setCoverImageRotation(node.rotation());

      node.scaleX(1);
      node.scaleY(1);
    }
  };

  const handleTextDblClick = (e: KonvaEventObject<MouseEvent>) => {
    const textNode = e.target as Konva.Text;
    const textPosition = textNode.absolutePosition();
    const stageBox = stageRef.current!.container().getBoundingClientRect();
    const rotation = textNode.rotation();

    textNode.hide();

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = `${stageBox.top + textPosition.y + window.scrollY}px`;
    textarea.style.left = `${stageBox.left + textPosition.x + window.scrollX}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${textNode.height() + textNode.fontSize()}px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight().toString();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.transform = `rotate(${rotation}deg)`;
    const fill = textNode.fill();
    if (typeof fill === 'string') {
      textarea.style.color = fill;
    }

    textareaRef.current = textarea;

    textarea.focus();

    textarea.addEventListener('keydown', handleKeyDown);
    textarea.addEventListener('blur', handleTextareaBlur);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleTextareaBlur();
    }
  };

  const handleTextareaBlur = () => {
    if (textareaRef.current) {
      const newText = textareaRef.current.value;
      setCoverTitle(newText);
      const textNode = textRef.current;
      if (textNode) {
        textNode.show();
        textNode.text(newText);
      }
      if (textareaRef.current.parentNode) {
        textareaRef.current.parentNode.removeChild(textareaRef.current);
      }
      textareaRef.current = null;
    }
  };

  const handleImageSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    setCoverSelectedElement(imageRef.current);
  };

  const handleTextSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    setCoverSelectedElement(textRef.current);
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverBackgroundColor(e.target.value);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty =
      e.target === e.target.getStage() ||
      (stageRef.current?.getChildren()[0] instanceof Konva.Layer &&
        stageRef.current?.getChildren()[0].getChildren()[0] === e.target);

    if (clickedOnEmpty) {
      setCoverSelectedElement(null);
      if (trRef.current) {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
      }
    }
  };

  const handleSaveAndContinue = async () => {
    let publicUrl: string | null = null;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cover_img')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('cover_img').getPublicUrl(fileName);

      if (!publicUrlData) {
        console.error('공개 URL 가져오기 실패');
        return;
      }

      publicUrl = publicUrlData.publicUrl;
    }

    const coverData = {
      cover_title: coverTitle || null,
      cover_title_position: coverTitlePosition,
      cover_title_fontsize: coverTitleFontSize,
      cover_title_width: coverTitleWidth,
      cover_title_rotation: coverTitleRotation,
      cover_image: publicUrl,
      cover_image_position: coverImagePosition,
      cover_image_size: coverImageSize,
      cover_image_rotation: coverImageRotation,
      cover_bg_color: coverBackgroundColor,
      cover_scale: coverScale,
      cover_stage_size: coverStageSize
    };

    setCoverData(coverData);

    if (diaryId) {
      router.push(`/member/diaryedit/${diaryId}/diaryparchment`);
    } else {
      router.push(`/member/diarycreate/diaryparchment`);
    }
  };

  const handleResize = () => {
    const newWidth = window.innerWidth > 512 ? 512 : window.innerWidth;
    const newHeight = (newWidth / 512) * 800;
    setCoverStageSize({ width: newWidth, height: newHeight });
    setCoverScale(newWidth / 512);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDeleteElement = () => {
    if (coverSelectedElement === textRef.current) {
      setCoverTitle(null);
      setCoverSelectedElement(null);
    } else if (coverSelectedElement === imageRef.current) {
      setCoverImage(null);
      setImageFile(null);
      setCoverSelectedElement(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && coverSelectedElement) {
        handleDeleteElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [coverSelectedElement]);

  const handleAddText = () => {
    setCoverTitle('더블클릭후 작성');
    setCoverTitlePosition({ x: 150, y: 150 });
    setCoverTitleFontSize(30);
    setCoverTitleWidth(220);
    setCoverTitleRotation(0);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex-grow flex flex-col justify-center items-center overflow-auto">
        <div className="max-w-lg w-full mb-4">
          <div className="relative w-full pb-[156.25%] overflow-hidden">
            <Stage
              className="absolute top-0 left-0 w-full h-full"
              width={coverStageSize.width}
              height={coverStageSize.height}
              ref={stageRef}
              onClick={handleStageClick}
            >
              <Layer>
                <Rect
                  x={0}
                  y={0}
                  width={coverStageSize.width}
                  height={coverStageSize.height}
                  fill={coverBackgroundColor}
                />
                {coverImage && (
                  <KonvaImage
                    image={coverImage}
                    x={coverImagePosition.x * coverScale}
                    y={coverImagePosition.y * coverScale}
                    width={coverImageSize.width}
                    height={coverImageSize.height}
                    draggable
                    ref={imageRef}
                    onDragEnd={handleImageChange}
                    onTransformEnd={handleImageTransform}
                    onClick={handleImageSelect}
                    onTap={handleImageSelect}
                    scaleX={coverScale}
                    scaleY={coverScale}
                  />
                )}
                <Text
                  text={coverTitle ?? ''}
                  fontSize={coverTitleFontSize}
                  x={coverTitlePosition.x * coverScale}
                  y={coverTitlePosition.y * coverScale}
                  width={coverTitleWidth}
                  fill="black"
                  draggable
                  ref={textRef}
                  onDragEnd={handleTextChange}
                  onTransformEnd={handleTextTransform}
                  onClick={handleTextSelect}
                  onTap={handleTextSelect}
                  onDblClick={handleTextDblClick}
                  onDblTap={handleTextDblClick}
                  wrap="word"
                  scaleX={coverScale}
                  scaleY={coverScale}
                />
                {coverSelectedElement && (
                  <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => ({
                      ...newBox,
                      width: Math.max(20, newBox.width),
                      height: Math.max(20, newBox.height)
                    })}
                    resizeEnabled={true}
                    enabledAnchors={[
                      'top-left',
                      'top-right',
                      'bottom-left',
                      'bottom-right',
                      'middle-left',
                      'middle-right'
                    ]}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>

        <div className="flex flex-col items-center max-w-lg w-full">
          <div className="flex flex-wrap items-center mb-2 w-full">
            <div className="flex items-center mb-2 mr-2">
              <label htmlFor="colorPicker" className="mr-2 font-semibold">
                색 선택:
              </label>
              <input
                type="color"
                id="colorPicker"
                value={coverBackgroundColor}
                onChange={handleBackgroundColorChange}
                className="border border-gray-300 rounded w-16"
              />
            </div>
            <button
              onClick={handleDownload}
              className="mb-2 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300 mr-2"
            >
              커버 다운로드
            </button>

            <button
              onClick={handleSaveAndContinue}
              className="mb-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-300 mr-2"
            >
              속지 작성
            </button>
            <button
              onClick={handleAddText}
              className="mb-2 px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300 mr-2"
            >
              제목 생성
            </button>
            <div className="flex items-center mb-2 mr-2">
              <label htmlFor="imgChoice" className="mr-2 font-semibold">
                이미지 선택:
              </label>
              <input
                id="imgChoice"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-2 border border-gray-300 rounded p-1 w-full md:w-auto mr-2"
                ref={fileInputRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCoverPage;
