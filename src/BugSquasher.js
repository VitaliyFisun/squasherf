import { jQuery as $ } from './vendor/vendor';
import BugSquasherHelper from './Helper';
import Modal from './Modal';
import Screenshot from './Screenshot';
class BugSquasher {
    constructor() {
        this.helper = new BugSquasherHelper;
        this.modal = new Modal;
        this.screenshot = new Screenshot;
        this.apiEndpoint = 'http://localhost/squasher/index.php';
        this.btnOne = $('#bgsq-open-bug-squasher');
        this.mainContainer = $('.bgsq-tw-bs4.bgsq-form-container');
        this.containerOne = $(".bgsq-form-container__container-one");
        this.containerTwo = $(".bgsq-form-container__container-two");
        this.containerThree = $(".bgsq-form-container__container-three");
        this.userName = $("#bgsq-user-name");
        this.userEmail = $("#bgsq-user-email");
        this.btnTwo = $("#bgsq-btn-two");
        this.uploadScrBtn = $('#bgsq-upload-screenshot');
        this.fileUpload = $('#bgsq-file-upload');
        this.scrBase64 = $('#bgsq-screenshot-base64');
        this.imageSource = $('#bgsq-image-source');
        this.takeScreenShotBtn = $('#bgsq-canvas-screen');
        this.snippingToolBtn = $('#bgsq-crop');
        this.loadingOverlayId = 'bgsq-loading-overlay';
        this.changeColor = $('#bgsq-change-color');
        this.colorCode = $('#bgsq-color-code');
        this.videoUrl = $('#bgsq-video-url');
        this.bugSummary = $('#bgsq-bug-summary');
        this.bugUrgency = $('#bgsq-bug-urgency');
        this.submitBtn = $('#bgsq-btn-three');
    }

    init() {

        this.createOverlay();

        let _userName = this.helper.readCookie('_userName');
        let _userEmail = this.helper.readCookie('_userEmail');
        if (_userName && _userEmail) {
            this.userName.val(_userName);
            this.userEmail.val(_userEmail);
        }

        this.btnOne.on('click', (e) => {
            this.btnOneClick(e);
        });

        this.btnTwo.on('click', (e) => {
            this.btnTwoClick(e);
        });

        this.uploadScrBtn.on('click', (e) => {
            this.fileUpload.click();
        });

        this.fileUpload.on('change', (e) => {
            this.uploadScreen(e);
        });

        this.takeScreenShotBtn.on('click', (e) => {
            this.takeScreenShot(e);
        });

        this.snippingToolBtn.on('click', (e) => {
            this.showCroppingTool(e);
        });

        $(document).on('click', '.bgsq-close-btn-link', (e) => {
            let btn = e.target;
            $(btn).parent().slideUp('fast', () => {
                this.containerOne.fadeIn('fast');
            });
        });

        $('body').on('bgsq-close-snipping-tool', (e) => {
            this.mainContainer.slideDown('fast');
        });

        this.changeColor.on('change', (e) => {
            this._handleChangeColor(e);
        });

        this.submitBtn.on('click', (e) => {
            let target = $(e.target).attr('disabled', 'disabled');
            this._submitBug(e)
                .then((resp) => {
                    this.modal.showModalTemplate({
                        sqModalTopRight: resp,
                        sqModalBottom: '',
                        dataSqIcon: 'sq-taken'
                    });
                    target.removeAttr('disabled');
                })
                .catch((err) => {
                    this.modal.showModalTemplate({
                        sqModalTopRight: err,
                        sqModalBottom: '',
                        dataSqIcon: 'sq-taken'
                    });
                    target.removeAttr('disabled');
                });
        });
    }

    btnOneClick(e) {
        this.containerOne.fadeOut('fast', () => {
            if (this.hasCredentials()) {
                this.btnTwo.click();
            } else {
                this.containerTwo.slideDown('fast');
            }
        });

    }

    btnTwoClick(e) {
        if (this.hasCredentials()) {
            this.containerTwo.slideUp('fast', () => {
                this.containerThree.slideDown('fast');
            });
            this.helper.setCookie("_userName", this.userName.val(), 365);
            this.helper.setCookie("_userEmail", this.userEmail.val(), 365);
        } else {
            this.modal.showModalTemplate({
                sqModalTopRight: 'Please enter your user name and valid email',
                sqModalBottom: '',
                dataSqIcon: 'bug-crosshair'
            });
            return false;
        }
    }

    hasCredentials() {
        return this.userName.val() && this.userEmail.val() && this.helper.validateEmail(this.userEmail.val());
    }

    uploadScreen(e) {
        if (!e.target.value) {
            return false;
        }

        this.helper.fileToBase64(e.target.files[0])
            .then((val) => {
                this.scrBase64.val(val);
            })
            .catch((err) => {
                alert(err);
            })

    }

    takeScreenShot(e) {

        this.mainContainer.hide(0);

        this.screenshot.getScreenshot()
            .then((base64Img) => {
                this.scrBase64.val(base64Img);
                this.modal.showModalTemplate({
                    sqModalTopRight: 'Screenshot Taken & Saved',
                    sqModalBottom: '',
                    dataSqIcon: 'sq-taken'
                });
                this.hideOverlay();
                this.mainContainer.show();
            })
            .catch((err) => {
                this.modal.showModalTemplate({
                    sqModalTopRight: err,
                    sqModalBottom: '',
                    dataSqIcon: 'sq-taken'
                });
                this.hideOverlay();
                this.mainContainer.show();
            });

        this.showOverlay();
        this.modal.showModalTemplate({
            sqModalTopRight: 'The Bug Squasher Is Taking<br class="hidden-xs">A Screenshot....',
            sqModalBottom: 'Depending On Page Content This Could Take A Moment...',
            dataSqIcon: 'bug-crosshair'
        });
    }

    showCroppingTool(e) {
        this.mainContainer.hide();
        this.beforeCropping()
            .then(() => {
                this.screenshot.snip(this.scrBase64.val());
            })
            .catch((err) => {
                alert(err);
            });
    }

    beforeCropping() {
        return new Promise((resolve, reject) => {
            if (!this.scrBase64.val()) {
                
                this.screenshot.getScreenshot()
                    .then((base64Img) => {
                        this.scrBase64.val(base64Img);
                        this.modal.showModalTemplate({
                            sqModalTopRight: 'Screenshot Taken',
                            sqModalBottom: 'Highlight The Area You Want To Snip',
                            dataSqIcon: 'sq-taken'
                        });
                        this.hideOverlay();
                        resolve();
                    })
                    .catch((err) => {
                        this.modal.showModalTemplate({
                            sqModalTopRight: err,
                            sqModalBottom: '',
                            dataSqIcon: 'sq-taken'
                        });
                        this.hideOverlay();
                        reject(err);
                    });

                this.showOverlay();
                this.modal.showModalTemplate({
                    sqModalTopRight: 'The Bug Squasher Is Taking<br class="hidden-xs">A Screenshot....',
                    sqModalBottom: 'Depending On Page Content This Could Take A Moment...',
                    dataSqIcon: 'bug-crosshair'
                });

            } else {
                resolve();
            }
        });
    }


    createOverlay() {
        $('body').append(`<div id="${this.loadingOverlayId}"><img src="http://testdomain727.tk/images/squasher-loader.gif" alt="" /></div>`);
    }

    showOverlay() {
        $(`#${this.loadingOverlayId}`).show();
    }

    hideOverlay() {
        $(`#${this.loadingOverlayId}`).hide();
    }

    _handleChangeColor(e) {
        this.colorCode.parent().toggleClass('bgsq-d-none');
    }

    _validateForm() {
        let errors = [];
        if (!this.bugSummary.val()) {
            errors.push('You must provide bug description.');
        }
        if (!this.bugUrgency.val()) {
            errors.push('You must select bug urgency.');
        }
        if (this.changeColor.val() == 'yes' && !this.colorCode.val()) {
            errors.push('If you are requesting color change — you have to provide color code.');
        }
        return errors;
    }

    _submitBug(e) {
        let errors = this._validateForm();
        if (errors.length) {
            return Promise.reject(errors.join('<br>'));
        }

        let screenshot;
        let videoUrl;
        let changeColor;
        let colorCode;
        let bugSummary;
        let bugUrgency;

        if (this.imageSource) {
            screenshot = this.imageSource.val();
        } else {
            screenshot = this.scrBase64.val();
        }

        videoUrl = this.videoUrl.val();
        if (this.changeColor.val() == 'yes') {
            changeColor = this.changeColor.val();
            colorCode = this.colorCode.val();
        }

        bugSummary = this.bugSummary.val();
        bugUrgency = this.bugUrgency.val();

        let data = {
            screenshot,
            videoUrl,
            changeColor,
            colorCode,
            bugSummary,
            bugUrgency
        }

        return new Promise((resolve, reject) => {
            $.post(this.apiEndpoint, data, null, 'json')
                .done((resp) => {
                    if (resp.status == 'ok') {
                        resolve('Thank You For Catching That Bug!')
                    } else {
                        reject(resp.message);
                    }
                })
                .fail((err) => {
                    reject('Internal Server Error');
                });
        });
    }


}

export default BugSquasher;