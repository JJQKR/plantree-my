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
    resetTextProperties,
    coverTitleFontStyle, // 추가
    setCoverTitleFontStyle, // 추가된 상태 설정
    coverTitleFontFamily, // 추가
    setCoverTitleFontFamily, // 추가된 상태 설정
    coverTitleColor, // 추가
    setCoverTitleColor, // 추가된 상태 설정
    isUnderlined, // 추가
    setIsUnderlined, // 추가된 상태 설정
    isStrikethrough, // 추가
    setIsStrikethrough, // 추가된 상태 설정
    availableFontWeights, //추가
    setAvailableFontWeights, //추가 상태
    coverTitleFontWeight, //추가
    setCoverTitleFontWeight, //추가상태

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
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const sidebarRef = useRef<HTMLDivElement>(null);

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
            cover_stage_size: JSON.parse(data.cover_stage_size),
            unsplash_image: data.unsplash_image,
            unsplash_image_position: JSON.parse(data.unsplash_image_position),
            unsplash_image_size: JSON.parse(data.unsplash_image_size),
            unsplash_image_rotation: data.unsplash_image_rotation,
            unsplash_scale: data.unsplash_scale,
            cover_title_fontstyle: data.cover_title_fontstyle,
            cover_title_fontfamily: data.cover_title_fontfamily,
            cover_title_color: data.cover_title_color,
            cover_title_fontweight: data.cover_title_fontweight
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
          setCoverTitleFontStyle(parsedData.cover_title_fontstyle);
          setCoverTitleFontFamily(parsedData.cover_title_fontfamily);
          setCoverTitleColor(parsedData.cover_title_color);
          setCoverTitleFontWeight(parsedData.cover_title_fontweight);

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
    setUnsplashScale,
    setCoverTitleFontStyle,
    setCoverTitleFontFamily,
    setCoverTitleColor,
    setCoverTitleFontWeight
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
    if (textRef.current) {
      // fontStyle은 italic 또는 normal로만 관리
      const fontStyle = coverTitleFontStyle === 'italic' ? 'italic' : 'normal';
      const fontWeightStyle =
        coverTitleFontWeight === 700 ? 'bold' : coverTitleFontWeight === 100 ? 'lighter' : 'normal';

      textRef.current.fontStyle(`${fontWeightStyle} ${fontStyle}`);
      textRef.current.fill(coverTitleColor); // 텍스트 색상 초기화 반영
      textRef.current.fontFamily(coverTitleFontFamily); // 글꼴 초기화 반영
      // 밑줄과 취소선도 필요 시 여기에 반영 //안될듯 포기
      textRef.current.getLayer()?.batchDraw();
    }
  }, [coverTitleColor, coverTitleFontStyle, coverTitleFontFamily, coverTitleFontWeight]);

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
    resetTextProperties(); // 텍스트 관련 속성 초기화
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
      // 이벤트 객체가 전달된 경우
      const event = eventOrFile as React.ChangeEvent<HTMLInputElement>;
      file = event.target.files?.[0];
    } else if (eventOrFile instanceof File) {
      // 파일 객체가 직접 전달된 경우
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

  const handleTextTransform = () => {
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
      node.getLayer()?.batchDraw();
    }
  };

  const handleSaveCover = async () => {
    setLoading(true); // 로딩 상태 설정
    const result = await Swal.fire({
      title: '표지를 저장하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요'
    });

    if (!result.isConfirmed) {
      setLoading(false); // 로딩 상태 해제
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
        setLoading(false); // 로딩 상태 해제
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('cover_img').getPublicUrl(imageFile.name);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error('공개 URL 가져오기 실패');
        setLoading(false); // 로딩 상태 해제
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
      unsplash_image: unsplashImage ? unsplashImage.src : null,
      unsplash_image_position: unsplashImage ? unsplashImagePosition : null,
      unsplash_image_size: unsplashImage ? unsplashImageSize : null,
      unsplash_scale: unsplashScale,
      unsplash_image_rotation: unsplashImageRotation,
      cover_title_fontstyle: coverTitleFontStyle,
      cover_title_fontfamily: coverTitleFontFamily,
      cover_title_color: coverTitleColor,
      cover_title_fontweight: coverTitleFontWeight
    };

    try {
      await addCover(coverData);

      const { error: diaryError } = await supabase.from('diaries').update({ name: coverTitle }).eq('id', diaryId);

      if (diaryError) {
        console.error('다이어리 이름 업데이트 실패:', diaryError);
        alert('다이어리 이름 업데이트 실패');
        setLoading(false); // 로딩 상태 해제
        return;
      }

      // 다이어리의 bookshelf_order 설정
      const { data: maxOrderData, error: maxOrderError } = await supabase
        .from('diaries')
        .select('bookshelf_order')
        .order('bookshelf_order', { ascending: false })
        .limit(1)
        .single();

      if (maxOrderError) {
        console.error('bookshelf_order 가져오기 실패:', maxOrderError);
        alert('bookshelf_order 가져오기 실패');
        return;
      }

      const newBookshelfOrder = (maxOrderData?.bookshelf_order ?? 0) + 1;

      // 새로운 다이어리 객체 생성 및 bookshelf_order 설정
      const newDiary: AddDiaryType = {
        id: diaryId,
        user_id: userId,
        name: coverTitle,
        bookshelf_order: newBookshelfOrder
      };

      await createDiary(newDiary, {
        onSuccess: () => {
          setDiaryId(diaryId);
        }
      });

      // 다이어리 목록을 bookshelf_order 기준으로 정렬
      const { data: diaries, error: fetchError } = await supabase
        .from('diaries')
        .select('*')
        .order('bookshelf_order', { ascending: true });

      if (fetchError) {
        console.error('다이어리 목록 가져오기 실패:', fetchError);
        alert('다이어리 목록 가져오기 실패');
        return;
      }

      Swal.fire('Cover 저장 성공!', '', 'success').then(() => {
        Swal.fire('커버를 클릭해 속지를 추가해보세요!', '', 'info');
      });
      setLoading(false); // 로딩 상태 해제
      router.push(`/member/hub`);
    } catch (error) {
      console.error('Cover 저장 실패:', error);
      alert('Cover 저장 실패');
      setLoading(false); // 로딩 상태 해제
    }
  };

  const handleUpdateDiary = async () => {
    setLoading(true); // 로딩 상태 설정
    const result = await Swal.fire({
      title: '표지를 수정 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요'
    });

    if (!result.isConfirmed) {
      setLoading(false); // 로딩 상태 해제
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
        setLoading(false); // 로딩 상태 해제
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
            setLoading(false); // 로딩 상태 해제
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
          setLoading(false); // 로딩 상태 해제
          return;
        }

        const { data: publicUrlData } = supabase.storage.from('cover_img').getPublicUrl(newFileName);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('공개 URL 가져오기 실패');
          alert('공개 URL 가져오기 실패');
          setLoading(false); // 로딩 상태 해제
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
        unsplash_scale: unsplashScale,
        cover_title_fontstyle: coverTitleFontStyle,
        cover_title_fontfamily: coverTitleFontFamily,
        cover_title_color: coverTitleColor,
        cover_title_fontweight: coverTitleFontWeight
      };

      const result = await updateCover(diaryId, coverData);

      if (result.error) {
        console.error('수정 실패:', result.error);
        alert(`수정 실패: ${result.error}`);
        setLoading(false); // 로딩 상태 해제
        return;
      }

      Swal.fire('Cover 수정 성공!', '', 'success');
      setLoading(false); // 로딩 상태 해제
      router.push(`/member/hub`);
    } catch (error) {
      console.error('Cover 수정 실패:', error);
      alert('Cover 수정 실패');
      setLoading(false); // 로딩 상태 해제
    }
  };

  const handleResetDiary = async () => {
    const confirmResult = await Swal.fire({
      title: '초기화 하시겠습니까? <br>모든 표지내용이 지워집니다',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요'
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    setLoading(true); // 로딩 상태 설정

    try {
      const { data, error } = await supabase
        .from('diary_covers')
        .select('cover_image')
        .eq('diary_id', diaryId)
        .single();

      if (error || !data) {
        console.error('데이터 가져오기 실패:', error);
        Swal.fire('데이터 가져오기 실패', '', 'error');
        setLoading(false); // 로딩 상태 해제
        return;
      }

      const coverImageUrl = data.cover_image;
      const fileName = coverImageUrl ? coverImageUrl.split('/').pop() : null;

      if (fileName) {
        const { error: deleteError } = await supabase.storage.from('cover_img').remove([fileName]);
        if (deleteError) {
          console.error('이미지 파일 삭제 실패:', deleteError);
          Swal.fire(`이미지 파일 삭제 실패: ${deleteError.message}`, '', 'error');
          setLoading(false); // 로딩 상태 해제
        } else {
          Swal.fire('초기화 성공', '', 'success');
        }
      } else {
        Swal.fire('초기화 성공', '', 'success');
      }
    } catch (error) {
      console.error('초기화 실패:', error);
      Swal.fire(`초기화 실패`, '', 'error');
      setLoading(false); // 로딩 상태 해제
    }

    resetCoverState();

    const coverData = {
      cover_title: 'Create Cover Title',
      cover_title_position: JSON.stringify({ x: 120, y: 150 }),
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
      unsplash_scale: 1,
      cover_title_fontstyle: 'normal',
      cover_title_fontfamily: 'Arial',
      cover_title_color: '#000000',
      cover_title_fontweight: 400
    };

    const Result = await updateCover(diaryId, coverData);
    router.push(`/member/hub`);
    if (Result.error) {
      console.error('초기화 실패:', Result.error);
      Swal.fire(`초기화 실패: ${Result.error}`, '', 'error');
      setLoading(false); // 로딩 상태 해제
      return;
    }

    setLoading(false); // 로딩 상태 해제
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
    resetTextProperties(); // 텍스트 속성을 초기화
    setCoverTitle('Create Cover Title');
    setCoverTitlePosition({ x: 120, y: 150 });
    setCoverTitleFontSize(30);
    setCoverTitleWidth(260);
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
              글씨 생성 / 초기화
            </button>
            {/* 글씨 크기 */}
            <div className="mb-2">
              <label htmlFor="fontSizeInput" className="font-semibold block mb-1">
                글씨 크기 (픽셀):
              </label>
              <div className="flex items-center">
                <input
                  id="fontSizeInput"
                  type="number"
                  min="10"
                  max="100"
                  value={coverTitleFontSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setCoverTitleFontSize(newSize);
                    if (textRef.current) {
                      textRef.current.fontSize(newSize);
                      textRef.current.getLayer()?.batchDraw();
                    }
                  }}
                  className="w-16 border border-gray-300 rounded p-1 mr-2"
                />
                <input
                  id="fontSizeSlider"
                  type="range"
                  min="10"
                  max="100"
                  value={coverTitleFontSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setCoverTitleFontSize(newSize);
                    if (textRef.current) {
                      textRef.current.fontSize(newSize);
                      textRef.current.getLayer()?.batchDraw();
                    }
                  }}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </div>
            </div>

            {/* 색상 선택 */}
            <div className="mb-2">
              <label htmlFor="colorPicker" className="font-semibold block mb-1">
                글씨 색상:
              </label>
              <input
                id="colorPicker"
                type="color"
                value={coverTitleColor} // 상태에서 가져온 색상 값으로 설정
                onChange={(e) => {
                  const newColor = e.target.value;
                  setCoverTitleColor(newColor); // 상태 업데이트
                  if (textRef.current) {
                    textRef.current.fill(newColor); // 텍스트 색상 설정
                    textRef.current.getLayer()?.batchDraw(); // 텍스트 다시 그리기
                  }
                }}
                className="w-full"
              />
            </div>

            {/* 글꼴 선택 */}
            <div className="mb-2">
              <label htmlFor="fontSelect" className="font-semibold block mb-1">
                글꼴:
              </label>
              <select
                id="fontSelect"
                value={coverTitleFontFamily} // 현재 선택된 글꼴을 상태에서 가져오기
                onChange={(e) => {
                  const newFontFamily = e.target.value;
                  setCoverTitleFontFamily(newFontFamily);
                  if (textRef.current) {
                    textRef.current.fontFamily(newFontFamily);
                    textRef.current.getLayer()?.batchDraw();
                  }
                }}
                className="w-full border border-gray-300 rounded p-1"
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Roboto">Roboto</option>
                {/* 글꼴추가 */}
              </select>
            </div>

            {/* 두께 선택 */}
            <div className="mb-2">
              <label htmlFor="fontWeightSelect" className="font-semibold block mb-1">
                글씨 두께:
              </label>
              <select
                id="fontWeightSelect"
                value={coverTitleFontWeight} // 현재 선택된 두께 값
                onChange={(e) => {
                  const newWeight = Number(e.target.value);
                  setCoverTitleFontWeight(newWeight); // 새로운 두께 값 설정
                  if (textRef.current) {
                    const fontWeightStyle = newWeight === 700 ? 'bold' : 'normal'; // 두께에 따른 스타일 결정
                    textRef.current.fontStyle(`${fontWeightStyle} ${coverTitleFontStyle}`); // 텍스트 스타일 적용
                    textRef.current.getLayer()?.batchDraw(); // 레이어 다시 그리기
                  }
                }}
                className="w-full border border-gray-300 rounded p-1"
              >
                {availableFontWeights.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight === 100 ? '얇음' : weight === 400 ? '보통' : '두꺼움'}
                  </option>
                ))}
              </select>
            </div>

            {/* 기울기 선택 */}
            <div className="mb-2">
              <label className="font-semibold block mb-1">글씨 기울기:</label>
              <button
                onClick={() => {
                  const currentStyle = coverTitleFontStyle === 'italic' ? 'normal' : 'italic';
                  setCoverTitleFontStyle(currentStyle); // 상태 업데이트
                  if (textRef.current) {
                    textRef.current.fontStyle(currentStyle); // 텍스트 스타일 설정
                    textRef.current.fill(coverTitleColor); // 기존 색상 유지
                    textRef.current.fontFamily(coverTitleFontFamily); // 기존 글꼴 유지
                    textRef.current.getLayer()?.batchDraw(); // 텍스트 다시 그리기
                  }
                }}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300 w-full"
              >
                기울기 / 취소
              </button>
            </div>

            {/* 밑줄 선택 */}
            {/* <div className="mb-2">
              <label className="font-semibold block mb-1">밑줄 추가:</label>
              <button
                onClick={() => handleToggleUnderline()}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300 w-full"
              >
                밑줄 추가 / 제거
              </button>
            </div> */}

            {/* 취소선 선택 */}
            {/* <div className="mb-2">
              <label className="font-semibold block mb-1">취소선 추가:</label>
              <button
                onClick={() => handleToggleStrikethrough()}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300 w-full"
              >
                취소선 추가 / 제거
              </button>
            </div> */}
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
            <UnsplashImageSearch handleSelectImage={handleSelectImage} handleDeselectElement={handleDeselectElement} />
          </div>
        );
      case 'Elements':
        return <div>요소 준비중입니다</div>;
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
            <UnsplashBackgroundSearch
              handleBackgroundImageChange={handleBackgroundImageChange}
              handleDeselectElement={handleDeselectElement}
            />
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
        return <div>레이어 준비중입니다</div>;
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
      const stageWidth = coverStageSize.width;
      const stageHeight = coverStageSize.height;

      const scaleX = stageWidth / img.width;
      const scaleY = stageHeight / img.height;
      const scale = Math.max(scaleX, scaleY);

      img.width = img.width * scale;
      img.height = img.height * scale;

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

  const handleToggleUnderline = () => {
    // 밑줄 추가/제거하는 로직
  };

  const handleToggleStrikethrough = () => {
    // 취소선 추가/제거하는 로직
  };

  const fontWeightsMap: { [fontFamily: string]: number[] } = {
    Arial: [100, 400, 700],
    Verdana: [400, 700],
    'Times New Roman': [400, 700],
    Georgia: [400, 700],
    'Courier New': [400, 700],
    Roboto: [100, 400, 700]
    // 글꼴 추가
  };

  useEffect(() => {
    const newFontWeights = fontWeightsMap[coverTitleFontFamily] || [400];
    setAvailableFontWeights(newFontWeights);
    if (!newFontWeights.includes(coverTitleFontWeight)) {
      setCoverTitleFontWeight(newFontWeights[0]);
    }
  }, [coverTitleFontFamily]);

  const handleDeselectElement = () => {
    setCoverSelectedElement(null);
    if (trRef.current) {
      trRef.current.nodes([]); // 트랜스포머에서 선택된 요소 해제
      trRef.current.getLayer()?.batchDraw(); // 레이어 다시 그리기
    }
  };

  return (
    <div className="flex h-full relative mt-[10rem]">
      <div ref={sidebarRef} className="relative z-5">
        <DiaryCoverSidebar handleSelectMenu={handleSelectMenu} handleDeleteElement={handleDeleteElement} />
        {selectedMenu && (
          <div className="absolute top-0 left-full w-[18rem] h-full bg-gray-100 shadow-lg p-6 overflow-y-auto z-10">
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

                    {/* 타이틀 텍스트 */}
                    <Text
                      text={coverTitle ?? ''}
                      fontSize={coverTitleFontSize}
                      x={coverTitlePosition.x * coverScale}
                      y={coverTitlePosition.y * coverScale}
                      width={coverTitleWidth}
                      fill="black"
                      draggable
                      ref={textRef}
                      onDragEnd={() =>
                        setCoverTitlePosition({ x: textRef.current?.x() ?? 0, y: textRef.current?.y() ?? 0 })
                      }
                      onTransformEnd={handleTextTransform}
                      onClick={handleTextSelect}
                      onDblClick={handleTextDblClick}
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

      {/* 삭제 버튼 렌더링 */}
      {/* {coverSelectedElement && (
        <button
          className="absolute top-4 right-8 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 z-10 flex items-center space-x-2"
          onClick={handleDeleteElement}
        >
          <FaTrash className="text-white" />
          <span className="text-[1rem] font-medium">선택 요소 삭제</span>
        </button>
      )} */}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <img src="/images/loading.gif" alt="Loading" width={200} height={200} />
        </div>
      )}
    </div>
  );
};

export default DiaryCoverPage;
