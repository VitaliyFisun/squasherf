export default `<div class="bgsq-cut-image-block-wrapper" id="bgsq-cut-image-block-wrapper">
    <div class="bgsq-cut-image-main-block" id="cutImageMainBlock">
        <div class="draw-panel" id="drawPanel">
            <ul>
                <li id="bgsq-draw-arrow"><i class="bgsq-icon bgsq-icon_arrow" aria-hidden="true"></i></li>
                <li id="bgsq-draw-text">A</li>
            </ul>
        </div>
        <div class="settings-panel" id="settingsPanel">
            <ul class="inlinefix">
                <li id="bgsq-save-cut-image" class="save-cut-image">Save</li>
                <li id="bgsq-exit-cut-image" class="exit-cut-image">Exit</li>
            </ul>
        </div>
        <div class="cut-image-canvas-wrapper" id="cutImageCanvasWrapper">
            <canvas id="cutImageCanvas" class="cut-image-canvas"></canvas>
        </div>
    </div>
</div>


<div class="bgsq-d-none" id="image_preview">
    <div class="bgsq-full-image-canvas-wrapper">
        <canvas id="fullImageCanvas" width="800" height="600" class="bgsq-full-image-canvas"></canvas>
    </div>
    <div class="bgsq-full-image-wrapper">
        <img src="" alt="" id="fullImage">
    </div>
    <p class="bgsq-btn cut-bgsq-btn bgsq-btn_new bgsq-btn_cut" id="cutBtn">Snip <i id="crosshair"></i><i class="bgsq-icon bgsq-icon_cut"></i></p>
    <p class="bgsq-btn cut-bgsq-btn bgsq-btn_new bgsq-btn_close" id="close">Close <i class="bgsq-icon bgsq-icon_close"></i></p>
</div>



<div class="bgsq-tw-bs4 bgsq-form-container" style="z-index:99999;">
    <div class="bgsq-form-container__container-one ">
        <button type="button" id="bgsq-open-bug-squasher" class="bgsq-btn bgsq-btn_new bgsq-btn_squash">Submit Bug <i class="bgsq-icon bgsq-icon_bug"></i></button>
    </div>
    <div class="bgsq-form-container__container-two">
        <div class="bgsq-close-btn-link">&times;</div>
        <div class="bgsq-form-header"></div>
        <div class="bgsq-form-group">
            <label class="bgsq-form-group__label" for="bgsq-user-name">Name</label>
            <input type="email" class="bgsq-form-group__form-control" name="userName" id="bgsq-user-name" placeholder="Your Name" value="">
        </div>
        <div class="bgsq-form-group">
            <label class="bgsq-form-group__label" for="bgsq-user-email">Email</label>
            <input type="email" class="bgsq-form-group__form-control" id="bgsq-user-email" name="userEmail" placeholder="Your Email" value="">
        </div>
        <button type="submit" id="bgsq-btn-two" class="bgsq-btn bgsq-btn_new bgsq-btn_submit">Submit Bug</button>
    </div>

    <div class="bgsq-form-container__container-three">
        <div class="bgsq-close-btn-link">&times;</div>
        <div class="bgsq-form-header"></div>
        <div class="bgsq-form-group bgsq-form-group_large">
            <button type="button" id="bgsq-upload-screenshot" class="bgsq-btn bgsq-btn_new bgsq-btn_upload">Upload Screenshot <i class="bgsq-icon bgsq-icon_upload"></i></button>
            <button type="button" id="bgsq-canvas-screen" class="bgsq-btn bgsq-btn_new bgsq-btn_take">Take Screenshot <i class="bgsq-icon bgsq-icon_take"></i></button>
            <button type="button" id="bgsq-crop" class="bgsq-btn bgsq-btn_new bgsq-btn_crop">Snipping Tool <i class="bgsq-icon bgsq-icon_crop"></i></button>
            <img src="http://testdomain727.tk/images/ajax-loader.gif" class="screen_loader">

        </div>
        <div id="screen_container" class="bgsq-d-none"></div>
        <input type="file" id="bgsq-file-upload" style="display:none !important;">
        <div class="bgsq-form-group">
            <label class="bgsq-form-group__label" for="bgsq-bug-summary">Bug Summary</label>
            <textarea class="bgsq-form-group__form-control" id="bgsq-bug-summary" rows="3"></textarea>
        </div>

        <div class="bgsq-form-group">
            <label class="bgsq-form-group__label" for="bgsq-video-url">Video URL</label>
            <input type="text" class="bgsq-form-group__form-control" id="bgsq-video-url" autocomplete="off">
        </div>

        <div class="bgsq-form-group ">
            <label class="bgsq-form-group__label" for="bgsq-change-color">Color Change Request</label>
            <select class="bgsq-form-group__form-control" id="bgsq-change-color" name="bgsq-change-color">
                <option value="no">No</option>
                <option value="yes">Yes</option>
            </select>
        </div>

        <div class="bgsq-form-group bgsq-d-none">
            <label class="bgsq-form-group__label" for="bgsq-color-code">Select Color</label>
            <input type="text" class="bgsq-form-group__form-control" id="bgsq-color-code" value="#ff0000" autocomplete="off">
        </div>

        <div class="bgsq-form-group">
            <label class="bgsq-form-group__label" for="bgsq-bug-urgency">Bug Urgency</label>
            <select class="bgsq-form-group__form-control" id="bgsq-bug-urgency">
              <option value="">Select Urgency</option>
              <option value="i_see_a_bug">I See A Bug</option>
              <option value="trap_and_contain">Trap &amp; Contain Bug</option>
              <option value="squash_now">Squash Now</option>
            </select>

        </div>

        <div class="bgsq-form-group">
            <button type="submit" id="bgsq-btn-three" class="bgsq-btn bgsq-btn_new bgsq-btn_submit">Squash This </button>
            <img src="http://testdomain727.tk/images/ajax-loader.gif" class="ajax_loader">
        </div>

    </div>
</div>


<form action="#" style="display:none !important" method="post" enctype="multipart/form-data" id="bgsq-bug-form">
    <textarea id="bgsq-screenshot-base64"></textarea>
    <textarea id="bgsq-image-source" class="bgsq-d-none"></textarea>
</form>

<div class="bgsq-modal" id="bgsq-modal-template">
    <div class="bgsq-modal__overlay"></div>
    <div class="bgsq-modal__body">
        <div class="bgsq-modal__top">
            <div class="bgsq-modal__top__left"></div>
            <div class="bgsq-modal__top__right"></div>
        </div>
        <div class="bgsq-modal__bottom"></div>
        <i class="bgsq-modal__close" data-bgsq-action="close">&times;</i>
        <button class="bgsq-btn bgsq-btn_primary bgsq-btn_sq" data-bgsq-action="close">OK</button>

    </div>
</div>`;