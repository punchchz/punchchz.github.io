document.addEventListener("DOMContentLoaded", () => {
  const tSlider = document.getElementById("t");
  const stuff = document.getElementById("stuffiness");
  const back = document.getElementById("back");
  const back2 = document.getElementById("back2");
  const L_arm_top = document.getElementById("L_arm_top");
  const L_arm_bot = document.getElementById("L_arm_bot");
  const R_arm_top = document.getElementById("R_arm_top");
  const R_arm_bot = document.getElementById("R_arm_bot");
  const L_far = document.getElementById("L_far");
  const R_far = document.getElementById("R_far");
  const L_diag_top = document.getElementById("L_diag_top");
  const R_diag_top = document.getElementById("R_diag_top");
  const L_diag_bot = document.getElementById("L_diag_bot");
  const R_diag_bot = document.getElementById("R_diag_bot");

  const base = {
    x: 490, y: 270, width: 420, height: 300,
    armTopY_L: 120, armBotY_L: 730,
    armTopY_R: 120, armBotY_R: 730,
    farLeftX: 365, farRightX: 1035,
    diagTopY: 100, diagBotY: 740,
  };

  const MIN_SHRINK = 0.35;

  function updateRoom(t) {
    const clampT = Math.max(0, Math.min(0.9, t));
    let shrink = 1 - clampT;
    shrink = Math.max(shrink, MIN_SHRINK);
    const newWidth = base.width * shrink;
    const newX = base.x + (base.width - newWidth) / 2;
    back.setAttribute("x", newX);
    back.setAttribute("width", newWidth);
    back2.setAttribute("x", newX + 15);
    back2.setAttribute("width", Math.max(0, newWidth - 30));
    const leftBackX = newX;
    const rightBackX = newX + newWidth;
    const inward = 100;
    const L_farX = base.farLeftX + clampT * inward;
    const R_farX = base.farRightX - clampT * inward;
    L_far.setAttribute("x1", L_farX);
    L_far.setAttribute("x2", L_farX);
    R_far.setAttribute("x1", R_farX);
    R_far.setAttribute("x2", R_farX);
    L_arm_top.setAttribute("x1", leftBackX);
    L_arm_top.setAttribute("y1", base.y);
    L_arm_top.setAttribute("x2", L_farX);
    L_arm_top.setAttribute("y2", base.armTopY_L);
    L_arm_bot.setAttribute("x1", leftBackX);
    L_arm_bot.setAttribute("y1", base.y + base.height);
    L_arm_bot.setAttribute("x2", L_farX);
    L_arm_bot.setAttribute("y2", base.armBotY_L);
    R_arm_top.setAttribute("x1", rightBackX);
    R_arm_top.setAttribute("y1", base.y);
    R_arm_top.setAttribute("x2", R_farX);
    R_arm_top.setAttribute("y2", base.armTopY_R);
    R_arm_bot.setAttribute("x1", rightBackX);
    R_arm_bot.setAttribute("y1", base.y + base.height);
    R_arm_bot.setAttribute("x2", R_farX);
    R_arm_bot.setAttribute("y2", base.armBotY_R);
    L_diag_top.setAttribute("x2", L_farX);
    L_diag_top.setAttribute("y2", base.diagTopY);
    R_diag_top.setAttribute("x2", R_farX);
    R_diag_top.setAttribute("y2", base.diagTopY);
    L_diag_bot.setAttribute("x2", L_farX);
    L_diag_bot.setAttribute("y2", base.diagBotY);
    R_diag_bot.setAttribute("x2", R_farX);
    R_diag_bot.setAttribute("y2", base.diagBotY);
  }

  let lastStuff = 0;
  const shownObjects = new Set();

  function updateStuffiness(v) {
    const clamped = Math.max(0, Math.min(1, v));
    const objects = document.querySelectorAll('.object-item');
    objects.forEach(obj => {
      const threshold = parseFloat(obj.dataset.threshold || 0);
      const objId = obj.id || obj.className;
      
      if (clamped >= threshold) {
        if (!shownObjects.has(objId)) {
          shownObjects.add(objId);
          
          if (obj.classList.contains('ladder')) {
            obj.dataset.draggable = '';
            obj.dataset.originalCenterX = '';
            obj.dataset.originalCenterY = '';
            obj.dataset.initialT = '';
            obj.dataset.dragX = '';
            obj.dataset.dragY = '';
            
            const currentT = parseFloat(tSlider.value) || 0;
            positionLadderInitially(obj, currentT);
            makeDraggable(obj);
            
            void obj.offsetHeight;
            
            obj.style.opacity = '1';
            obj.classList.remove('pop');
            void obj.offsetWidth;
            obj.classList.add('pop');
          } else {
            obj.style.opacity = '1';
            obj.classList.remove('pop');
            void obj.offsetWidth;
            obj.classList.add('pop');
            resetObjectPosition(obj);
            makeDraggable(obj);
          }
        } else {
          obj.style.opacity = '1';
        }
      } else {
        obj.style.opacity = '0';
        obj.classList.remove('pop');
        shownObjects.delete(objId);
        resetObjectPosition(obj);
        
        if (obj.classList.contains('ladder')) {
          obj.dataset.draggable = '';
          obj.dataset.originalWidth = '';
          obj.dataset.originalCenterX = '';
          obj.dataset.originalCenterY = '';
          obj.dataset.initialT = '';
        }
      }
    });
    lastStuff = clamped;
  }

  function resetObjectPosition(obj) {
    if (obj.classList.contains('ladder')) return;
    
    obj.style.transform = '';
    obj.dataset.dragX = '0';
    obj.dataset.dragY = '0';
  }

  function getBackWallBounds() {
    const roomEl = document.querySelector('.room');
    const backEl = document.getElementById('back');
    const backX = parseFloat(backEl.getAttribute('x'));
    const backWidth = parseFloat(backEl.getAttribute('width'));
    const backY = parseFloat(backEl.getAttribute('y'));
    const backHeight = parseFloat(backEl.getAttribute('height'));
    
    const roomRect = roomEl.getBoundingClientRect();
    const svgWidth = 1200;
    const svgHeight = 750;
    const scaleX = roomRect.width / svgWidth;
    const scaleY = roomRect.height / svgHeight;
    
    return {
      centerX: (backX + backWidth / 2) * scaleX,
      centerY: (backY + backHeight / 2) * scaleY,
      minY: backY * scaleY,
      maxY: (backY + backHeight) * scaleY
    };
  }

  function calculatePerspective(obj, posX, posY) {
    const bounds = getBackWallBounds();
    const roomEl = document.querySelector('.room');
    const roomRect = roomEl.getBoundingClientRect();
    
    const dx = posX - bounds.centerX;
    const dy = posY - bounds.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxDistance = roomRect.width * 0.5;
    const normalizedDist = Math.min(distance / maxDistance, 1);
    const scale = 0.5 + (normalizedDist * 0.7);
    const zIndex = Math.round(100 + normalizedDist * 900);
    
    return { scale, zIndex };
  }

  function positionLadderInitially(obj, currentT) {
    const roomEl = obj.closest('.room');
    const roomRect = roomEl.getBoundingClientRect();
    
    const backEl = document.getElementById('back');
    const backX = parseFloat(backEl.getAttribute('x'));
    const backWidth = parseFloat(backEl.getAttribute('width'));
    const backY = parseFloat(backEl.getAttribute('y'));
    const backHeight = parseFloat(backEl.getAttribute('height'));
    
    const svgWidth = 1200;
    const svgHeight = 750;
    const scaleX = roomRect.width / svgWidth;
    const scaleY = roomRect.height / svgHeight;
    
    const rightBackX = (backX + backWidth) * scaleX;
    const rightBackBotY = (backY + backHeight) * scaleY;
    
    const R_farX = parseFloat(document.getElementById('R_far').getAttribute('x1'));
    const R_farBotY = parseFloat(document.getElementById('R_arm_bot').getAttribute('y2'));
    const rightFarX = R_farX * scaleX;
    const rightFarBotY = R_farBotY * scaleY;
    
    const wallDx = rightFarX - rightBackX;
    const wallDy = rightFarBotY - rightBackBotY;
    
    const initialT = 0.08;
    obj.dataset.initialT = initialT;
    obj.dataset.maxT = 0.12;
    
    const snappedCenterX = rightBackX + initialT * wallDx;
    const snappedCenterY = rightBackBotY + initialT * wallDy;
    
    obj.dataset.originalCenterX = snappedCenterX;
    obj.dataset.originalCenterY = snappedCenterY;
    
    obj.style.left = `${snappedCenterX}px`;
    obj.style.top = `${snappedCenterY}px`;
    
    const computed = getComputedStyle(obj);
    const currentWidthPx = parseFloat(computed.width);
    const currentWidthPercent = (currentWidthPx / roomRect.width) * 100;
    
    const initialLadderScale = 0.7 + (initialT * 0.6);
    const baseWidth = currentWidthPercent / initialLadderScale;
    
    obj.dataset.originalWidth = baseWidth;
    obj.style.width = `${baseWidth * initialLadderScale}%`;
    
    const initialPerspective = calculatePerspective(obj, snappedCenterX, snappedCenterY);
    obj.style.zIndex = initialPerspective.zIndex;
  }

  function makeDraggable(obj) {
    if (obj.dataset.draggable === 'true') return;
    obj.dataset.draggable = 'true';
    
    const isLadder = obj.classList.contains('ladder');
    const isSign = obj.classList.contains('sign1-png') || obj.classList.contains('sign2-png') || 
                   obj.classList.contains('sign3-png') || obj.classList.contains('sign4-png');
    const isLight = obj.classList.contains('light-png');
    
    if (isLight) {
      return;
    }
    
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    
    if (!obj.dataset.originalWidth && !isLadder) {
      const roomEl = obj.closest('.room');
      const roomRect = roomEl.getBoundingClientRect();
      const objRect = obj.getBoundingClientRect();
      const objCenterX = objRect.left + objRect.width / 2 - roomRect.left;
      const objCenterY = objRect.top + objRect.height / 2 - roomRect.top;
      
      const computed = getComputedStyle(obj);
      const currentWidthPx = parseFloat(computed.width);
      const currentWidthPercent = (currentWidthPx / roomRect.width) * 100;
      
      const initialPerspective = calculatePerspective(obj, objCenterX, objCenterY);
      const baseWidth = currentWidthPercent / initialPerspective.scale;
      obj.dataset.originalWidth = baseWidth;
      obj.dataset.originalCenterX = objCenterX;
      obj.dataset.originalCenterY = objCenterY;
      
      if (!isSign) {
        obj.style.zIndex = initialPerspective.zIndex;
      }
    }
    
    obj.addEventListener('mousedown', (e) => {
      if (obj.style.opacity === '0') return;
      isDragging = true;
      
      if (isLadder) {
        const currentDragY = parseFloat(obj.dataset.dragY) || 0;
        startY = e.clientY - currentDragY;
      } else {
        startX = e.clientX - (parseFloat(obj.dataset.dragX) || 0);
        startY = e.clientY - (parseFloat(obj.dataset.dragY) || 0);
      }
      
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const roomEl = obj.closest('.room');
      const roomRect = roomEl.getBoundingClientRect();
      const bounds = getBackWallBounds();
      
      if (isLadder) {
        const backEl = document.getElementById('back');
        const backX = parseFloat(backEl.getAttribute('x'));
        const backWidth = parseFloat(backEl.getAttribute('width'));
        const backY = parseFloat(backEl.getAttribute('y'));
        const backHeight = parseFloat(backEl.getAttribute('height'));
        
        const svgWidth = 1200;
        const svgHeight = 750;
        const scaleX = roomRect.width / svgWidth;
        const scaleY = roomRect.height / svgHeight;
        
        const rightBackX = (backX + backWidth) * scaleX;
        const rightBackBotY = (backY + backHeight) * scaleY;
        
        const R_farX = parseFloat(document.getElementById('R_far').getAttribute('x1'));
        const R_farBotY = parseFloat(document.getElementById('R_arm_bot').getAttribute('y2'));
        const rightFarX = R_farX * scaleX;
        const rightFarBotY = R_farBotY * scaleY;
        
        if (!obj.dataset.originalCenterX) {
          const objRect = obj.getBoundingClientRect();
          obj.dataset.originalCenterX = objRect.left + objRect.width / 2 - roomRect.left;
          obj.dataset.originalCenterY = objRect.top + objRect.height / 2 - roomRect.top;
        }
        
        const mouseDeltaY = e.clientY - startY;
        
        const wallDx = rightFarX - rightBackX;
        const wallDy = rightFarBotY - rightBackBotY;
        const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
        
        const parallelX = wallDx / wallLength;
        const parallelY = wallDy / wallLength;
        
        const moveAmount = mouseDeltaY;
        let testX = parallelX * moveAmount;
        let testY = parallelY * moveAmount;
        
        const testCenterX = parseFloat(obj.dataset.originalCenterX) + testX;
        const testCenterY = parseFloat(obj.dataset.originalCenterY) + testY;
        
        const originalCenterX = parseFloat(obj.dataset.originalCenterX);
        const originalCenterY = parseFloat(obj.dataset.originalCenterY);
        
        const toTestX = testCenterX - rightBackX;
        const toTestY = testCenterY - rightBackBotY;
        let t = (toTestX * wallDx + toTestY * wallDy) / (wallDx * wallDx + wallDy * wallDy);
        
        const maxT = parseFloat(obj.dataset.maxT) || 0.12;
        const minT = 0.0;
        
        t = Math.max(minT, Math.min(maxT, t));
        
        const clampedCenterX = rightBackX + t * wallDx;
        const clampedCenterY = rightBackBotY + t * wallDy;
        
        currentX = clampedCenterX - originalCenterX;
        currentY = clampedCenterY - originalCenterY;
        
        const objCenterX = originalCenterX + currentX;
        const objCenterY = originalCenterY + currentY;
        
        const ladderScale = 0.7 + (t * 0.6);
        
        const baseWidth = parseFloat(obj.dataset.originalWidth);
        obj.style.width = `${baseWidth * ladderScale}%`;
        
        const perspective = calculatePerspective(obj, objCenterX, objCenterY);
        obj.style.zIndex = perspective.zIndex;
      }
      else if (isSign) {
        // Determine which wall the sign is on
        const isLeftWall = obj.classList.contains('sign1-png') || obj.classList.contains('sign2-png');
        const isRightWall = obj.classList.contains('sign3-png') || obj.classList.contains('sign4-png');
        
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        
        if (isLeftWall) {
          // Get left wall outer boundaries (from corner to corner)
          const L_diagTopX = 0;
          const L_diagTopY = 0;
          const L_diagBotX = 0;
          const L_diagBotY = 750;
          
          const L_farX = parseFloat(document.getElementById('L_far').getAttribute('x1'));
          const L_farTopY = parseFloat(document.getElementById('L_diag_top').getAttribute('y2'));
          const L_farBotY = parseFloat(document.getElementById('L_diag_bot').getAttribute('y2'));
          
          const roomRect = roomEl.getBoundingClientRect();
          const svgWidth = 1200;
          const svgHeight = 750;
          const scaleX = roomRect.width / svgWidth;
          const scaleY = roomRect.height / svgHeight;
          
          // Convert to screen coordinates - outer left wall boundaries
          const leftCornerX = L_diagTopX * scaleX;
          const leftCornerTopY = L_diagTopY * scaleY;
          const leftCornerBotY = L_diagBotY * scaleY;
          const leftFarX = L_farX * scaleX;
          const leftFarTopY = L_farTopY * scaleY;
          const leftFarBotY = L_farBotY * scaleY;
          
          // Constrain horizontally between outer corner and far edge
          const originalCenterX = parseFloat(obj.dataset.originalCenterX);
          const newCenterX = originalCenterX + currentX;
          const clampedX = Math.max(leftCornerX, Math.min(leftFarX, newCenterX));
          currentX = clampedX - originalCenterX;
          
          // Constrain vertically between top and bottom corners
          const originalCenterY = parseFloat(obj.dataset.originalCenterY);
          const newCenterY = originalCenterY + currentY;
          const clampedY = Math.max(leftCornerTopY, Math.min(leftCornerBotY, newCenterY));
          currentY = clampedY - originalCenterY;
          
        } else if (isRightWall) {
          // Get right wall outer boundaries (from corner to corner)
          const R_diagTopX = 1200;
          const R_diagTopY = 0;
          const R_diagBotX = 1200;
          const R_diagBotY = 750;
          
          const R_farX = parseFloat(document.getElementById('R_far').getAttribute('x1'));
          const R_farTopY = parseFloat(document.getElementById('R_diag_top').getAttribute('y2'));
          const R_farBotY = parseFloat(document.getElementById('R_diag_bot').getAttribute('y2'));
          
          const roomRect = roomEl.getBoundingClientRect();
          const svgWidth = 1200;
          const svgHeight = 750;
          const scaleX = roomRect.width / svgWidth;
          const scaleY = roomRect.height / svgHeight;
          
          // Convert to screen coordinates - outer right wall boundaries
          const rightCornerX = R_diagTopX * scaleX;
          const rightCornerTopY = R_diagTopY * scaleY;
          const rightCornerBotY = R_diagBotY * scaleY;
          const rightFarX = R_farX * scaleX;
          const rightFarTopY = R_farTopY * scaleY;
          const rightFarBotY = R_farBotY * scaleY;
          
          // Constrain horizontally between far edge and outer corner
          const originalCenterX = parseFloat(obj.dataset.originalCenterX);
          const newCenterX = originalCenterX + currentX;
          const clampedX = Math.max(rightFarX, Math.min(rightCornerX, newCenterX));
          currentX = clampedX - originalCenterX;
          
          // Constrain vertically between top and bottom corners
          const originalCenterY = parseFloat(obj.dataset.originalCenterY);
          const newCenterY = originalCenterY + currentY;
          const clampedY = Math.max(rightCornerTopY, Math.min(rightCornerBotY, newCenterY));
          currentY = clampedY - originalCenterY;
        }
      }
      else {
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        
        const objRect = obj.getBoundingClientRect();
        const objCenterX = objRect.left + objRect.width / 2 - roomRect.left + currentX;
        const objCenterY = objRect.top + objRect.height / 2 - roomRect.top + currentY;
        
        const perspective = calculatePerspective(obj, objCenterX, objCenterY);
        
        const baseWidth = parseFloat(obj.dataset.originalWidth);
        obj.style.width = `${baseWidth * perspective.scale}%`;
        obj.style.zIndex = perspective.zIndex;
      }
      
      obj.dataset.dragX = currentX;
      obj.dataset.dragY = currentY;
      
      const baseTransform = isLadder ? 'translate(-50%, -50%)' : '';
      obj.style.transform = `${baseTransform} translate(${currentX}px, ${currentY}px)`;
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
      }
    });
    
    obj.style.pointerEvents = 'auto';
  }

  tSlider.addEventListener("input", e => {
    const t = parseFloat(e.target.value) || 0;
    updateRoom(t);
    updateLadderPosition(t);
    stopAnimation();
  });
  
  stuff.addEventListener("input", e => {
    const v = parseFloat(e.target.value) || 0;
    updateStuffiness(v);
  });

  function updateLadderPosition(t) {
    const ladder = document.querySelector('.ladder');
    if (!ladder || !ladder.dataset.draggable) return;
    
    const roomEl = ladder.closest('.room');
    if (!roomEl) return;
    
    const roomRect = roomEl.getBoundingClientRect();
    
    const backEl = document.getElementById('back');
    const backX = parseFloat(backEl.getAttribute('x'));
    const backWidth = parseFloat(backEl.getAttribute('width'));
    const backY = parseFloat(backEl.getAttribute('y'));
    const backHeight = parseFloat(backEl.getAttribute('height'));
    
    const svgWidth = 1200;
    const svgHeight = 750;
    const scaleX = roomRect.width / svgWidth;
    const scaleY = roomRect.height / svgHeight;
    
    const rightBackX = (backX + backWidth) * scaleX;
    const rightBackBotY = (backY + backHeight) * scaleY;
    
    const R_farX = parseFloat(document.getElementById('R_far').getAttribute('x1'));
    const R_farBotY = parseFloat(document.getElementById('R_arm_bot').getAttribute('y2'));
    const rightFarX = R_farX * scaleX;
    const rightFarBotY = R_farBotY * scaleY;
    
    const wallDx = rightFarX - rightBackX;
    const wallDy = rightFarBotY - rightBackBotY;
    
    let currentT = parseFloat(ladder.dataset.initialT) || 0.08;
    
    const dragX = parseFloat(ladder.dataset.dragX) || 0;
    const dragY = parseFloat(ladder.dataset.dragY) || 0;
    
    if (dragX !== 0 || dragY !== 0) {
      const originalCenterX = parseFloat(ladder.dataset.originalCenterX) || 0;
      const originalCenterY = parseFloat(ladder.dataset.originalCenterY) || 0;
      
      const currentCenterX = originalCenterX + dragX;
      const currentCenterY = originalCenterY + dragY;
      
      const toCurrentX = currentCenterX - rightBackX;
      const toCurrentY = currentCenterY - rightBackBotY;
      currentT = Math.max(0, Math.min(1, (toCurrentX * wallDx + toCurrentY * wallDy) / (wallDx * wallDx + wallDy * wallDy)));
    }
    
    const snappedCenterX = rightBackX + currentT * wallDx;
    const snappedCenterY = rightBackBotY + currentT * wallDy;
    
    const baseCenterX = rightBackX + (parseFloat(ladder.dataset.initialT) || 0.08) * wallDx;
    const baseCenterY = rightBackBotY + (parseFloat(ladder.dataset.initialT) || 0.08) * wallDy;
    
    const newDragX = snappedCenterX - baseCenterX;
    const newDragY = snappedCenterY - baseCenterY;
    
    ladder.dataset.originalCenterX = baseCenterX;
    ladder.dataset.originalCenterY = baseCenterY;
    
    ladder.dataset.dragX = newDragX;
    ladder.dataset.dragY = newDragY;
    
    ladder.style.left = `${baseCenterX}px`;
    ladder.style.top = `${baseCenterY}px`;
    ladder.style.transform = `translate(-50%, -50%) translate(${newDragX}px, ${newDragY}px)`;
    
    const ladderScale = 0.7 + (currentT * 0.6);
    const baseWidth = parseFloat(ladder.dataset.originalWidth);
    ladder.style.width = `${baseWidth * ladderScale}%`;
  }

  const t0 = parseFloat(tSlider.value) || 0;
  const s0 = parseFloat(stuff.value) || 0;
  updateRoom(t0);
  updateStuffiness(s0);

  let autoAnimating = true;
  let animationTime = 0;
  const animationDuration = 4;

  function autoAnimate() {
    if (!autoAnimating) return;
    animationTime += 1 / 60;
    const progress = (animationTime % animationDuration) / animationDuration;
    const sineWave = Math.sin(progress * Math.PI);
    const currentT = sineWave * 0.7;
    updateRoom(currentT);
    updateLadderPosition(currentT);
    requestAnimationFrame(autoAnimate);
  }

  requestAnimationFrame(autoAnimate);

  const stopAnimation = () => {
    autoAnimating = false;
  };

  tSlider.addEventListener("mousedown", stopAnimation);
  tSlider.addEventListener("touchstart", stopAnimation);
  stuff.addEventListener("mousedown", stopAnimation);
  stuff.addEventListener("touchstart", stopAnimation);
});

(function() {
  const tintSwitch = document.getElementById('tintSwitch');
  const screenTint = document.getElementById('screenTint');
  
  if (!tintSwitch || !screenTint) return;
  
  // Ensure tint starts hidden
  document.body.classList.add('tint-off');
  
  tintSwitch.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    
    // When checked = switch is down = lights OFF = show tint
    if (isChecked) {
      document.body.classList.remove('tint-off');
      // Remove inline styles to let CSS take over
      screenTint.style.opacity = '';
      screenTint.style.visibility = '';
    } else {
      document.body.classList.add('tint-off');
      // Remove inline styles to let CSS take over
      screenTint.style.opacity = '';
      screenTint.style.visibility = '';
    }
  });
})();

(function() {
  const chairEl = document.querySelector('.chair');
  const btn = document.getElementById('chairSwitch');
  if (!chairEl || !btn) return;

  const chairOptions = [
    'chairathen1.png', 'chairathen2.png', 'chairathen3.png', 'chairathen4.png',
    'chairathen5.png', 'chairathen6.png', 'chairathen7.png', 'chairathen8.png'
  ];

  chairOptions.forEach(src => {
    const i = new Image();
    i.src = src;
  });

  let idx = chairOptions.findIndex(src => (chairEl.src || '').includes(src));
  if (idx < 0) idx = 0;

  btn.addEventListener('click', () => {
    idx = (idx + 1) % chairOptions.length;
    chairEl.src = chairOptions[idx];
  });
  
  function getBackWallBounds() {
    const roomEl = document.querySelector('.room');
    const backEl = document.getElementById('back');
    const backX = parseFloat(backEl.getAttribute('x'));
    const backWidth = parseFloat(backEl.getAttribute('width'));
    const backY = parseFloat(backEl.getAttribute('y'));
    const backHeight = parseFloat(backEl.getAttribute('height'));
    
    const roomRect = roomEl.getBoundingClientRect();
    const svgWidth = 1200;
    const svgHeight = 750;
    const scaleX = roomRect.width / svgWidth;
    const scaleY = roomRect.height / svgHeight;
    
    return {
      centerX: (backX + backWidth / 2) * scaleX,
      centerY: (backY + backHeight / 2) * scaleY,
      minY: backY * scaleY,
      maxY: (backY + backHeight) * scaleY
    };
  }

  function calculatePerspective(posX, posY) {
    const bounds = getBackWallBounds();
    const roomEl = document.querySelector('.room');
    const roomRect = roomEl.getBoundingClientRect();
    
    const dx = posX - bounds.centerX;
    const dy = posY - bounds.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxDistance = roomRect.width * 0.5;
    const normalizedDist = Math.min(distance / maxDistance, 1);
    
    const scale = 0.5 + (normalizedDist * 0.7);
    const zIndex = Math.round(100 + normalizedDist * 900);
    
    return { scale, zIndex };
  }

  function getChairBaseWidth() {
    const src = chairEl.src || '';
    if (src.includes('chairathen1.png')) return 18;
    if (src.includes('chairathen2.png')) return 15;
    if (src.includes('chairathen3.png')) return 20;
    if (src.includes('chairathen4.png')) return 22;
    if (src.includes('chairathen5.png')) return 24;
    if (src.includes('chairathen6.png')) return 17;
    if (src.includes('chairathen7.png')) return 21;
    if (src.includes('chairathen8.png')) return 21;
    return 18;
  }
  
  if (!chairEl.dataset.originalWidth) {
    const roomEl = chairEl.closest('.room');
    const roomRect = roomEl.getBoundingClientRect();
    const chairRect = chairEl.getBoundingClientRect();
    const chairCenterX = chairRect.left + chairRect.width / 2 - roomRect.left;
    const chairCenterY = chairRect.top + chairRect.height / 2 - roomRect.top;
    
    const currentWidthPx = parseFloat(getComputedStyle(chairEl).width);
    const currentWidthPercent = (currentWidthPx / roomRect.width) * 100;
    
    const initialPerspective = calculatePerspective(chairCenterX, chairCenterY);
    const baseWidth = currentWidthPercent / initialPerspective.scale;
    
    chairEl.dataset.originalWidth = baseWidth;
    chairEl.style.zIndex = initialPerspective.zIndex;
  }
  
  let isDragging = false;
  let startX, startY;
  let currentX = 0, currentY = 0;
  
  chairEl.style.pointerEvents = 'auto';
  
  chairEl.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const roomEl = chairEl.closest('.room');
    const roomRect = roomEl.getBoundingClientRect();
    const bounds = getBackWallBounds();
    
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;
    
    const chairRect = chairEl.getBoundingClientRect();
    const chairCenterX = chairRect.left + chairRect.width / 2 - roomRect.left + newX;
    const chairCenterY = chairRect.top + chairRect.height / 2 - roomRect.top + newY;
    
    currentX = newX;
    currentY = newY;
    
    const perspective = calculatePerspective(chairCenterX, chairCenterY);
    const baseWidth = parseFloat(chairEl.dataset.originalWidth);
    chairEl.style.width = `${baseWidth * perspective.scale}%`;
    chairEl.style.zIndex = perspective.zIndex;
    
    chairEl.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
    }
  });
})();

(function() {
  const sign1 = document.querySelector('.sign1-png');
  const sign2 = document.querySelector('.sign2-png');
  const spaceSlider = document.getElementById('t');
  
  if (!spaceSlider) return;

  let sign1InitialLeft = null;
  let sign2InitialLeft = null;
  
  function updateLeftSigns() {
    const t = parseFloat(spaceSlider.value) || 0;
    
    if (sign1 && sign1InitialLeft === null) {
      const computed = getComputedStyle(sign1);
      sign1InitialLeft = parseFloat(computed.left) / sign1.parentElement.offsetWidth * 100;
    }
    if (sign2 && sign2InitialLeft === null) {
      const computed = getComputedStyle(sign2);
      sign2InitialLeft = parseFloat(computed.left) / sign2.parentElement.offsetWidth * 100;
    }
    
    const movementFactor = t * 8;
    
    if (sign1 && sign1InitialLeft !== null) {
      const newLeft = sign1InitialLeft + movementFactor;
      sign1.style.left = `${newLeft}%`;
    }
    
    if (sign2 && sign2InitialLeft !== null) {
      const newLeft = sign2InitialLeft + movementFactor;
      sign2.style.left = `${newLeft}%`;
    }
  }
  
  spaceSlider.addEventListener('input', updateLeftSigns);
  setTimeout(updateLeftSigns, 100);
})();

(function() {
  const sign3 = document.querySelector('.sign3-png');
  const sign4 = document.querySelector('.sign4-png');
  const stool1 = document.querySelector('.stool1-png');
  const spaceSlider = document.getElementById('t');
  
  if (!spaceSlider) return;

  let sign3InitialRight = null;
  let sign4InitialRight = null;
  let stool1InitialRight = null;
  
  function updateRightObjects() {
    const t = parseFloat(spaceSlider.value) || 0;
    
    if (sign3 && sign3InitialRight === null) {
      const computed = getComputedStyle(sign3);
      sign3InitialRight = parseFloat(computed.right) / sign3.parentElement.offsetWidth * 100;
    }
    if (sign4 && sign4InitialRight === null) {
      const computed = getComputedStyle(sign4);
      sign4InitialRight = parseFloat(computed.right) / sign4.parentElement.offsetWidth * 100;
    }
    if (stool1 && stool1InitialRight === null) {
      const computed = getComputedStyle(stool1);
      stool1InitialRight = parseFloat(computed.right) / stool1.parentElement.offsetWidth * 100;
    }
    
    const movementFactor = t * 8;
    
    if (sign3 && sign3InitialRight !== null) {
      const newRight = sign3InitialRight + movementFactor;
      sign3.style.right = `${newRight}%`;
      sign3.style.left = 'auto';
    }
    
    if (sign4 && sign4InitialRight !== null) {
      const newRight = sign4InitialRight + movementFactor;
      sign4.style.right = `${newRight}%`;
      sign4.style.left = 'auto';
    }
    
    if (stool1 && stool1InitialRight !== null) {
      const newRight = stool1InitialRight + movementFactor;
      stool1.style.right = `${newRight}%`;
      stool1.style.left = 'auto';
    }
  }
  
  spaceSlider.addEventListener('input', updateRightObjects);
  setTimeout(updateRightObjects, 100);
})();

(function() {
  const targets = document.querySelectorAll('.hover-split-target');
  targets.forEach(label => {
    if (label.dataset.split === '1') return;
    label.dataset.split = '1';
    const textNode = Array.from(label.childNodes).find(
      n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length
    );
    if (!textNode) return;
    const raw = textNode.nodeValue;
    const text = raw.trim();
    const wrap = document.createElement('span');
    wrap.className = 'hover-split';
    const chars = [...text];
    
    chars.forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = `${Math.random() * 2}s`;
      wrap.appendChild(s);
    });
    
    label.insertBefore(wrap, textNode);
    label.removeChild(textNode);
  });
  
  setTimeout(() => {
    const tintMessage = document.querySelector('.tint-message');
    if (tintMessage && !tintMessage.dataset.split) {
      tintMessage.dataset.split = '1';
      const paragraphs = tintMessage.querySelectorAll('p');
      
      paragraphs.forEach(p => {
        const originalText = p.textContent.trim();
        p.innerHTML = '';
        
        [...originalText].forEach((ch, i) => {
          const span = document.createElement('span');
          span.className = 'ch';
          span.textContent = ch;
          span.style.animationDelay = `${Math.random() * 2}s`;
          p.appendChild(span);
        });
      });
    }
  }, 50);
  
  setTimeout(() => {
    document.body.classList.add('is-ready');
  }, 100);
})();

function enhanceTitleFloat() {
  const el = document.getElementById("floatingTitle");
  if (!el) return;
  if (!el.querySelector(".ch")) {
    const frag = document.createDocumentFragment();
    for (const ch of el.textContent) {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      frag.appendChild(s);
    }
    el.textContent = "";
    el.appendChild(frag);
  }
  const letters = [...el.querySelectorAll(".ch")];
  const BOUNDS_X = 34;
  const BOUNDS_Y = 26;
  const ROT_BOUNDS = 10;
  const ACCEL = 18;
  const VMAX = 16;
  const RACCEL = 18;
  const RVMAX = 14;
  const state = letters.map(() => ({
    x: (Math.random() * 2 - 1) * (BOUNDS_X * 0.6),
    y: (Math.random() * 2 - 1) * (BOUNDS_Y * 0.6),
    r: (Math.random() * 2 - 1) * (ROT_BOUNDS * 0.6),
    vx: (Math.random() * 2 - 1) * (VMAX * 0.4),
    vy: (Math.random() * 2 - 1) * (VMAX * 0.4),
    vr: (Math.random() * 2 - 1) * (RVMAX * 0.3),
    locked: false,
    homeX: 0,
    homeY: 0,
    homeR: 0,
  }));
  setTimeout(() => {
    letters.forEach((ch, i) => {
      state[i].homeX = state[i].x;
      state[i].homeY = state[i].y;
      state[i].homeR = state[i].r;
    });
  }, 100);
  letters.forEach((ch, i) => {
    ch.addEventListener("mouseenter", () => {
      state[i].locked = true;
      state[i].x = 0;
      state[i].y = 0;
      state[i].r = 0;
      state[i].vx = 0;
      state[i].vy = 0;
      state[i].vr = 0;
    });
    ch.addEventListener("mouseleave", () => {
      state[i].vx = (Math.random() * 2 - 1) * (VMAX * 0.9);
      state[i].vy = (Math.random() * 2 - 1) * (VMAX * 0.9);
      state[i].vr = (Math.random() * 2 - 1) * (RVMAX * 0.9);
      state[i].locked = false;
    });
  });
  let last = performance.now();

  function step(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    letters.forEach((ch, i) => {
      const s = state[i];
      if (!s.locked) {
        s.vx += (Math.random() * 2 - 1) * ACCEL * dt;
        s.vy += (Math.random() * 2 - 1) * ACCEL * dt;
        s.vr += (Math.random() * 2 - 1) * RACCEL * dt;
        const clamp = (v, m) => Math.max(-m, Math.min(m, v));
        s.vx = clamp(s.vx, VMAX);
        s.vy = clamp(s.vy, VMAX);
        s.vr = clamp(s.vr, RVMAX);
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.r += s.vr * dt;
        if (Math.abs(s.x) > BOUNDS_X) {
          s.x = Math.sign(s.x) * BOUNDS_X;
          s.vx *= -0.85;
        }
        if (Math.abs(s.y) > BOUNDS_Y) {
          s.y = Math.sign(s.y) * BOUNDS_Y;
          s.vy *= -0.85;
        }
        if (Math.abs(s.r) > ROT_BOUNDS) {
          s.r = Math.sign(s.r) * ROT_BOUNDS;
          s.vr *= -0.85;
        }
      }
      ch.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px) rotate(${s.r.toFixed(2)}deg)`;
    });
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  document.body.classList.add("is-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    enhanceTitleFloat();
  }, { once: true });
} else {
  enhanceTitleFloat();
}

(function() {
  const panel = document.querySelector('.resizable-panel');
  const resizeHandle = panel?.querySelector('.resize-handle');
  const app = document.querySelector('.app');
  
  if (!panel || !resizeHandle || !app) return;
  
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  let isAnimating = false;
  
  panel.style.width = '50px';
  app.style.gridTemplateColumns = `50px 1fr minmax(800px, 1fr)`;
  
  setTimeout(() => {
    const windowWidth = window.innerWidth;
    const maxWidth = windowWidth - 150 - 800;
    const targetWidth = maxWidth;
    const duration = 1500;
    const startTime = performance.now();
    const initialWidth = 50;
    
    function autoExpand(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newWidth = initialWidth + (targetWidth - initialWidth) * progress;
      panel.style.width = `${newWidth}px`;
      app.style.gridTemplateColumns = `${newWidth}px 1fr minmax(800px, 1fr)`;
      
      if (progress < 1) {
        requestAnimationFrame(autoExpand);
      } else {
        panel.classList.add('expanded');
      }
    }
    
    requestAnimationFrame(autoExpand);
  }, 500);
  
  setTimeout(() => {
    const expandBtn = document.querySelector('.expand-panel-btn');
    
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (isAnimating) return;
        isAnimating = true;
        
        const windowWidth = window.innerWidth;
        const maxWidth = windowWidth - 150 - 800;
        const currentWidth = panel.offsetWidth;
        
        if (currentWidth >= maxWidth - 10) {
          const targetWidth = 50;
          const duration = 1000;
          const startTime = performance.now();
          
          function animateCollapse(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const newWidth = currentWidth - (currentWidth - targetWidth) * progress;
            panel.style.width = `${newWidth}px`;
            app.style.gridTemplateColumns = `${newWidth}px 1fr minmax(800px, 1fr)`;
            
            if (progress < 1) {
              requestAnimationFrame(animateCollapse);
            } else {
              isAnimating = false;
              panel.classList.remove('expanded');
            }
          }
          
          requestAnimationFrame(animateCollapse);
        } else {
          const targetWidth = maxWidth;
          const duration = 1500;
          const startTime = performance.now();
          
          function animateExpand(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const newWidth = currentWidth + (targetWidth - currentWidth) * progress;
            panel.style.width = `${newWidth}px`;
            app.style.gridTemplateColumns = `${newWidth}px 1fr minmax(800px, 1fr)`;
            
            if (progress < 1) {
              requestAnimationFrame(animateExpand);
            } else {
              isAnimating = false;
              panel.classList.add('expanded');
            }
          }
          
          requestAnimationFrame(animateExpand);
        }
      });
    }
  }, 100);
  
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = panel.offsetWidth;
    e.preventDefault();
    e.stopPropagation();
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const delta = e.clientX - startX;
    const windowWidth = window.innerWidth;
    const maxWidth = windowWidth - 200 - 800;
    const newWidth = Math.max(25, Math.min(maxWidth, startWidth + delta));
    panel.style.width = `${newWidth}px`;
    app.style.gridTemplateColumns = `${newWidth}px 1fr minmax(800px, 1fr)`;
    
    if (newWidth > 100) {
      panel.classList.add('expanded');
    } else {
      panel.classList.remove('expanded');
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
})();

(function() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = (cursorX - 20) + 'px';
    cursor.style.top = (cursorY - 20) + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactiveElements = document.querySelectorAll('a, button, input, .icon-btn, .light-switch, .resize-handle, .floating-title .ch, .hover-split, [type="range"], .chair, .ladder, .object-item');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
})();