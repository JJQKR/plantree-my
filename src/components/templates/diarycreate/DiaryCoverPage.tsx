'use client';
import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Transformer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import { getCover, updateCover, addCover } from '@/services/diarycover.service';
import { useParams } from 'next/navigation';
import useUserStore from '@/stores/user.store';
import DiaryCoverSidebar from '@/components/molecules/diarycoversidebar/DiaryCoverSidebar';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const DiaryCoverPage: React.FC = () => {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);

  const { diaryId } = useParams<ParamTypes>();

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

  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const renderMenuContent = () => {
    switch (selectedMenu) {
      case 'Templates':
        return <div>템플릿 내용</div>;
      case 'Text':
        return <div>텍스트 내용</div>;
      case 'Photos':
        return <div>사진 내용</div>;
      case 'Elements':
        return <div>요소 내용</div>;
      case 'Upload':
        return <div>업로드 내용</div>;
      case 'Background':
        return <div>배경 내용</div>;
      case 'Layers':
        return <div>레이어 내용</div>;
      case 'Resize':
        return <div>크기 조정 내용</div>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchDiaryCover = async () => {
      try {
        const data = await getCover(diaryId);

        if (data) {
          const parsedData = {
            cover_title: data.cover_title,
            cover_title_position: JSON.parse(data.cover_title_position),
            cover_title_fontsize: data.cover_title_fontsize,
            cover_title_width: data.cover_title_width,
            cover_title_rotation: data.cover_title_rotation,
            cover_image: data.cover_image,
            cover_image_position: JSON.parse(data.cover_image_position),
            cover_image_size: JSON.parse(data.cover_image_size),
            cover_image_rotation: data.cover_image_rotation,
            cover_bg_color: data.cover_bg_color,
            cover_scale: data.cover_scale,
            cover_stage_size: JSON.parse(data.cover_stage_size)
          };

          setIsEditMode(true);
          setCoverTitle(parsedData.cover_title);
          setCoverTitlePosition(parsedData.cover_title_position);
          setCoverTitleFontSize(parsedData.cover_title_fontsize);
          setCoverTitleWidth(parsedData.cover_title_width);
          setCoverTitleRotation(parsedData.cover_title_rotation);
          setCoverBackgroundColor(parsedData.cover_bg_color);
          setCoverScale(parsedData.cover_scale);
          setCoverStageSize(parsedData.cover_stage_size);

          if (parsedData.cover_image) {
            const img = new window.Image();
            img.src = parsedData.cover_image;
            img.onload = () => {
              setLoadedImage(img);
              setCoverImage(parsedData.cover_image);
              setCoverImagePosition(parsedData.cover_image_position);
              setCoverImageSize(parsedData.cover_image_size);
              setCoverImageRotation(parsedData.cover_image_rotation);
            };
          }
        } else {
          setCoverTitle('표지 제목 작성');
          setCoverTitlePosition({ x: 140, y: 150 });
          setCoverTitleFontSize(30);
          setCoverTitleWidth(220);
          setCoverTitleRotation(0);
          setCoverBackgroundColor('#ffffff');
          setCoverScale(1);
          setCoverStageSize({ width: 480, height: 720 });
          setCoverSelectedElement(null);

          setLoadedImage(null);
          setCoverImage(null);
          setCoverImagePosition({ x: 50, y: 50 });
          setCoverImageSize({ width: 0, height: 0 });
          setCoverImageRotation(0);

          setIsEditMode(false);
        }
      } catch (error) {
        console.error('Failed to fetch diary cover:', error);
        setIsEditMode(false);
      }
    };

    fetchDiaryCover();
  }, [
    diaryId,
    setCoverTitle,
    setCoverTitlePosition,
    setCoverTitleFontSize,
    setCoverTitleWidth,
    setCoverTitleRotation,
    setCoverImage,
    setCoverImagePosition,
    setCoverImageSize,
    setCoverImageRotation,
    setCoverBackgroundColor,
    setCoverScale,
    setCoverStageSize
  ]);

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
  }, [coverImageRotation, coverImagePosition, coverImageSize]);

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

    const fileExtension = file.name.split('.').pop();
    const newFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

    const newFile = new File([file], newFileName, { type: file.type });

    setImageFile(newFile);

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
          setLoadedImage(img);
        }
      };
      img.onerror = (error) => {
        console.error('이미지 로드 에러:', error);
      };
    };
    reader.readAsDataURL(newFile);
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

  const handleSaveCover = async () => {
    if (!confirm('커버를 저장하시겠습니까?')) {
      return;
    }

    let publicUrl: string | null = null;
    let coverImage: string | null | undefined;

    if (imageFile) {
      if (coverImage && typeof coverImage === 'string') {
        const fileName = coverImage.split('/').pop();
        if (fileName) {
          const { error: deleteError } = await supabase.storage.from('cover_img').remove([fileName]);
          if (deleteError) {
            console.error('기존 이미지 삭제 실패:', deleteError);
          }
        }
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cover_img')
        .upload(imageFile.name, imageFile);

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('cover_img').getPublicUrl(imageFile.name);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error('공개 URL 가져오기 실패');
        return;
      }

      publicUrl = publicUrlData.publicUrl;
    } else if (typeof coverImage === 'string') {
      publicUrl = coverImage;
    }

    const coverData = {
      cover_title: coverTitle,
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
      cover_stage_size: coverStageSize,
      diary_id: diaryId,
      user_id: userId
    };

    try {
      await addCover(coverData);

      alert('Cover저장성공!');
      router.push(`/member/hub`);
    } catch (error) {
      console.error('Cover 저장실패:', error);
      alert('Cover 저장실패');
    }
  };

  const handleUpdateDiary = async () => {
    if (!confirm('다이어리를 수정하시겠습니까?')) {
      return;
    }
    let publicUrl: string | null = null;
    try {
      const { data, error } = await supabase
        .from('diary_covers')
        .select('cover_image')
        .eq('diary_id', diaryId)
        .single();

      if (error || !data) {
        console.error('데이터 가져오기 실패:', error);
        alert('데이터 가져오기 실패');
        return;
      }

      const coverImageUrl = data.cover_image;
      const fileName = coverImageUrl ? coverImageUrl.split('/').pop() : null;

      if (imageFile) {
        if (fileName) {
          const { error: deleteError } = await supabase.storage.from('cover_img').remove([fileName]);
          if (deleteError) {
            console.error('기존 이미지 삭제 실패:', deleteError);
            alert(`기존 이미지 삭제 실패: ${deleteError.message}`);
            return;
          }
        }

        const newFileName = `${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cover_img')
          .upload(newFileName, imageFile);

        if (uploadError) {
          console.error('이미지 업로드 실패:', uploadError);
          alert(`이미지 업로드 실패: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from('cover_img').getPublicUrl(newFileName);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('공개 URL 가져오기 실패');
          alert('공개 URL 가져오기 실패');
          return;
        }

        publicUrl = publicUrlData.publicUrl;
      } else if (typeof coverImageUrl === 'string') {
        publicUrl = coverImageUrl;
      }

      const coverData = {
        cover_title: coverTitle,
        cover_title_position: JSON.stringify(coverTitlePosition),
        cover_title_fontsize: coverTitleFontSize,
        cover_title_width: coverTitleWidth,
        cover_title_rotation: coverTitleRotation,
        cover_image: publicUrl,
        cover_image_position: JSON.stringify(coverImagePosition),
        cover_image_size: JSON.stringify(coverImageSize),
        cover_image_rotation: coverImageRotation,
        cover_bg_color: coverBackgroundColor,
        cover_scale: coverScale,
        cover_stage_size: JSON.stringify(coverStageSize),
        diary_id: diaryId,
        user_id: userId
      };

      const result = await updateCover(diaryId, coverData);

      if (result.error) {
        console.error('수정 실패:', result.error);
        alert(`수정 실패: ${result.error}`);
        return;
      }

      alert('Cover 수정 성공!');
    } catch (error) {
      console.error('Cover 수정 실패:', error);
      alert('Cover 수정 실패');
    }
  };

  const handleResetDiary = async () => {
    if (!confirm('다이어리를 초기화 하시겠습니까?')) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('diary_covers')
        .select('cover_image')
        .eq('diary_id', diaryId)
        .single();

      if (error || !data) {
        console.error('데이터 가져오기 실패:', error);
        alert('데이터 가져오기 실패');
        return;
      }

      const coverImageUrl = data.cover_image;
      const fileName = coverImageUrl ? coverImageUrl.split('/').pop() : null;

      if (fileName) {
        const { error: deleteError } = await supabase.storage.from('cover_img').remove([fileName]);
        if (deleteError) {
          console.error('이미지 파일 삭제 실패:', deleteError);
          alert(`이미지 파일 삭제 실패: ${deleteError.message}`);
        } else {
          alert('초기화 성공');
        }
      } else {
        alert('초기화 성공');
      }
    } catch (error) {
      console.error('초기화 실패:', error);
      alert(`초기화 실패: `);
    }

    setCoverTitle('표지 제목 작성');
    setCoverTitlePosition({ x: 140, y: 150 });
    setCoverTitleFontSize(30);
    setCoverTitleWidth(220);
    setCoverTitleRotation(0);
    setCoverBackgroundColor('#ffffff');
    setCoverScale(1);
    setCoverStageSize({ width: 480, height: 720 });
    setCoverSelectedElement(null);
    setCoverImage(null);
    setCoverImagePosition({ x: 50, y: 50 });
    setCoverImageSize({ width: 0, height: 0 });
    setCoverImageRotation(0);

    setImageFile(null);

    const coverData = {
      cover_title: '표지 제목 작성',
      cover_title_position: JSON.stringify({ x: 140, y: 150 }),
      cover_title_fontsize: 30,
      cover_title_width: 220,
      cover_title_rotation: 0,
      cover_image: null,
      cover_image_position: JSON.stringify({ x: 50, y: 50 }),
      cover_image_size: JSON.stringify({ width: 0, height: 0 }),
      cover_image_rotation: 0,
      cover_bg_color: '#ffffff',
      cover_scale: 1,
      cover_stage_size: JSON.stringify({ width: 480, height: 720 }),
      diary_id: diaryId,
      user_id: userId
    };

    const result = await updateCover(diaryId, coverData);

    if (result.error) {
      console.error('수정 실패:', result.error);
      alert(`수정 실패: ${result.error}`);
      return;
    }
  };

  const handleResize = () => {
    const newWidth = window.innerWidth > 480 ? 480 : window.innerWidth;
    const newHeight = (newWidth / 480) * 720;
    setCoverStageSize({ width: newWidth, height: newHeight });
    setCoverScale(newWidth / 480);
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
      setCoverTitle('');
      setCoverSelectedElement(null);
    } else if (coverSelectedElement === imageRef.current) {
      setCoverImage(null);
      setImageFile(null);
      setLoadedImage(null);
      setCoverImagePosition({ x: 50, y: 50 });
      setCoverImageSize({ width: 0, height: 0 });
      setCoverImageRotation(0);
      setCoverSelectedElement(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && coverSelectedElement) {
        e.preventDefault();
        handleDeleteElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [coverSelectedElement]);

  const handleAddText = () => {
    setCoverTitle('표지 제목 작성');
    setCoverTitlePosition({ x: 140, y: 150 });
    setCoverTitleFontSize(30);
    setCoverTitleWidth(220);
    setCoverTitleRotation(0);
  };

  const handleSelectMenu = (menu: string) => {
    if (selectedMenu === menu) {
      setSelectedMenu(null);
    } else {
      setSelectedMenu(menu);
    }
  };

  return (
    <div className="flex h-full relative">
      <div ref={sidebarRef} className="relative z-5">
        <DiaryCoverSidebar onSelectMenu={handleSelectMenu} />
        {selectedMenu && (
          <div className="absolute top-0 left-full w-80 h-full bg-white shadow-lg p-4 overflow-y-auto z-10">
            {renderMenuContent()}
          </div>
        )}
      </div>
      <div className="relative flex-grow flex z-0">
        <div className="flex flex-col overflow-hidden w-full">
          <div className="flex-grow flex justify-center items-center overflow-auto">
            <div className="w-full max-w-[48rem]  mr-4">
              <div className="grid aspect-w-2 aspect-h-3 w-full">
                <Stage
                  className="col-start-1 col-end-2 row-start-1 row-end-2 w-full h-full"
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
                    {loadedImage && (
                      <KonvaImage
                        image={loadedImage}
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
                        rotation={coverImageRotation}
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

            <div className="flex flex-col items-start max-w-[10rem] w-full">
              <div className="flex flex-col items-start mb-2 w-full">
                <div className="flex items-center mb-2">
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
                  onClick={handleAddText}
                  className="mb-2 px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300 w-full"
                >
                  글씨 생성
                </button>
                <button
                  onClick={handleDownload}
                  className="mb-2 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300 w-full"
                >
                  커버 다운로드
                </button>
                {isEditMode ? (
                  <button
                    onClick={handleUpdateDiary}
                    className="mb-2 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition duration-300 w-full"
                  >
                    커버 수정
                  </button>
                ) : (
                  <button
                    onClick={handleSaveCover}
                    className="mb-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-300 w-full"
                  >
                    커버 저장
                  </button>
                )}
                {isEditMode && (
                  <button
                    onClick={handleResetDiary}
                    className="mb-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition duration-300 w-full"
                  >
                    커버 초기화
                  </button>
                )}
                <div className="flex flex-col items-start mb-2">
                  <label htmlFor="imgChoice" className="mb-1 font-semibold">
                    이미지 선택:
                  </label>
                  <input
                    id="imgChoice"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border border-gray-300 rounded p-1 w-full"
                    ref={fileInputRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCoverPage;
