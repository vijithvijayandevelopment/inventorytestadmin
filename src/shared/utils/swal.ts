import Swal from 'sweetalert2'

export const SmallSwal = Swal.mixin({
    customClass: {
        popup: 'swal-sm',
    },
    showClass: {
        popup: 'swal-scale-in',
    },
    hideClass: {
        popup: 'swal-scale-out',
    },
    buttonsStyling: true,
    animation: true,
})
