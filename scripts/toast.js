export function toast(message, duration) {
  const toast = document.createElement("ion-toast");
  toast.message = message;
  toast.duration = duration;
  document.body.appendChild(toast);
  return toast.present();
}
