import Swal from 'sweetalert2';

export function showSuccess(message) {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#2563EB',
    confirmButtonText: 'Great!'
  });
}

export async function confirmDelete() {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });
  return result.isConfirmed;
}

export function showError(message) {
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonColor: '#d33'
  });
}