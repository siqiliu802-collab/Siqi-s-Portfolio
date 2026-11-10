(function(){
  const ignored='.media-viewer,.lightbox,.shot-frame,.photo-trigger,.page-head h1,.hero h1,.account-avatar,.project-visual';
  const candidates=[].slice.call(document.querySelectorAll('main img,main video,#works img,#works video')).filter(function(media){
    return !media.closest(ignored)&&!(media.tagName==='IMG'&&!media.getAttribute('src'));
  });
  if(!candidates.length)return;

  const viewer=document.createElement('div');
  viewer.className='media-viewer';
  viewer.setAttribute('role','dialog');
  viewer.setAttribute('aria-modal','true');
  viewer.setAttribute('aria-hidden','true');
  viewer.innerHTML='<button class="media-viewer-close" type="button" aria-label="关闭预览">×</button><div class="media-viewer-stage"></div>';
  document.body.appendChild(viewer);
  const stage=viewer.querySelector('.media-viewer-stage');
  let sourceMedia=null;

  function closeViewer(){
    const video=stage.querySelector('video');
    if(video)video.pause();
    stage.replaceChildren();
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if(sourceMedia)sourceMedia.focus({preventScroll:true});
    sourceMedia=null;
  }

  function openViewer(media){
    sourceMedia=media;
    let preview;
    if(media.tagName==='VIDEO'){
      preview=document.createElement('video');
      const source=media.currentSrc||(media.querySelector('source')&&media.querySelector('source').src);
      if(!source)return;
      preview.src=source;
      preview.controls=true;
      preview.autoplay=true;
      preview.playsInline=true;
      if(media.poster)preview.poster=media.poster;
    }else{
      preview=document.createElement('img');
      preview.src=media.currentSrc||media.src;
      preview.alt=media.alt||'图片预览';
    }
    preview.addEventListener('click',closeViewer);
    stage.replaceChildren(preview);
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    viewer.querySelector('.media-viewer-close').focus();
  }

  candidates.forEach(function(media){
    media.classList.add('media-viewer-trigger');
    if(!media.hasAttribute('tabindex'))media.tabIndex=0;
    media.setAttribute('role','button');
    media.setAttribute('aria-label',(media.getAttribute('aria-label')||media.alt||'媒体')+'，点击放大');
    media.addEventListener('click',function(event){event.preventDefault();event.stopPropagation();openViewer(media)},true);
    media.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();openViewer(media)}});
  });
  viewer.addEventListener('click',function(event){if(event.target===viewer||event.target===stage)closeViewer()});
  viewer.querySelector('.media-viewer-close').addEventListener('click',closeViewer);
  addEventListener('keydown',function(event){if(event.key==='Escape'&&viewer.classList.contains('is-open'))closeViewer()});
})();
