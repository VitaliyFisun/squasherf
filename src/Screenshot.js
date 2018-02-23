import { jQuery as $, fabric } from './vendor/vendor';
import { resolve } from 'path';
//globals
//from legacy code
var canvasContainer;

function CutArea(canvas) {
    this.canvas = canvas;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.width = 0;
    this.height = 0;
    this.locationX = 0;
    this.locationY = 0;
    this.isRect = false;
    this.draw = false;
    this.rect = null;
    this.overRect = false;
    this.startCut = function(event, startX, startY) {
        if (this.isRect === false) {
            this.startX = startX;
            this.startY = startY;
            this.setCurrentCoordinates(event);
            this.rect = new fabric.Rect({
                fill: '#ff0000',
                opacity: 0.1
            });
            this.isRect = true;
        }
    };
    this.setCurrentCoordinates = function(event, type) {
        if (type === 'mobile') {
            this.currentX = event.changedTouches[0].pageX - canvasContainer.offsetLeft;
            this.currentY = event.changedTouches[0].pageY - canvasContainer.offsetTop;
        } else {
            this.currentX = event.pageX - canvasContainer.offsetLeft;
            this.currentY = event.pageY - canvasContainer.offsetTop;
        }
    };
    this.setRectCoordinates = function() {
        if (this.currentX > this.startX && this.currentY > this.startY) {
            this.left = this.startX;
            this.top = this.startY;
            this.width = this.currentX - this.startX;
            this.height = this.currentY - this.startY;
            this.draw = true;
        } else if (this.currentX > this.startX && this.currentY < this.startY) {
            this.left = this.startX;
            this.top = this.currentY;
            this.width = this.currentX - this.startX;
            this.height = this.startY - this.currentY;
            this.draw = true;
        } else if (this.currentX < this.startX && this.currentY > this.startY) {
            this.left = this.currentX;
            this.top = this.startY;
            this.width = this.startX - this.currentX;
            this.height = this.currentY - this.startY;
            this.draw = true;
        } else if (this.currentX < this.startX && this.currentY < this.startY) {
            this.left = this.currentX;
            this.top = this.currentY;
            this.width = this.startX - this.currentX;
            this.height = this.startY - this.currentY;
            this.draw = true;
        }
    };
    this.drawRect = function() {
        if (this.isRect === true && (!this.rect || this.rect.get('width') === 0)) {
            this.setRectCoordinates();
            if (this.draw === true) {
                this.rect.set({
                    left: this.left,
                    top: this.top,
                    width: this.width,
                    height: this.height
                });
                this.rect.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                    bl: false,
                    br: false,
                    tl: false,
                    tr: false,
                    mtr: false
                });
                this.canvas.add(this.rect);
                this.canvas.renderAll();
            }
        }
    };
    this.reset = function() {
        this.isRect = false;
        this.draw = false;
        this.rect = null;
    };
}

function CutImage() {
    let self = this;
    this.width = 0;
    this.height = 0;
    this.canvas = null;
    this.cutArea = null;
    this.image = null;
    this.isCutImage = false;

    this.setImage = function(imageObj) {
        this.image = new fabric.Image(imageObj, {
            left: -self.cutArea.get('left'),
            top: -self.cutArea.get('top'),
            clipTo: function(ctx) {
                ctx.rect(-imageObj.width / 2 + self.cutArea.get('left'), -imageObj.height / 2 + self.cutArea.get('top'),
                    self.cutArea.get('width'),
                    self.cutArea.get('height')
                );
            }
        });
    };

    this.createCanvas = function(canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
        this.canvas = new fabric.Canvas(canvas.id);
    };
}







class Screenshot {

    constructor() {
        this.apiEndpoint = 'http://web5.abcn.com:8080/screenshot';
        this.supportEmail = 'info@treehouse51.com';
        this.supportPhone = '949-346-5107';
        this.selectorIds = {
            cutBtn: 'bgsq-cut-btn',
            closeSnippingToolBtn: 'bgsq-close-snipping-tool',
            exitCutImage: 'bgsq-exit-cut-image',
            saveCutImage: 'bgsq-save-cut-image',
            drawArrow: 'bgsq-draw-arrow',
            drawText: 'bgsq-draw-text',
            cutImageBlockWrapper: 'bgsq-cut-image-block-wrapper',
            cutImageMainBlock: 'bgsq-cut-image-main-block',
            wrapperFullImageCanvas: 'bgsq-wrapper-full-image-canvas',
            imageSource: 'bgsq-image-source'
        }
        this.cutImage = new CutImage();
        this.cutArea = undefined;
        this.canvas = null;
        this.canvasId = 'fullImageCanvasDesktop';

        this._setBindings();

    }

    /** 
     * Get screenshot via api
     * @return {Promise} Promise object with screenshot encoded to base64 string
     */
    getScreenshot() {
        let data = {
            url: window.location.href,
            width: document.body.clientWidth,
            height: window.innerHeight,
            top: window.pageYOffset,
            left: window.pageXOffset,
            viewPortWidth: document.body.clientWidth,
            viewPortHeight: window.innerHeight,
            html: btoa(encodeURI(document.documentElement.innerHTML)),
        }
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'post',
                url: this.apiEndpoint,
                data: data,
                success: (resp) => {
                    if (resp.status === 'ok') {
                        resolve(resp.img);
                    } else {
                        reject(`Error occured. Please contact us email:${this.supportEmail} | phone:${this.supportPhone}`);
                    }
                },
                error: function(err) {
                    reject('err');
                }
            });
        });
    }

    /**
     * Enables snipping tool for screenshot
     * @param {String} base64Img screenshot encoded to base64 string
     */
    snip(base64Img) {
        this._setMarkup();
        this._handleSnippingToolClose();
        this._scrToCanvas(base64Img);
    }

    /** 
     * removes additional markup and hide snipping tool UI.
     */
    closeSnip() {
        this._hideSnippingTool();
        this.wrapperFullImageCanvas.parentNode.removeChild(this.wrapperFullImageCanvas);
        $('body').trigger('bgsq-close-snipping-tool');
    }

    /**
     * Set canvas filled with image passed to function.
     * This function prepears all necessary data/event listeners for further cropping
     * @param {String} base64Img 
     */
    _scrToCanvas(base64Img) {
        this._setMainCanvas(base64Img)
            .then(() => {
                let fullImage = document.createElement('img');
                this.fullImage = fullImage;
                fullImage.src = base64Img;

                this.fullImageCanvasFabric = new fabric.Canvas(this.canvasId, {
                    selectionColor: 'rgba(255, 0, 0, 0.1)'
                });

                fullImage.onload = () => {
                    this.fullImageFabric = new fabric.Image(fullImage, {
                        left: 0,
                        top: 0
                    });
                    this._setBackgroundImage(this.fullImageCanvasFabric, this.fullImageFabric);
                    this._showSnippingTool();

                    canvasContainer = this.fullImageCanvasFabric.contextContainer.canvas.offsetParent;
                    this.cutArea = new CutArea(this.fullImageCanvasFabric);

                    if ('ontouchstart' in window && 'ontouchmove' in window && 'ontouchend' in window) {
                        canvasContainer.addEventListener('touchstart', (event) => {
                            if (this.cutArea.overRect === false && this.cutArea.isRect === true) {
                                this._clearFullImage();
                            }
                            var statrX = event.changedTouches[0].pageX - canvasContainer.offsetLeft;
                            var statrY = event.changedTouches[0].pageY - canvasContainer.offsetTop;
                            this.cutArea.startCut(event, statrX, statrY);
                        });
                        canvasContainer.addEventListener('touchmove', (event) => {
                            this.cutArea.setCurrentCoordinates(event, 'mobile');
                        });
                        canvasContainer.addEventListener('touchend', (event) => {
                            this.cutArea.drawRect();
                        });
                    } else {
                        canvasContainer.addEventListener('mousedown', (event) => {

                            if (this.cutArea.overRect === false && this.cutArea.isRect === true) {
                                this._clearFullImage();
                            }
                            var statrX = event.pageX - canvasContainer.offsetLeft;
                            var statrY = event.pageY - canvasContainer.offsetTop;
                            this.cutArea.startCut(event, statrX, statrY);
                        });
                        canvasContainer.addEventListener('mousemove', (event) => {
                            this.cutArea.setCurrentCoordinates(event, 'desktop');
                        });
                        canvasContainer.addEventListener('mouseup', () => {
                            this.cutArea.drawRect();
                        });
                    }

                    this.fullImageCanvasFabric.on('mouse:over', (event) => {
                        if (event.target !== null && event.target !== undefined) {
                            this.cutArea.overRect = true;
                        }
                    });
                    this.fullImageCanvasFabric.on('mouse:out', (event) => {
                        if (event.target !== null && event.target !== undefined) {
                            this.cutArea.overRect = false;
                        }
                    });
                };
            });
    }

    _setMarkup() {
        this._createMainWrapper();
        this._createButtonsBlock();
        this._createMainCanvas();
    }

    _createMainWrapper() {
        this.wrapperFullImageCanvas = document.createElement('div');
        this.wrapperFullImageCanvas.className = 'bgsq-wrapper-full-image-canvas';
        this.wrapperFullImageCanvas.id = this.selectorIds.wrapperFullImageCanvas;
        document.body.appendChild(this.wrapperFullImageCanvas);
    }

    _createButtonsBlock() {
        let buttonsBlock = `
            <div class="bgsq-buttons-block">
                <p class="bgsq-btn cut-bgsq-btn bgsq-btn_new bgsq-btn_cut" id="${this.selectorIds.cutBtn}">
                    Snip <i id="bgsq-crosshair"></i><i class="bgsq-icon bgsq-icon_cut"></i>
                </p>
                <p class="bgsq-btn cut-bgsq-btn bgsq-btn_new bgsq-btn_close" id="${this.selectorIds.closeSnippingToolBtn}">
                    Close <i class="bgsq-icon bgsq-icon_close"></i>
                </p>
            </div>`;
        this.wrapperFullImageCanvas.innerHTML = buttonsBlock;
    }

    _createMainCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.canvasId;
        this.wrapperFullImageCanvas.appendChild(this.canvas);
    }

    /**
     * Set main canvas dimensions and background
     * @param {String} base64Img image encoded in base64
     * @return {Promise} proimise object, resolved when canvas filled.
     */
    _setMainCanvas(base64Img) {
        return new Promise((resolve, reject) => {
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = window.innerHeight;
            let ctx = this.canvas.getContext('2d');
            let image = new Image();
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
                resolve();
            }
            image.src = base64Img;
        });
    }

    _setBackgroundImage(canvas, image) {
        canvas.setBackgroundImage(image);
        canvas.renderAll();
    }

    _showSnippingTool() {
        this._stopScroll();
        $(this.wrapperFullImageCanvas).show();

    }

    _hideSnippingTool() {
        this._activateScroll();
        $(this.wrapperFullImageCanvas).hide();
    }

    _stopScroll() {
        window.scrollTo(0, 0);
        $('html, body').addClass('bgsq-stop-scroll');
    }

    _activateScroll() {
        $('html, body').removeClass('bgsq-stop-scroll');
    }

    _clearFullImage() {
        this.cutArea.reset();
        this.fullImageCanvasFabric.clear();
        this._setBackgroundImage(this.fullImageCanvasFabric, this.fullImageFabric);
    }

    /**
     * creates image slice via canvas
     */
    _cut() {
        if (this.cutArea.isRect === true && this.cutArea.rect.get('width') !== 0) {

            this.cutImage.width = Math.abs(this.cutArea.rect.get('width'));
            this.cutImage.height = Math.abs(this.cutArea.rect.get('height'));

            let cutImageCanvas = document.getElementById('cutImageCanvas');
            this.cutImage.cutArea = this.cutArea.rect;
            this.cutImage.setImage(this.fullImage);
            this.cutImage.createCanvas(cutImageCanvas);

            this.cutImageBlockWrapper = document.getElementById(this.selectorIds.cutImageBlockWrapper);
            this.cutImageBlockWrapper.style.display = 'block';
            this.cutImageBlockWrapper.style.height = window.innerHeight + 'px';
            this.cutImageBlockWrapper.style.width = window.innerWidth + 'px';
            this.cutImageBlockWrapper.style.overflow = 'auto';

            let cutImageCanvasWrapper = document.getElementById('cutImageCanvasWrapper');
            cutImageCanvasWrapper.style.width = this.cutImage.width + 'px';
            cutImageCanvasWrapper.style.height = this.cutImage.height + 'px';
            cutImageCanvasWrapper.style.marginLeft = -this.cutImage.width / 2 + 'px';
            cutImageCanvasWrapper.style.marginTop = -this.cutImage.height / 2 + 'px';

            let cutImageMainBlock = document.getElementById('cutImageMainBlock');
            if (cutImageMainBlock.offsetWidth - 2 < this.cutImage.width) {
                let cutImageMainBlockWidth = this.cutImage.width + 2;
                cutImageMainBlock.style.width = cutImageMainBlockWidth + 'px';
            }
            if (cutImageMainBlock.offsetHeight - 2 < this.cutImage.height) {
                let cutImageMainBlockHeight = this.cutImage.height + 2;
                cutImageMainBlock.style.height = cutImageMainBlockHeight + 'px';
            }

            let settingsPanel = document.getElementById('settingsPanel');
            cutImageMainBlock.style.marginLeft = -cutImageMainBlock.offsetWidth / 2 + 'px';
            cutImageMainBlock.style.marginTop = -(cutImageMainBlock.offsetHeight + settingsPanel.offsetHeight) / 2 + 'px';

            this._setBackgroundImage(this.cutImage.canvas, this.cutImage.image);
            this.cutImage.isCutImage = true;
            this._clearFullImage();
        }

    }


    _handleSnippingToolClose() {
        $(document).one('click', `#${this.selectorIds.closeSnippingToolBtn}`, () => {
            this.closeSnip();
        });
    }


    /**
     * Sets event listeners
     */
    _setBindings() {
        $(document).on('click', `#${this.selectorIds.cutBtn}`, () => {
            this._cut();
        });

        $(document).on('click', `#${this.selectorIds.exitCutImage}`, () => {
            this._closeCut();
        });

        $(document).on('click', `#${this.selectorIds.drawArrow}`, () => {
            this._drawArrow();
        });

        $(document).on('click', `#${this.selectorIds.drawText}`, () => {
            this._drawText();
        });

        $(document).on('click', `#${this.selectorIds.saveCutImage}`, () => {
            this._saveCutImage();
        });
    }

    /**
     * Close cutted images
     */
    _closeCut() {
        if (this.cutImage.isCutImage === true) {
            this.cutImageBlockWrapper.style.display = 'none';
            this.cutImage.canvas.dispose();
            this.cutImage.isCutImage = false;
            $(`#${this.selectorIds.cutImageMainBlock}`).removeAttr('style');
            $('body').removeClass('bgsq-super-prefix-fixed');
        }
    }

    _drawArrow() {
        let drawText = document.getElementById(this.selectorIds.drawText);
        drawText.className = '';
        let arrow = new fabric.Path('M466.679,233.337c0,2.819-1.307,5.479-3.541,7.199L240.58,411.641c-1.632,1.254-3.582,1.886-5.532,1.886 c-1.928,0-3.846-0.614-5.468-1.832c-3.257-2.453-4.478-6.786-2.976-10.586l44.748-113.292H9.079c-5.019,0-9.079-4.066-9.079-9.079 v-90.789c0-5.019,4.061-9.079,9.079-9.079h262.272L226.604,65.572c-1.501-3.798-0.281-8.13,2.982-10.586 c3.257-2.459,7.761-2.447,10.994,0.054l222.558,171.107C465.372,227.857,466.679,230.518,466.679,233.337z');
        arrow.set({
            left: this.cutImage.canvas.get('width') / 2 - 18,
            top: this.cutImage.canvas.get('height') / 2 + 24,
            angle: -90,
            fill: '#b23232',
            scaleX: 0.1,
            scaleY: 0.1
        });
        this.cutImage.canvas.add(arrow);
        this.cutImage.canvas.renderAll();
    }

    _drawText() {
        let drawText = document.getElementById(this.selectorIds.drawText);
        drawText.className = 'active';
        $('body').addClass('bgsq-super-prefix-fixed');
        let textbox = new fabric.Textbox('Enter Text Here...', {
            fontSize: 16,
            fontFamily: 'Arial',
            backgroundColor: '#fff',
            fill: '#ff0000',
            width: 150
        });
        this.cutImage.canvas.add(textbox);
        this.cutImage.canvas.renderAll();
    }

    /** 
     * Encode cutted image to base64 string and set it as textarea value  
     */
    _saveCutImage() {
        let finalCanvas = document.createElement('canvas');
        finalCanvas.width = this.cutImage.canvas.get('width');
        finalCanvas.height = this.cutImage.canvas.get('height');
        let finalImg = document.createElement('img');
        finalImg.src = this.cutImage.canvas.toDataURL();
        finalImg.onload = () => {
            let ctxFinal = finalCanvas.getContext('2d');
            ctxFinal.drawImage(finalImg, 0, 0);
            $(`#${this.selectorIds.imageSource}`).val(this.cutImage.canvas.toDataURL());
            if (this.cutImage.isCutImage === true) {
                this.cutImageBlockWrapper.style.display = 'none';
                this.cutImage.canvas.dispose();
                this.cutImage.isCutImage = false;
                $(`#${this.selectorIds.cutImageMainBlock}`).removeAttr('style');
            }
            $('body').removeClass('bgsq-super-prefix-fixed');
            this.closeSnip();
        };
    }

}

export default Screenshot;