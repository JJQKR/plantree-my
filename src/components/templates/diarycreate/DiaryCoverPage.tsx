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
import useDiaryStore from '@/stores/diary.store';
import { AddDiaryType } from '@/api/diaries.api';
import { useCreateDiary } from '@/lib/hooks/useDiaries';
import UnsplashImageSearch from '@/components/molecules/diarycoversidebar/UnsplashImageSearch';
import UnsplashBackgroundSearch from '@/components/molecules/diarycoversidebar/UnsplashBackgroundSearch';
import Swal from 'sweetalert2';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const DiaryCoverPage: React.FC = () => {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);
  const { mutate: createDiary } = useCreateDiary();
  const setDiaryId = useDiaryStore((state) => state.setDiaryId);

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
    setCoverData,
    // 언스플레쉬
    unsplashImage,
    setUnsplashImage,
    unsplashImagePosition,
    setUnsplashImagePosition,
    unsplashImageSize,
    setUnsplashImageSize,
    unsplashScale,
    setUnsplashScale,
    unsplashImageRotation,
    setUnsplashImageRotation
  } = useDiaryCoverStore();

  const stageRef = useRef<Konva.Stage | null>(null);
  const textRef = useRef<Konva.Text | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const coverImageRef = useRef<Konva.Image>(null); // 로컬 이미지 참조
  const unsplashImageRef = useRef<Konva.Image>(null); // 언스플레쉬 이미지 참조

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [loadedUnsplashImage, setLoadedUnsplashImage] = useState<HTMLImageElement | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDiaryCover = async () => {
      try {
        const data = await getCover(diaryId);

        // console.log('Fetched cover data:', data);

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
            cover_stage_size: JSON.parse(data.cover_stage_size),
            unsplash_image: data.unsplash_image,
            unsplash_image_position: JSON.parse(data.unsplash_image_position),
            unsplash_image_size: JSON.parse(data.unsplash_image_size),
            unsplash_image_rotation: data.unsplash_image_rotation,
            unsplash_scale: data.unsplash_scale
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
          if (parsedData.unsplash_image) {
            const unsplashImg = new window.Image();
            unsplashImg.src = parsedData.unsplash_image;
            unsplashImg.onload = () => {
              setLoadedUnsplashImage(unsplashImg);
              setUnsplashImage(unsplashImg);
              setUnsplashImagePosition(parsedData.unsplash_image_position);
              setUnsplashImageSize(parsedData.unsplash_image_size);
              setUnsplashImageRotation(parsedData.unsplash_image_rotation);
              setUnsplashScale(parsedData.unsplash_scale);
            };
          }
        } else {
          resetCoverState();
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
    setCoverStageSize,
    setUnsplashImage,
    setUnsplashImagePosition,
    setUnsplashImageSize,
    setUnsplashImageRotation,
    setUnsplashScale
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

  // 이미지 렌더링 시점 조정
  useEffect(() => {
    if (coverImageRef.current && loadedImage) {
      coverImageRef.current.image(loadedImage);
      coverImageRef.current.getLayer()?.batchDraw();
    }
    if (unsplashImageRef.current && loadedUnsplashImage) {
      unsplashImageRef.current.image(loadedUnsplashImage);
      unsplashImageRef.current.getLayer()?.batchDraw();
    }
  }, [loadedImage, loadedUnsplashImage]);

  const resetCoverState = () => {
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

    setUnsplashImage(null);
    setUnsplashImagePosition({ x: 50, y: 50 });
    setUnsplashImageSize({ width: 0, height: 0 });
    setUnsplashImageRotation(0);

    setIsEditMode(false);
  };

  const handleImageUpload = (eventOrFile?: React.ChangeEvent<HTMLInputElement> | File, imageUrl?: string) => {
    let file: File | undefined;

    if (eventOrFile && (eventOrFile as React.ChangeEvent<HTMLInputElement>).target) {
      // 이벤트 객체가 전달된 경우 (로컬 이미지 업로드)
      const event = eventOrFile as React.ChangeEvent<HTMLInputElement>;
      file = event.target.files?.[0];
    } else if (eventOrFile instanceof File) {
      // 파일 객체가 직접 전달된 경우 (로컬 이미지 업로드)
      file = eventOrFile;
    }

    if (file) {
      // 로컬 이미지 처리
      const fileExtension = file.name.split('.').pop();
      const newFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

      const newFile = new File([file], newFileName, { type: file.type });

      setImageFile(newFile);

      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          setLoadedImage(img);
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
      reader.readAsDataURL(newFile);
    }

    if (imageUrl) {
      // 언스플레쉬 이미지 처리
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        setLoadedUnsplashImage(img);
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

          setUnsplashImageSize({ width: newWidth, height: newHeight });
          setUnsplashImagePosition({
            x: (stageWidth - newWidth) / 2,
            y: (stageHeight - newHeight) / 2
          });
          setUnsplashImage(img);
        }
      };
    }
  };

  const handleImageChange = () => {
    if (coverImageRef.current) {
      setCoverImagePosition({
        x: coverImageRef.current.x(),
        y: coverImageRef.current.y()
      });
    }
  };

  const handleUnsplashImageChange = () => {
    if (unsplashImageRef.current) {
      setUnsplashImagePosition({
        x: unsplashImageRef.current.x(),
        y: unsplashImageRef.current.y()
      });
    }
  };

  const handleImageTransform = () => {
    if (coverImageRef.current) {
      const node = coverImageRef.current;
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

  const handleUnsplashImageTransform = () => {
    if (unsplashImageRef.current) {
      const node = unsplashImageRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const scale = Math.max(scaleX, scaleY);

      const newWidth = unsplashImageSize.width * scale;
      const newHeight = unsplashImageSize.height * scale;

      setUnsplashImageSize({ width: newWidth, height: newHeight });
      setUnsplashImagePosition({ x: node.x(), y: node.y() });
      setUnsplashImageRotation(node.rotation());

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
    setCoverSelectedElement(coverImageRef.current);
  };

  const handleUnsplashImageSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    setCoverSelectedElement(unsplashImageRef.current);
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
    const result = await Swal.fire({
      title: '커버를 저장하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요'
    });

    if (!result.isConfirmed) {
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
      cover_image: publicUrl ?? null,
      cover_image_position: coverImagePosition ?? { x: 0, y: 0 },
      cover_image_size: coverImageSize ?? { width: 0, height: 0 },
      cover_image_rotation: coverImageRotation ?? 0,
      cover_bg_color: coverBackgroundColor,
      cover_scale: coverScale ?? 1,
      cover_stage_size: coverStageSize ?? { width: 480, height: 720 },
      diary_id: diaryId,
      user_id: userId,
      unsplash_image: unsplashImage ? unsplashImage.src : null, // URL로 저장
      unsplash_image_position: unsplashImage ? unsplashImagePosition : null,
      unsplash_image_size: unsplashImage ? unsplashImageSize : null,
      unsplash_scale: unsplashScale,
      unsplash_image_rotation: unsplashImageRotation
    };

    try {
      await addCover(coverData);

      // 다이어리 이름을 cover_title로 설정
      const { error: diaryError } = await supabase.from('diaries').update({ name: coverTitle }).eq('id', diaryId);

      // 새로운 다이어리 객체 생성
      const newDiary: AddDiaryType = {
        id: diaryId,
        user_id: userId,
        name: coverTitle,
        bookshelf_order: 0
      };

      createDiary(newDiary, {
        onSuccess: () => {
          setDiaryId(diaryId); // 생성된 다이어리 ID 설정
        }
      });

      if (diaryError) {
        console.error('다이어리 이름 업데이트 실패:', diaryError);
        alert('다이어리 이름 업데이트 실패');
        return;
      }

      Swal.fire('Cover 저장 성공!', '', 'success');
      router.push(`/member/hub`);
    } catch (error) {
      console.error('Cover 저장 실패:', error);
      alert('Cover 저장 실패');
    }
  };

  const handleUpdateDiary = async () => {
    const result = await Swal.fire({
      title: '표지를 수정 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요'
    });

    if (!result.isConfirmed) {
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
        user_id: userId,
        unsplash_image: unsplashImage ? unsplashImage.src : null,
        unsplash_image_position: JSON.stringify(unsplashImagePosition),
        unsplash_image_size: JSON.stringify(unsplashImageSize),
        unsplash_image_rotation: unsplashImageRotation,
        unsplash_scale: unsplashScale
      };

      const result = await updateCover(diaryId, coverData);

      if (result.error) {
        console.error('수정 실패:', result.error);
        alert(`수정 실패: ${result.error}`);
        return;
      }

      Swal.fire('Cover 수정 성공!', '', 'success');
    } catch (error) {
      console.error('Cover 수정 실패:', error);
      alert('Cover 수정 실패');
    }
  };

  const handleResetDiary = async () => {
    const confirmResult = await Swal.fire({
      title: '다이어리를 초기화 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요'
    });

    if (!confirmResult.isConfirmed) {
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
        Swal.fire('데이터 가져오기 실패', '', 'error');
        return;
      }

      const coverImageUrl = data.cover_image;
      const fileName = coverImageUrl ? coverImageUrl.split('/').pop() : null;

      if (fileName) {
        const { error: deleteError } = await supabase.storage.from('cover_img').remove([fileName]);
        if (deleteError) {
          console.error('이미지 파일 삭제 실패:', deleteError);
          Swal.fire(`이미지 파일 삭제 실패: ${deleteError.message}`, '', 'error');
        } else {
          Swal.fire('초기화 성공', '', 'success');
        }
      } else {
        Swal.fire('초기화 성공', '', 'success');
      }
    } catch (error) {
      console.error('초기화 실패:', error);
      Swal.fire(`초기화 실패`, '', 'error');
    }

    resetCoverState();

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
      user_id: userId,
      unsplash_image: null,
      unsplash_image_position: JSON.stringify({ x: 50, y: 60 }),
      unsplash_image_size: JSON.stringify({ width: 0, height: 0 }),
      unsplash_image_rotation: 0,
      unsplash_scale: 1
    };

    const Result = await updateCover(diaryId, coverData);

    if (Result.error) {
      console.error('초기화 실패:', Result.error);
      Swal.fire(`초기화 실패: ${Result.error}`, '', 'error');
      return;
    }
  };

  const handleResize = () => {
    const newWidth = window.innerWidth > 480 ? 480 : window.innerWidth;
    const newHeight = (newWidth / 480) * 720;
    const newScale = newWidth / 480;

    setCoverStageSize({ width: newWidth, height: newHeight });
    setCoverScale(newScale);
    setUnsplashScale(newScale);
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
    } else if (coverSelectedElement === coverImageRef.current) {
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
    } else if (coverSelectedElement === unsplashImageRef.current) {
      setUnsplashImage(null);
      setUnsplashImagePosition({ x: 50, y: 50 });
      setUnsplashImageSize({ width: 0, height: 0 });
      setUnsplashImageRotation(0);
      setCoverSelectedElement(null);
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
  const handleDownload = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'diary_cover.png';
      link.href = uri;
      link.click();
    }
  };

  const handleSelectMenu = (menu: string) => {
    if (selectedMenu === menu) {
      setSelectedMenu(null);
    } else {
      setSelectedMenu(menu);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    handleImageUpload(undefined, imageUrl);
  };

  const renderMenuContent = () => {
    switch (selectedMenu) {
      case 'Templates':
        return <div>템플릿</div>;
      case 'Text':
        return (
          <div>
            <button
              onClick={handleAddText}
              className="mb-2 px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300 w-full"
            >
              글씨 생성
            </button>
          </div>
        );
      case 'Photos':
        return (
          <div>
            <div>
              <label htmlFor="imgChoice" className="mb-1 font-semibold">
                이미지 넣기:
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
            <UnsplashImageSearch onSelectImage={handleSelectImage} />
          </div>
        );
      case 'Elements':
        return <div>요소</div>;
      case 'Upload':
        return <div></div>;
      case 'Background':
        return (
          <div>
            <label htmlFor="colorPicker" className="mr-2 font-semibold">
              기본 색상 선택 :
            </label>
            <input
              type="color"
              id="colorPicker"
              value={coverBackgroundColor.startsWith('url(') ? '#ffffff' : coverBackgroundColor}
              onChange={handleBackgroundColorChange}
              className="border border-gray-300 rounded w-16"
            />
            <UnsplashBackgroundSearch onSelectBackground={handleBackgroundImageChange} />
          </div>
        );
      case 'Edit':
        return (
          <div>
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
          </div>
        );
      case 'Layers':
        return <div>레이어</div>;
      case 'Resize':
        return <div>크기 조정</div>;
      default:
        return null;
    }
  };

  const handleBackgroundImageChange = (imageUrl: string) => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setCoverBackgroundColor(imageUrl);
      if (stageRef.current) {
        stageRef.current.batchDraw();
      }
    };
  };

  useEffect(() => {
    if (coverBackgroundColor && stageRef.current) {
      stageRef.current.batchDraw();
    }
  }, [coverBackgroundColor]);

  return (
    <div className="flex h-full relative">
      <div ref={sidebarRef} className="relative z-5">
        <DiaryCoverSidebar onSelectMenu={handleSelectMenu} />
        {selectedMenu && (
          <div className="absolute top-0 left-full w-[24rem] h-full bg-gray-100 shadow-lg p-6 overflow-y-auto z-10">
            <button
              onClick={() => setSelectedMenu(null)}
              className="absolute right-2 top-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-2 py-0.3 transition duration-300"
            >
              X
            </button>
            <div className="mt-10">{renderMenuContent()}</div>
          </div>
        )}
      </div>
      <div className="relative flex-grow flex z-0">
        <div className="flex flex-col overflow-hidden w-full">
          <div className="flex-grow flex justify-center items-center overflow-auto">
            <div className="w-full max-w-[48rem] mr-4">
              <div className="grid aspect-w-2 aspect-h-3 w-full">
                <Stage
                  className="col-start-1 col-end-2 row-start-1 row-end-2 w-full h-full"
                  width={coverStageSize.width}
                  height={coverStageSize.height}
                  ref={stageRef}
                  onClick={handleStageClick}
                >
                  <Layer>
                    {/* 배경 색 또는 패턴 */}
                    <Rect
                      x={0}
                      y={0}
                      width={coverStageSize.width}
                      height={coverStageSize.height}
                      fillPatternImage={
                        coverBackgroundColor.startsWith('http')
                          ? (() => {
                              const img = new window.Image();
                              img.src = coverBackgroundColor;
                              return img;
                            })()
                          : undefined
                      }
                      fill={coverBackgroundColor.startsWith('http') ? undefined : coverBackgroundColor}
                    />

                    {/* 로컬 이미지 */}
                    {coverImage && loadedImage && (
                      <KonvaImage
                        image={loadedImage}
                        x={coverImagePosition.x * coverScale}
                        y={coverImagePosition.y * coverScale}
                        width={coverImageSize.width}
                        height={coverImageSize.height}
                        draggable
                        ref={coverImageRef}
                        onDragEnd={handleImageChange}
                        onTransformEnd={handleImageTransform}
                        onClick={handleImageSelect}
                        scaleX={coverScale}
                        scaleY={coverScale}
                        rotation={coverImageRotation}
                      />
                    )}

                    {/* 언스플레쉬 이미지 */}
                    {unsplashImage && loadedUnsplashImage && (
                      <KonvaImage
                        image={loadedUnsplashImage}
                        x={unsplashImagePosition.x * coverScale}
                        y={unsplashImagePosition.y * coverScale}
                        width={unsplashImageSize.width}
                        height={unsplashImageSize.height}
                        draggable
                        ref={unsplashImageRef}
                        onDragEnd={handleUnsplashImageChange}
                        onTransformEnd={handleUnsplashImageTransform}
                        onClick={handleUnsplashImageSelect}
                        scaleX={unsplashScale}
                        scaleY={unsplashScale}
                        rotation={unsplashImageRotation}
                      />
                    )}

                    {/* 타이틀 텍스트 */}
                    <Text
                      text={coverTitle ?? ''}
                      fontSize={coverTitleFontSize}
                      x={coverTitlePosition.x * coverScale}
                      y={coverTitlePosition.y * coverScale}
                      width={coverTitleWidth}
                      fill="black"
                      draggable
                      ref={textRef} // 텍스트 참조 설정
                      onDragEnd={() =>
                        setCoverTitlePosition({ x: textRef.current?.x() ?? 0, y: textRef.current?.y() ?? 0 })
                      }
                      onTransformEnd={() => {
                        if (textRef.current) {
                          const node = textRef.current;
                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();

                          const newWidth = Math.max(20, node.width() * scaleX);
                          const newFontSize = Math.max(10, coverTitleFontSize * scaleY);

                          node.scaleX(1);
                          node.scaleY(1);

                          setCoverTitleWidth(newWidth);
                          setCoverTitleFontSize(newFontSize);
                          setCoverTitleRotation(node.rotation());
                          node.width(newWidth);
                          node.fontSize(newFontSize);
                        }
                      }}
                      onClick={handleTextSelect}
                      onDblClick={handleTextDblClick} // 추가
                      onDblTap={handleTextDblClick} // 모바일 환경에서 더블 탭 처리
                      scaleX={coverScale}
                      scaleY={coverScale}
                      rotation={coverTitleRotation}
                    />

                    {/* 선택된 요소에 대한 트랜스포머 */}
                    {coverSelectedElement && (
                      <Transformer
                        ref={trRef}
                        nodes={[coverSelectedElement]} // 현재 선택된 요소에만 트랜스포머 적용
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

            <div className="flex flex-col items-start max-w-[10rem] w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCoverPage;
