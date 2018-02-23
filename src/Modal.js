import { jQuery as $ } from './vendor/vendor';
class Modal {
    constructor() {
        this.modal = $('#bgsq-modal-template');
        $('[data-bgsq-action="close"]').on('click', this.closeSQModal);
    }

    showModalTemplate(data) {
        if (!data || typeof data.sqModalBottom === 'undefined' || typeof data.sqModalTopRight === 'undefined' || typeof data.dataSqIcon === 'undefined') {
            return false;
        }

        this.modal.find('.bgsq-modal__top__right').html(data.sqModalTopRight);
        this.modal.find('.bgsq-modal__bottom').html(data.sqModalBottom);
        this.modal.attr('data-bgsq-icon', data.dataSqIcon);
        $('body').addClass('show-bgsq-modal-special');
    }

    closeSQModal() {
        $('body').removeClass('show-bgsq-modal-special');
    }
}

export default Modal;